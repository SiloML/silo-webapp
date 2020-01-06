import React from 'react';
import logo from './logo.svg';
import './App.css';
import withFirebaseAuth from 'react-with-firebase-auth'
import * as firebase from 'firebase';
import 'firebase/auth';
import firebaseConfig from './firebaseConfig';

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const firebaseAppAuth = firebaseApp.auth();
const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
};


class App extends React.Component {

  constructor() {
    super()
    this.registerDataset = this.registerDataset.bind(this);
    this.createProject = this.createProject.bind(this);
  }

  registerDataset = () => {
    /* Add dataset to datasets */
    let user_uuid = this.props.user.uid;
    db.collection('datasets').add(
      {
        name: "Hardcoded name for now",
        description: "Hardcoded description",
        owner_id: user_uuid,
        connected_status: false,
        list_of_requests: [] 

      }
    ).then(function(datasetRef) {
      /* Add dataset reference to user */
      const userRef = db.collection('users').doc(user_uuid)
      userRef.update({
        list_of_datasets: firebase.firestore.FieldValue.arrayUnion(datasetRef)
      })
    
    }).catch(function(error) {
      console.error("Error adding new dataset: ", error);
    });
  };

  createProject = () => {
    /* Add dataset to datasets */
    let user_uuid = this.props.user.uid;
    db.collection('projects').add(
      {
        name: "Hardcoded name for now",
        description: "Hardcoded description",
        researcher_id: user_uuid,
        list_of_requests: []
      }
    ).then(function(projectRef) {
      /* Add dataset reference to user */
      const userRef = db.collection('users').doc(user_uuid)
      userRef.update({
        list_of_projects: firebase.firestore.FieldValue.arrayUnion(projectRef)
      })
    
    }).catch(function(error) {
      console.error("Error creating new project: ", error);
    });
  };

  render(){
    const {
      user,
      signOut,
      signInWithGoogle,
    } = this.props;

    /* Register user if not already registered */
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
          {/* Owner: Register dataset */}
          {
            user
              ? <button onClick={this.registerDataset}>Register data</button>
              : ""
          }
          {/* Researcher: Start a new project */}
          {
            user
              ? <button onClick={this.createProject}>Create project</button>
              : ""
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
