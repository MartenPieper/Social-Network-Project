import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Registration extends React.Component {
  constructor() {
    super();

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
            hasError: "placeholder"
        };
  }
  handleChange(e) {
    console.log("Handle change running!!", e.target.value);
    this.setState(
      {
        [e.target.name]: e.target.value
      },
      () => console.log("this state in handle change: ", this.state)
    );
  }

  handleSubmit(e) {
    e.preventDefault();
    axios.post("/registration", this.state).then(resp => {
      if (resp.data.success) {
        location.replace("/");
      } else {
          this.setState({
                          hasError: resp.data
                      });
      }
    });
  }

  render() {
    return (
      <div className="registration-container">
        <h1>Please register</h1>
        {this.state.error &&
          <div className="error-message">
            There was an error with your input
          </div>
        }

        <Link to="/login">Click here to login</Link>
        <form onSubmit={this.handleSubmit}>
          <input
            onChange={this.handleChange}
            name="first"
            type="text"
            placeholder="first name"
          />
          {this.state.hasError == "first" && (
                        <p className="err">Please enter your first name</p>
                    )}

          <input
            onChange={this.handleChange}
            name="last"
            type="text"
            placeholder="last name"
          />
          {this.state.hasError == "last" && (
                        <p className="err">Please enter your last name</p>
                    )}
          <input
            onChange={this.handleChange}
            name="email"
            type="text"
            placeholder="email"
          />
          {this.state.hasError == "email" && (
                      <p className="err">Please enter your email</p>
                  )}
          <input
            onChange={this.handleChange}
            name="password"
            type="password"
            placeholder="password"
          />
          {this.state.hasError == "" && (
                        <p className="err">Please enter all required fields</p>
                    )}

          <button>Register</button>
        </form>
      </div>
    );
  }
}
