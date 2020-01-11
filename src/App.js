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
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from '@material-ui/core/Avatar';

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const firebaseAppAuth = firebaseApp.auth();
const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider()
};

function NavBar({ user, signOut, signInWithGoogle }) {
  const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 1
    },
    menuButton: {
      marginRight: theme.spacing(2)
    },
    title: {
      flexGrow: 1
    }
  }));
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <div className="toolbar">
          <Link to={`/`} className="link">
            Silo ML
          </Link>
          {user ? (
            <div className="link-right">
              <Link to={`/profile`} className="link">
              <Avatar alt="Profile" src={user.photoURL} />
              </Link>
              <button onClick={signOut}>Sign out</button>
            </div>
          ) : (
            <button onClick={signInWithGoogle}>Sign in with Google</button>
          )}
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}

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
      <div className="App">
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <NavBar
          user={user}
          signOut={signOut}
          signInWithGoogle={signInWithGoogle}
        />
        <div className="tabs">
          {error && <div>{error}</div>}
          <Switch>
            <Route
              path={`/`}
              user={user}
              db={db}
              exact
              render={() => <Home path={"/"} db={db} user={user}></Home>}
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
