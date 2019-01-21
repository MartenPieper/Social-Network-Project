import React from "react";


export default function ProfilePic(props) {
    console.log("props:", props)
    return (
        <div id="profilepic">
            <img onClick = { props.showUploader } src = { props.profilePicUrl || "/default.png" } />
        </div>
    );
}
