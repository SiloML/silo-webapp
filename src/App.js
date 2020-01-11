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
import Avatar from "@material-ui/core/Avatar";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const firebaseAppAuth = firebaseApp.auth();
const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider()
};

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5"
  }
})(props => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center"
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center"
    }}
    {...props}
  />
));

function NavBar({ user, signOut, signInWithGoogle }) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 1
    },
    menuButton: {
      marginRight: theme.spacing(0)
    },
    title: {
      flexGrow: 1
    }
  }));
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static" style={{backgroundColor: "#253C78"}}>
        <Toolbar>
          <div className="toolbar">
            <Link to={`/`} className="appbar-link">
              Silo ML
            </Link>

            {user ? (
              <div className="link-right">
                <Button style={{ borderRadius: "150px" }} onClick={handleClick}>
                  <Avatar alt="Profile" src={user.photoURL} />
                </Button>
                <StyledMenu
                  id="simple-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleClose}>
                    <Link to={`/profile`} style={{ color: "black" }}>
                      Profile
                    </Link>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleClose();
                      signOut();
                    }}
                  >
                    Sign out
                  </MenuItem>
                </StyledMenu>
              </div>
            ) : (
              <button onClick={signInWithGoogle}>
                <Button className="signinsignout">Sign in with Google</Button>
              </button>
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
        <div className="background">
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
