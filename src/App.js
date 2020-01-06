import React from 'react';
import logo from './logo.svg';
import './App.css';
import withFirebaseAuth from 'react-with-firebase-auth'
import * as firebase from 'firebase';
import 'firebase/auth';
import firebaseConfig from './firebaseConfig';

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
db.settings({
  timestampsInSnapshots: true
});
const firebaseAppAuth = firebaseApp.auth();
const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
};


class App extends React.Component {

  render(){
    const {
      user,
      signOut,
      signInWithGoogle,
    } = this.props;

    /* Register user if not already registered*/
    if (user) {
      db.collection('users').doc(user.uid).set(
        {
          name: user.displayName,
        },
        {
          merge: true
        }
      )
    }
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          {
            user 
              ? <p>Hello, {user.displayName}</p>
              : <p>Please sign in.</p>
          }
          {
            user
              ? <button onClick={signOut}>Sign out</button>
              : <button onClick={signInWithGoogle}>Sign in with Google</button>
          }
        </header>
      </div>
    );
  }
}

export default withFirebaseAuth({
  providers,
  firebaseAppAuth,
})(App);
