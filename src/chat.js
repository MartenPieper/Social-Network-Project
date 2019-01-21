import React from "react";
import { connect } from 'react-redux';
import { initSocket } from "./socket";

class Chat extends React.Component {
    constructor(props) {
        super(props);
    }

    sendMessage(e) {
        let socket = initSocket()
        if(e.which === 13) {
            console.log("user's message", e.target.value)
            socket.emit("newMessage", e.target.value)

        }
    }

    componentDidUpdate() {
        console.log("this.elem", this.elem)
        this.elem.scrollTop = this.elem.scrollHeight
    }

    render() {

        console.log("this.props.liveMessages", this.props.liveMessages)
        return (
            <div>
            <div className = "chat-messages-container" ref={elem => (this.elem = elem)}>

            {this.props.liveMessages && this.props.liveMessages.map(
                liveMessage => {
                    return (
                        <div key={liveMessage.message_id}>
                        <img src ={liveMessage.profilepic || "./default.png"} />
                        {liveMessage.first} {liveMessage.last}
                        {liveMessage.message}
                        </div>
                    )
                }
            )}
            </div>
            <textarea onKeyDown = { this.sendMessage } />
            </div>
        )
    }

}

function mapStateToProps(state) {
return {
    liveMessages: state.messageDetails
};
}

export default connect(mapStateToProps)(Chat);
