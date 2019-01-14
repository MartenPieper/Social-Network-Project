import React from "react";
import axios from "./axios";
import Logo from "./logo";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";
import Profile from "./profile";
import { BrowserRouter, Route } from 'react-router-dom';
import OtherPersonProfile from "./otherpersonprofile";
import Friends from "./friends";
import OnlineUsers from "./onlineusers"
import Chat from "./chat"
import Logout from "./logout"

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            uploaderIsVisible: false,
            setBio: ""
        };
        this.showUploader = this.showUploader.bind(this);
        this.changePic = this.changePic.bind(this);
        this.hideUploader = this.hideUploader.bind(this);
        this.setBio = this.setBio.bind(this);
    }

    showUploader() {
        this.setState({
            uploaderIsVisible: true
        });
    }

    hideUploader(){
        this.setState({
            uploaderIsVisible: false
        });
    }

    changePic(url) {
        this.setState({
            profilePicUrl: url,
            uploaderIsVisible: false
        });
}

    setBio(bio) {
        this.setState({
            bio: bio
        })
    }


// #2 the componentDidMount runs

// You can use object destructoring and replace resp with { data }
    // componentDidMount() {
        // console.log("component mounted!!!")
        // axios.get("/user").then(( { data }) => {
        //     console.log("resp in axios.get /user", data)
        //     this.setState(data, () => console.log("this state in then of axios.get", this.state))
        // })
    // }

// componentDidMount as async/ await function
      async componentDidMount() {
          try {
              const resp = await axios.get("/user");
             // console.log("resp.data in axios.get /user", resp.data)
              this.setState(resp.data);
          } catch (err) {
              console.log("ERROR IN GETTING USER", err);
          }
    }



// #1 it renders the page
    render() {
        return (
        <div>
            <Logo />
            <h1>Image from app.js</h1>
            <ProfilePic
            first = { this.state.first}
            profilePicUrl = { this.state.profilePicUrl }
            showUploader = { this.showUploader }
            />
            <Logout />


            <BrowserRouter>
                    <div>
                        <Route exact path="/"
                        render = {() => {
                            return <Profile
                                id={this.state.id}
                                first={this.state.first}
                                last={this.state.last}
                                profilePicUrl={this.state.profilePicUrl}
                                bio={this.state.bio}
                                setBio={this.setBio}
                                showUploader={this.showUploader}
                            />
                        }}
                        />

                        <Route path="/user/:id"
                        render = {(props) => {
                                return (<OtherPersonProfile { ...props }
                                key = { props.match.url }
                                id = {this.state.id}
                                />)
                            }}
                            />

                            <Route
                          path="/friends"
                          component={Friends}
                      />

                      <Route
                    path="/onlineusers"
                    component={OnlineUsers}
                />

                <Route
              path="/chat"
              component={Chat}
          />

                    </div>


            </BrowserRouter>

            { this.state.uploaderIsVisible && <Uploader
                    userID = {this.state.userId}
                    changePic = {this.changePic}
                    hideUploader = {this.hideUploader}
                /> }

        </div>
    );
    }
}
