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
    this.requestForData = this.requestForData.bind(this);
    this.approveRequest = this.approveRequest.bind(this);
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

  requestForData = () => {
    /* Hardcoded researcher, owner, project_id, dataset_id*/
    let owner_uuid = "Uqv5oJkh8eWsQPf9CLohIn2wMTf1";
    let dataset_id = "HBAF8YMZQIkDM9CvDUmg";
    let researcher_uuid = "Oy3UauTsREglXN6LTqLBI08cdYN2";
    let project_id = "tyWTzzwTdoLYI1RahBtK";

    db.collection('requests').add(
      {
        owner_id: owner_uuid,
        researcher_id: researcher_uuid,
        project_id: project_id,
        dataset_id: dataset_id,
        status: "Pending"
      }
    ).then(function(requestRef) {
      /* Add request reference to project id */
      const projectRef = db.collection('projects').doc(project_id)
      projectRef.update({
        list_of_requests: firebase.firestore.FieldValue.arrayUnion(requestRef)
      })
      /* Add request reference to dataset id */
      const datasetRef = db.collection('datasets').doc(dataset_id)
      datasetRef.update({
        list_of_requests: firebase.firestore.FieldValue.arrayUnion(requestRef)
      })
    }).catch(function(error) {
      console.error("Error adding a new request", error);
    });
  };

  approveRequest = () => {
    /* Hardcoded Request*/
    let request_id = "rJe5KSwvfhNXtYBkwn9L";

    db.collection('requests').doc(request_id).update(
      {
        status: "Approved"
      }
    ).catch(function(error) {
      console.error("Error approving request", error);
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
          {/* Researcher: Send a request to one of the data owners */}
          {
            user
            ? <button onClick={this.requestForData}>Request for Data</button>
            : ""
          }
          {/* Owner: Approve the request */}
          {
            user
            ? <button onClick={this.approveRequest}>Approve said request</button>
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
