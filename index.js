const express = require("express");
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, { origins: 'localhost:8080' });
const compression = require("compression");
const bodyParser = require("body-parser");
const csurf = require("csurf");
const db = require("./db");
var bcrypt = require("./bcrypt");
const s3 = require("./s3");

// Boilerplate code
var multer = require("multer");
var uidSafe = require("uid-safe");
var path = require("path");
app.use(bodyParser.json());

var diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            // uidSafe takes the image name and makes it into a 24 character unique name.
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152 // Files you upload cannot be greater than 2MB
    }
});

app.use(compression());

app.use(bodyParser.json({ limit: "50mb" }));

app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: false
  })
);

const cookieSession = require('cookie-session');
const cookieSessionMiddleware = cookieSession({
    secret: process.env.SESSION_SECRET || require("./secrets").secret,
    maxAge: 1000 * 60 * 60 * 24 * 90
});

app.use(cookieSessionMiddleware);
io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(csurf());

app.use((req, res, next) => {
    res.cookie('mytoken', req.csrfToken());
    next();
});

app.use(express.static("./public"));

if (process.env.NODE_ENV != "production") {
  app.use(
    "/bundle.js",
    require("http-proxy-middleware")({
      target: "http://localhost:8081/"
    })
  );
} else {
  app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

app.post("/registration", (req, res) => {
  bcrypt
    .hash(req.body.password)
    .then((hash) => {
      return db.createLogin(
        req.body.first,
        req.body.last,
        req.body.email,
        hash
      );
    })
    .then((results) => {
      req.session.userId = results.rows[0].id;
      res.json({
        success: true
      });
    })
    .catch((err) => {
      console.log("error: ", err);
      res.json(
        err.column
      );
    });
});


app.post("/login", (req, res) => {
    db.getUser(req.body.email)
        .then(results => {
            return bcrypt
                .compare(req.body.password, results.rows[0].password)
                .then((matches) => {
                    if (matches == true) {
                        res.json({
                          success: true
                        });
                    } else {
                        throw new Error();
                    }
                });
        }).catch(err => {
            console.log("Error in POST /login", err);

            res.json({
              success: false
            });

        });
});

app.get('/welcome', (req, res) => {
    if (req.session.userId) {
        res.redirect('/');
    } else {
        res.sendFile(__dirname + '/index.html');
    }
});

app.get("/user", (req,res) => {
    db.getUserPic(req.session.userId).then(results => {
        res.json({
            first: results.rows[0].first,
            last: results.rows[0].last,
            id: results.rows[0].id,
            email: results.rows[0].email,
            bio: results.rows[0].bio,
            profilePicUrl:results.rows[0].profilepic
            })
    })
})

app.post("/upload", uploader.single("file"), s3.upload, (req,res) => {
    const configLink = "https://s3.amazonaws.com/pieper-catnip-socialnetwork/";
    let s3Url = configLink + req.file.filename

    if(req.file) {
        db.uploadProfilePic(req.session.userId, s3Url).then(results => {
            res.json({
                id:  results.rows[0].id,
                imgurl: results.rows[0].profilepic})
        }).catch(err => {
            console.log("error in app.post", err)
        });
    } else {
        res.json({
            success: false
        });
    }
})


app.post("/bio", (req,res) => {
    db.uploadBio(req.session.userId, req.body.bio).then(results => {
        res.json({
            id:  results.rows[0].id,
            bio: results.rows[0].bio})
    }).catch(err => {
        console.log("error in app.post", err)
    });
})

app.get("/user/:id/info", (req,res) => {
    db.getOtherUser(req.params.id).then(data => {
        res.json({userId: req.session.userId, data: data})
    }).catch(err => {
        res.json(err)
    })
})

app.get("/status/:id", (req,res) => {
    db.getStatus(req.params.id, req.session.userId).then(data => {
        res.json(data)
    }).catch(err => {
        console.log("Error in app.get /status/:id", err)
    })
})

app.post("/invite/:id", (req,res) => {
    db.sendInvite(req.params.id, req.session.userId).then(data => {
        res.json(data)
    }).catch(err => {
        console.log("Error in app.post /invite/:id")
    })
})

app.post("/accept/:id", (req,res) => {
    db.sendAccept(req.params.id, req.session.userId).then(data => {
        res.json(data)
    }).catch(err => {
        console.log("Error in app.post /invite/:id")
    })
})

app.post("/cancel/:id", (req,res) => {
    db.sendCancel(req.params.id, req.session.userId).then(data => {
        res.json(data)
    }).catch(err => {
        console.log("Error in app.post /cancel/:id")
    })
})

app.get("/receiveFriendsAndWannabes", (req,res) => {
    db.getFriendsAndWannabes(req.session.userId).then(data=> {
        res.json(data)
    }).catch(err => {
        console.log("Error in app.get /receiveFriendsAndWannabes")
    })
})

app.post("/unfriend", (req,res) => {
    db.sendCancel(req.body.id, req.session.userId).then(data =>{
        res.json({success: "true"})
    }).catch(err => {
        console.log("Error in app.post /unfriend")
    })
})

app.post("/acceptRequest", (req,res) => {
    db.sendAccept(req.body.id, req.session.userId).then(data =>{
        res.json({success: "true"})
}).catch(err => {
    console.log("Error in app.post /acceptRequest")
})
})

app.get("/logout", (req, res) => {
    req.session.userId = null;
    res.redirect('/welcome');
});

app.get("*", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

server.listen(process.env.PORT || 8080, function() {
  console.log("I'm listening.");
});

let onlineUsers = {}

io.on("connection", socket => {
    console.log(`User with socket id ${ socket.id } just connected`);
    console.log(socket.request.session.userId)

    let socketId = socket.id;
    let userId = socket.request.session.userId;

    onlineUsers[socketId] = userId;
    console.log("online users: ", onlineUsers)

    let arrOfIds = Object.values(onlineUsers)

    db.getUsersByIds(arrOfIds).then(results => {
        console.log("results", results)
        socket.emit("onlineUsers", results.rows);
    }).catch(err => {
        console.log("error in getUsersByIds", error)
    })

    if (arrOfIds.filter(id => id == userId).length == 1) {
        console.log("this is from DAVID id: ", userId);

        db.getUserById(userId).then(result => {
            socket.broadcast.emit("userJoined", result.rows[0]);

            console.log("Joined ID is: ", result.rows[0]);
        });
    }

    socket.on('disconnect', () => {
            console.log(`socket with id ${ socketId } just disconnected`);
            delete onlineUsers[socket.id]
            io.sockets.emit("userLeft", userId)
        });

        // Chat Data flow #1:
        // build array of 10 most recent chat messages
        // emit that array to the client

        db.getMessages().then(results => {
            console.log("results.rows in getMessages", results.rows)
            socket.emit("chatMessage",results.rows)
        })

        // Chat Data flow #2

        // POST request to message table
        socket.on("newMessage", msg => {
            db.updateMessages(msg, userId).then(results => {

                db.getnewMessage(results.rows[0].id).then(results => {

                    let chatObj = {
                        message: msg,
                        first: results.rows[0].first,
                        last: results.rows[0].last,
                        profilepic: results.rows[0].profilepic,
                        message_id: results.rows[0].message_id
                    }

                io.sockets.emit("newMessageInfo", chatObj)
            })

            })

        });

// Pass emit 2 arguments -
// 1. Name of the emit message (has to be string)
// 2. Any data as part of the message (can be string, object etc.), e.g. result from db.query, API etc.
    // socket.emit("catnip", "socket fun!!")


})
