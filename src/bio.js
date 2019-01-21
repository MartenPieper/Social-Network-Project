import React from "react";
import axios from "./axios";

export default class Bio extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            bioEditorIsVisible: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.hideBioEditor = this.hideBioEditor.bind(this);
        this.showBioEditor = this.showBioEditor.bind(this);

    }

    handleChange(e) {
     this.setState({
         bio: e.target.value
    })
    }

    handleSubmit(e) {
        e.preventDefault();
        axios.post("/bio", {bio: this.state.bio}).then(resp => {
             this.props.setBio(resp.data.bio)

        }).catch(err => console.log("Error in axios.post /bio", err));
        }

    showBioEditor() {
            this.setState({
                bioEditorIsVisible: true
            });
    }

    hideBioEditor() {
            this.setState({
                bioEditorIsVisible: false
            });
    }

    render() {
        return (
            <div id="bio-container">

            { this.props.bio &&
            <div className="bio">
                { this.props.bio }
                <div >
                    <div onClick={this.showBioEditor}>
                    <button>Edit</button>
                    </div>
                </div>
            </div>
                }

                { !this.props.bio &&
                    <div>
                        <div>
                            <div onClick={this.showBioEditor}>
                            <button>Add your Bio</button>
                            </div>
                        </div>
                    </div>
                                }

                {this.state.bioEditorIsVisible &&
                    <div className="bio-form">
                        <div onClick={this.hideBioEditor}> X </div>
                        <form onSubmit={this.handleSubmit}>
                        <textarea defaultValue={this.props.bio} onChange={this.handleChange} />
                        <button>Submit</button>
                        </form>
                    </div>
                }
                </div>
            );
        }
    }
