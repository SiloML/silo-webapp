import React, { Component } from "react";
import { Switch, Route, Link, Redirect } from "react-router-dom";
import "../App.css";
import ProjectList from "./ProjectList";
import DatasetList from "./DatasetList";
import DataList from "./DataList";
import "./profile.css";

class Profile extends Component {
  render() {
    const { path, user, db } = this.props;
    return (
      <div>
        <div className="profile">Your Profile</div>
        <div className="container">
          <header>
            <div id="material-tabs">
              <Link to={`${path}/researcher`} id="tab1-tab">
                Researcher
              </Link>
              <Link to={`${path}/dataowner`} id="tab2-tab">
                Data Owner
              </Link>
            </div>
          </header>
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
