import React from "react";
import ProfilePic from "./profilepic";
import Bio from "./bio";

export default function Profile(props) {
    return (
        <div id="profile">
            <ProfilePic showUploader={ props.showUploader } profilePicUrl={ props.profilePicUrl } first = { props.first} />
            {props.first} {props.last} {props.bio}
            <Bio bio={props.bio} setBio={props.setBio} />
        </div>
    );
}
