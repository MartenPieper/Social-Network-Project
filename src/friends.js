import React from "react";
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { receiveFriendsAndWannabes, unfriend, acceptFriendRequest } from "./actions"


class Friends extends React.Component {
    constructor(props) {
        super(props);

    }

    componentDidMount() {
        console.log("Before in friends.js")
        this.props.dispatch(
    receiveFriendsAndWannabes()
    )
    console.log("After in friends.js")
    }

//

    render() {

        if(!this.props.friends) {
            return null
        }
        return (
            <div>
            <h1>Friends</h1>
            {this.props.friends.map(
            friend => {
                return (
                    <div key={friend.id}>
                    <img src ={friend.profilepic} />
                    {friend.first} {friend.last}
                    <button onClick={() => {this.props.dispatch(unfriend(friend.id))}}> Unfriend </button>
                    </div>
                )
            }
            )}

            <h1>Wannabes</h1>
            {this.props.wannabes.map(
            wannabes => {
                return (
                    <div key={wannabes.id}>
                    <img src ={wannabes.profilepic} />
                    {wannabes.first} {wannabes.last}
                    <button onClick={() => {this.props.dispatch(acceptFriendRequest(wannabes.id))}}> Accept </button>
                    </div>
                )
            }
            )}


            </div>
        )
    }

}


function mapStateToProps(state) {
    console.log("State in mapStateToProps", state)
var list = state.users;
return {
    friends: list && list.filter(
    user => user.accepted == true),
    wannabes : list && list.filter(
    user => !user.accepted
    )
};
}

export default connect(mapStateToProps)(Friends);
