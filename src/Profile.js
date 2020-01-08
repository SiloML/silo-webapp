import React, { Component } from "react";
import { Switch, Route, Link, Redirect } from "react-router-dom";
import "./App.css";

const Researcher = () => <div>You're on the Profile-Researcher Tab</div>;
const DataOwner = () => <div>You're on the Profile-DataOwner Tab</div>;

class Profile extends Component {
  render() {
    const { path } = this.props.match;
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
            <Route path={`${path}/researcher`} exact component={Researcher} />
            <Route path={`${path}/dataowner`} component={DataOwner} />
            <Redirect from={`${path}`} to={`${path}/researcher`} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default Profile;
