import * as io from 'socket.io-client';
import { renderOnlineUsers, addNewUser, removeUser, newMessageDetails, getMessageDetails} from "./actions"

let socket;

export function initSocket(store) {
    if(!socket) {
        socket = io.connect()

        // most of our client-side socket code will go here

        // on() accepts two arguments:
        // 1. Name of the event that we are listening for, e.g. "catnip" emitted on server-side (must be the same)
        // 2. Callback function that will run when the client heas the "catnip" event
        socket.on("catnip", message => {
            console.log("message in catnip", message)
        })

        socket.on("onlineUsers", listOfOnlineUsers => {
            console.log("listOfOnlineUsers", listOfOnlineUsers)
            store.dispatch(renderOnlineUsers(listOfOnlineUsers))
        })

        socket.on("userJoined", userWhoJoined => {
            store.dispatch(addNewUser(userWhoJoined))
        })

        socket.on("userLeft", userWhoLeft => {
            store.dispatch(removeUser(userWhoLeft))
        })

        socket.on("chatMessage", messageInfo => {
            store.dispatch(getMessageDetails(messageInfo))
        })

        socket.on("newMessageInfo", messageInfo => {
            store.dispatch(newMessageDetails(messageInfo))
        })
    }

    return socket
}
