import React from "react";
import axios from './axios';

export async function receiveFriendsAndWannabes() {
    const resp = await axios.get("/receiveFriendsAndWannabes")
    return {
        type: 'RECEIVE_FRIENDS_WANNABES',
        user: resp.data.rows
    };
}

export async function unfriend(id) {
    const resp = await axios.post("/unfriend", {id: id})
    if (resp.data.success) {
    return {
        type: 'UNFRIEND',
        unfriend: id
    };
    }
}

export async function acceptFriendRequest(id) {
    const resp = await axios.post("/acceptRequest", {id: id})
    return {
        type: 'ACCEPT_FRIEND_REQUEST',
        friendship: id
    };
}

export async function renderOnlineUsers(listOfOnlineUsers) {
    return {
        type: 'RENDER_ONLINE_USER',
        online: listOfOnlineUsers
    };
}

export async function addNewUser(newUser) {
    return {
        type: 'ADD_ONLINE_USER',
        online: newUser
    }
}
export async function removeUser(oldUser) {
    return {
    type: 'REMOVE_ONLINE_USER',
    online: oldUser
    }
}

export async function getMessageDetails (details) {
    return {
        type: "GET_MESSAGES",
        messages: details
    }
}

export async function newMessageDetails(details) {
    return {
        type: "RECEIVE_NEW_MESSAGE",
        messages: details
    }
}
