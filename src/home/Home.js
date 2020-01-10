import React, { Component } from "react";
import List from "@material-ui/core/List";
import HomeDatasetRow from './HomeDatasetRow';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import * as firebase from "firebase";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class Home extends Component {
  constructor(props) {
    super(props);
    this.datasetRef = props.db.collection("datasets");
    this.userRef = props.db.collection("users");
    this.state = {
      datasets: [],
      projects: [],
      snackbarOpen: false,
    };
  }

  componentDidMount() {
    this.unsubscribe = this.datasetRef.onSnapshot(snapshot => {
      var datasets = [];
      snapshot.docs.forEach(docSnapshot => {
         datasets.push({id: docSnapshot.id, ...docSnapshot.data()});
      });
      this.setState({
        datasets: datasets
      });
    });
    this.registerProjects(this.props.user);
  }

  componentWillUnmount(){
    this.unsubscribe();
    if (this.unsubscribeProjects) {
      this.unsubscribeProjects();
    }
  }

  // Grabs user's projects and updates the state
  registerProjects(user){
    var user_id = user ? user.uid : "nouser";
    this.unsubscribeProjects = this.userRef.doc(user_id).onSnapshot( doc => {
      var projects = [];
      if (!doc.exists) {
          console.log("No such document!");
          return;
      }
      var projRefs = doc.data().list_of_projects;
      if (projRefs) {
        projRefs.forEach(projRef => {
          projRef.get().then(doc=>{
            projects.push(
              {
                id: doc.id,
              ...doc.data()
              }
            )
          })
        });
        this.setState({
          projects: projects
        });
      }
    });
  }

  setSnackbarOpen = (severity, message) => {
    this.setState({
      open: true,
      severity: severity,
      message: message
    });
  }

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({
      open: false,
    });
  };


  makeDataRequest = (project_id, dataset) => {
    const { db } = this.props;
    const { setSnackbarOpen } = this;
    db.collection('requests').add(
      {
        owner_id: dataset.owner_id,
        researcher_id: this.props.user.uid,
        project_id: project_id,
        dataset_id: dataset.id,
        status: "Pending"
      }
    ).then(function(requestRef) {
      /* Add request reference to project id */
      const projectRef = db.collection('projects').doc(project_id)
      projectRef.update({
        list_of_requests: firebase.firestore.FieldValue.arrayUnion(requestRef)
      })
      /* Add request reference to dataset id */
      const datasetRef = db.collection('datasets').doc(dataset.id)
      datasetRef.update({
        list_of_requests: firebase.firestore.FieldValue.arrayUnion(requestRef)
      })
      setSnackbarOpen("success", "Data request successfully sent!");
    }).catch(function(error) {
      setSnackbarOpen("error", error);
    });
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.user || prevProps.user.id !== this.props.user.id) {
      if (this.unsubscribeProjects) {
        this.unsubscribeProjects();
      }
      this.registerProjects(this.props.user);
    }
  } 

  render() {
    return (
      <div>
      {this.state.datasets.length > 0 ? (
      <List dense>
        {this.state.datasets.map(dataset => 
        <HomeDatasetRow
          makeDataRequest={this.makeDataRequest}
          dataset={dataset}
          user={this.props.user}
          db={this.props.db}
          projects={this.state.projects}
          />
        )}
      </List>
    ) : (
      <div>No datasets currently available</div>
    )
    }
    <Snackbar open={this.state.open} autoHideDuration={6000} onClose={this.handleClose}>
        <Alert onClose={this.handleClose} severity={this.state.severity}>
          {this.state.message}
        </Alert>
    </Snackbar>
    </div>)
  }
}

export default Home;
