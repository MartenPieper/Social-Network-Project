// function reducer(state = {}, action) {
//     if (action.type == 'SHOW_BIO_EDITOR') {
//         return Object.assign({}, state, {
//             bioEditorIsVisible: true
//         });
//     }
//     if (action.type == 'UPDATE_BIO') {
//         const user = { ...state.user, bio: action.bio };
//         return { ...state, user };
//     }
//     return state;
// }


export default function reducer(state = {}, action) {

// Return a new object that has all the same properties as the old state object except the old list of friends and wannabes (if there is one) is replaced with the new list of friends and wannabes that is attached to the action
// Gets no arguments

    if (action.type == 'RECEIVE_FRIENDS_WANNABES') {
        console.log("RECEIVE_FRIENDS_WANNABES running")
        return { ...state, users: action.user};

    }

    //  friends: action.friends

// Return a new object that has all the same properties as the old state object except the old list of friends and wannabes is replaced with a new list containing all of the objects that were in the old list except for the one whose id was specified in the action object.
// filter one of the list you get from David SQL query to only show Friends (not wannabes).
// Gets id of other person

    if (action.type == 'UNFRIEND') {
        console.log("UNFRIEND running")
        return { ...state, users: state.users.filter(friend => friend.id != action.unfriend)
        };
    }

// Return a new object that has all the same properties as the old state object except the old list of friends and wannabes is replaced with a new list containing all of the object that were in the old list except one object has been replaced with a new object that has all of the same properties as the old object except the `accepted` property is `true`.
// create new state object with the same properties as the old object.
// Replace the old friends array with a new array. New array has all the same except it replaced the accept boolean from "false" with "true".
// Gets id of other person as
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
            ...state, onlineUsers: action.online}
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
