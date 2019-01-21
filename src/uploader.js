import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {

    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        this.setState({
            [e.target.name]:e.target.files[0]
        })
    }

    handleSubmit(e) {
        e.preventDefault();
        var formData = new FormData();
        formData.append("file", this.state.file);

    axios.post("/upload", formData).then (resp => {
        console.log("resp in axios.post", resp)
        this.props.changePic(resp.data.imgurl)

    }).catch(err => console.log("Error in axios.post /upload", err));
    }


    render() {
        return (
            <div  className="uploader-container">
            <div className="closingbutton" onClick={this.props.hideUploader}>X</div>
                <h1>Upload an image</h1>
                <form onSubmit = { this.handleSubmit }>
                    <input name= "file" onChange = { this.handleChange } type ="file" accept="image/*" />
                    <button>Upload</button>
                </form>
            </div>
        );
    }
}
