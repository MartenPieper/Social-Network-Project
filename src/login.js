import React from "react";
import axios from "./axios";


export default class Login extends React.Component {
    constructor() {
        super()
        this.state = {}
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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
      console.log("handleSubmit running!!", this.state);
      axios.post("/login", this.state).then(resp => {
        console.log("resp in the then of POST / login", resp);

        // if everything does well:
        if (resp.data.success) {
          this.setState({ success: true });
          location.replace("/");
        } else {
          this.setState({ error: true });
        }
      });
    }

    render() {
        return (
             <div className="login-container">
            <h1>Login</h1>

            {this.state.error &&
              <div className="error-message">
                There was an error with your input
              </div>
            }
            <form onSubmit={this.handleSubmit}>
            <input
              onChange={this.handleChange}
              name="email"
              type="text"
              placeholder="email"
            />
            <input
              onChange={this.handleChange}
              name="password"
              type="password"
              placeholder="password"
            />

              <button>Login</button>
            </form>
          </div>
        )
    }
}
