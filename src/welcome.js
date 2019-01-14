import React from "react";
import Registration from "./registration";
import Login from "./login";
// react Router: HashRouter, BrowserRouter

import { HashRouter, Route } from "react-router-dom"



// All JSX must be contained in one "HTML" tag

// Inside the HasRouter, if the url is "/", then render Registration. If the url is "/login", then render the login component.
export default function Welcome() {
  return (
    <div className="welcome-container">
    <h1>Welcome!</h1>

    <HashRouter>
    <div>
        <Route exact path="/" component ={ Registration } />
        <Route path="/login" component = { Login } />
        <Route path="/logout" component = { Login } />
    </div>
    </HashRouter>

    </div>
  );
}
