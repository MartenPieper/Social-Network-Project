import React from "react";
import { Link } from "react-router-dom";
import axios from "./axios";
import FriendButton from "./invite"

export default class OtherPersonProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            first: "",
            last:"",
            profilepic:"",
            notification:""
        };
    }

    async componentDidMount() {
    // console.log("this.props.match.params.id", this.props.match.params.id)
        try {
            const resp = await axios.get(`/user/${this.props.match.params.id}/info`);
            // console.log("this.props.match.params.id in axios.get", this.props.match.params.id)
            // console.log("resp.data.data.userId", resp.data.userId)
            if (resp.data.userId == this.props.match.params.id ) {
                this.props.history.push("/")
            } else {

            this.setState({
                        userId: resp.data.userId,
                        first: resp.data.data.rows[0].first,
                        last: resp.data.data.rows[0].last,
                        profilepic: resp.data.data.rows[0].profilepic,
                        id: resp.data.data.rows[0].id})
            }
            // console.log("resp.data in axios.get /user/:id/info", resp.data)
        } catch (err) {
            console.log("Error in axios.get /user/:id/info", err);
             this.props.history.push("/")
        }


    }



    render() {
        return (
            <div className="opp-container">
            <h1> {this.state.last} {this.state.first} </h1>
            <img src = { this.state.profilepic || "/default.png" } />
            <FriendButton otherUserId={this.props.match.params.id} />
            <Link  to="/user/2">
                user 2
            </Link>
            </div>
        );
    }

}


// FROm LINK: onClick={this.props.match.params.id}
