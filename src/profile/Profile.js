import React, { Component } from "react";
import { Switch, Route, Link, Redirect } from "react-router-dom";
import "../App.css";
import ProjectList from "./ProjectList";
import DatasetList from "./DatasetList";
import DataList from "./DataList";

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
              render={props => <ProjectList db={db} user={user}></ProjectList>}
            />
            <Route
              path={`${path}/dataowner`}
              user={user}
              db={db}
              render={props => <DataList db={db} user={user}></DataList>}
            />
            <Redirect from={`${path}`} to={`${path}/researcher`} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default Profile;
