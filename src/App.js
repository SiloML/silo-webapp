import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";
import "./App.css";
import Profile from "./profile/Profile.js";
import Home from "./home/Home.js";
import ProtectedRoute from "./ProtectedRoute.js";
import withFirebaseAuth from "react-with-firebase-auth";
import * as firebase from "firebase";
import "firebase/auth";
import firebaseConfig from "./firebaseConfig";

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const firebaseAppAuth = firebaseApp.auth();
const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider()
};

class App extends Component {
  render() {
    const { user, signOut, signInWithGoogle } = this.props;
    const { state = {} } = this.props.location;
    const { error } = state;
    /* Register user if not already registered */
    if (user) {
      db.collection("users")
        .doc(user.uid)
        .set(
          {
            name: user.displayName,
            photoURL: user.photoURL
          },
          {
            merge: true
          }
        );
    }
    return (
      <div>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />

        <h1>Silo ML</h1>
        <div className="links">
          <Link to={`/`} className="link">
            Home
          </Link>
          {user ? (
            <div>
              <Link to={`/profile`} className="link">
                Profile
              </Link>
              <button onClick={signOut}>Sign out</button>
            </div>
          ) : (
            <button onClick={signInWithGoogle}>Sign in with Google</button>
          )}
        </div>
        <div className="tabs">
          {error && <div>{error}</div>}
          <Switch>
            <Route
              path={`/`}
              user={user}
              db={db}
              exact
              render={() => <Home path={'/'} db={db} user={user}></Home>}
            />
            <ProtectedRoute
              path={`/profile`}
              user={user}
              db={db}
              render={() => (
                <Profile path={`/profile`} user={user} db={db}></Profile>
              )}
            />
          </Switch>
        </div>
      </div>
    );
  }
}

export default withFirebaseAuth({
  providers,
  firebaseAppAuth
})(App);
