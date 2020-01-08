import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";
import "./App.css";
import Profile from "./Profile.js";

const Home = () => <div>You're on the Home Tab</div>;

class App extends Component {
  render() {

    return (
      <div>
        <h1>Silo ML</h1>
        <div className="links">
          <Link to={`/`} className="link">
            Home
          </Link>
          <Link to={`/profile`} className="link">
            Profile
          </Link>
        </div>
        <div className="tabs">
          <Switch>
            <Route path={`/`} exact component={Home} />
            <Route path={`/profile`} component={Profile} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
