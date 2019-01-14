const knox = require("knox");
const fs = require("fs");
let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets"); // secrets.json is in .gitignore
}

// console.log("secrets", secrets);

const client = knox.createClient({
    key: secrets.AWS_KEY,
    secret: secrets.AWS_SECRET,
    bucket: "pieper-catnip-socialnetwork"
});

exports.upload = function(req, res, next) {
    if (!req.file) {
        return res.sendStatus(500);
    }

    // Configuring the request for Amazon S3
    const s3Request = client.put(req.file.filename, {
        "Content-Type": req.file.mimetype,
        "Content-Length": req.file.size,
        "x-amz-acl": "public-read"
    });

    //Sending the request to Amazon S3
    const readStream = fs.createReadStream(req.file.path);
    readStream.pipe(s3Request);

    // Receiving the respoonse from Amazon S3
    s3Request.on("response", s3Response => {
        console.log("status code of response", s3Response.statCode);

        const wasSuccessful = s3Response.statusCode == 200;
        if (wasSuccessful) {
            next();
        } else {
            res.sendStatus(500);
        }
    });
};
