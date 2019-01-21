import React from "react";
import { connect } from 'react-redux';
import { renderOnlineUsers } from "./actions"


class OnlineUsers extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        if(!this.props.onlineUsers) {
            return null
        }
        return (
            <div>
            {this.props.onlineUsers && this.props.onlineUsers.map(
            onlineUser => {
                return (
                    <div key={onlineUser.id}>
                    <img src ={onlineUser.profilepic || "./default.png"} />
                    {onlineUser.first} {onlineUser.last}
                    </div>
                )
            }
            )}
            </div>
        )
    }

}

function mapStateToProps(state) {
    var list = state.onlineUsers;
    return {
        onlineUsers: list
    };
}

export default connect(mapStateToProps)(OnlineUsers);
