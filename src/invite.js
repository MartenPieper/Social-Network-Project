import React from "react";
import { Link } from "react-router-dom";
import axios from "./axios";

export default class FriendButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            buttonText: ""
        };

        this.handleClick = this.handleClick.bind(this)
    }

    async componentDidMount() {
        try {
            const resp = await axios.get(`/status/${this.props.otherUserId}`);
            console.log("resp in axios.get /status/:id", resp)
            if (!resp.data.rows[0]) {
                this.setState({
                    buttonText: "Invite"
                })
            } else if (resp.data.rows[0].accepted) {
                this.setState({
                    buttonText: "Unfriend"
                })
            } else if (!resp.data.rows[0].accepted) {
                if (this.props.otherUserId == resp.data.rows[0].sender_id) {
                    this.setState({
                        buttonText: "Accept"})
                } else {
                    this.setState({
                        buttonText: "Cancel"
                    })
                }
            }

        } catch (err) {
            console.log("Error in invite.js", err);
        }
    }

     async handleClick() {
        try {

            if (this.state.buttonText == "Invite") {
                // axios.post to insert that friend request has been sent.
                const resp = await axios.post(`/invite/${this.props.otherUserId}`)
                return this.setState({
                    buttonText: "Cancel"
                })
            } else if (this.state.buttonText == "Accept") {
                // axios.post to update that friend request was accepted.
                const resp = await axios.post(`/accept/${this.props.otherUserId}`)
                this.setState({
                    buttonText: "Unfriend"
                })
            } else if (this.state.buttonText ="Cancel") {
                // axios.post to delete the friendship
                const resp = await axios.post(`/cancel/${this.props.otherUserId}`)
                this.setState({
                    buttonText: "Invite"
                })
            } else if (this.state.buttonText == "Unfriend") {
                // axios.post to delete the friendship
                const resp = await axios.post(`/cancel/${this.props.otherUserId}`)
                this.setState({
                    buttonText: "Invite"
                })
            }

        } catch (err) {
    console.log("Error in axios.post /invite/:id", err);
 }
}

    render() {
        return (
            <div className="invite-container">
             <button onClick={this.handleClick}>{ this.state.buttonText }</button>
            </div>
        );
    }

}
