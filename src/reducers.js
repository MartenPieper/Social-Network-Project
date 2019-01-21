export default function reducer(state = {}, action) {

    if (action.type == 'RECEIVE_FRIENDS_WANNABES') {
        console.log("RECEIVE_FRIENDS_WANNABES running")
        return { ...state, users: action.user
        };

    }

    if (action.type == 'UNFRIEND') {
        console.log("UNFRIEND running")
        return { ...state, users: state.users.filter(friend => friend.id != action.unfriend)
        };
    }

    if (action.type == 'ACCEPT_FRIEND_REQUEST') {
        state = { ...state, users: state.users.map(friend => {
            if (friend.id == action.friendship) {
                return {...friend, accepted: true}}
                else {
                    return friend;
                };
        })
    }
}

    if (action.type == 'RENDER_ONLINE_USER') {
        return {
            ...state, onlineUsers: action.online
        }
    }

    if (action.type == 'ADD_ONLINE_USER') {
        return {
            ...state, onlineUsers: [...state.onlineUsers, action.online]
        }
    }

    if (action.type == 'REMOVE_ONLINE_USER') {
        return {
            ...state, onlineUsers: state.onlineUsers.filter(onlineUser => { return onlineUser.id != action.online
        })
    }
    }

    if (action.type == "GET_MESSAGES") {
        return {
            ...state, messageDetails: action.messages}
    }

    if (action.type == "RECEIVE_NEW_MESSAGE") {
        console.log("action in reducer", action)
        return {
            ...state, messageDetails: [...state.messageDetails, action.messages]
        }
    }

    return state;
}
