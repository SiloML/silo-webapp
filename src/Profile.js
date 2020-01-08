import React, { Component } from "react";
import { Switch, Route, Link, Redirect } from "react-router-dom";
import "./App.css";
import ProjectEntry from "./profile/ProjectEntry";

const DataOwner = props => (
  <div>You're on the Profile-DataOwner Tab {props.db}</div>
);

class Profile extends Component {
  render() {
    const { path, user, db } = this.props;
    return (
      <div>
        <h2>Your Profile</h2>
        <div className="links">
          <Link to={`${path}/researcher`} className="link">
            Researcher
          </Link>
          <Link to={`${path}/dataowner`} className="link">
            Data Owner
          </Link>
        </div>
        <div className="tabs">
          <Switch>
            <Route
              path={`${path}/researcher`}
              user={user}
              db={db}
              exact
              render={props => <ProjectEntry db={db}></ProjectEntry>}
            />
            <Route
              path={`${path}/dataowner`}
              user={user}
              db={db}
              component={DataOwner}
            />
            <Redirect from={`${path}`} to={`${path}/researcher`} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default Profile;
