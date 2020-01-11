import React, { Component } from "react";
import List from "@material-ui/core/List";
import Button from "@material-ui/core/Button";
import HomeDatasetRow from './HomeDatasetRow';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import * as firebase from "firebase";
import HomeProjectSelection from './HomeProjectSelection';
import "./home.css";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class Home extends Component {
  constructor(props) {
    super(props);
    this.datasetRef = props.db.collection("datasets");
    this.userRef = props.db.collection("users");
    this.state = {
      openDialog: false,
      project_selected: {id: "default", name: ""},
      datasetsRequested: {"default": []},
      datasets: [],
      projects: [],
      snackbarOpen: false,
    };
  }

  handleClickListItem = () => {
    this.setState({openDialog: true});
  };

  handleClose = newValue => {
    this.setState({openDialog: false});
    if (newValue) {
      const project_selected = this.state.projects.filter(proj => (proj.id === newValue));
      this.setState({project_selected: project_selected[0]});
    }
  };

  componentDidMount() {
    this.unsubscribe = this.datasetRef.onSnapshot(snapshot => {
      var datasets = [];
      snapshot.docs.forEach(docSnapshot => {
        datasets.push({ id: docSnapshot.id, ...docSnapshot.data() });
      });
      this.setState({
        datasets: datasets
      });
    });
    this.registerProjects(this.props.user);
  }

  componentWillUnmount() {
    this.unsubscribe();
    if (this.unsubscribeProjects) {
      this.unsubscribeProjects();
    }
  }

  // Grabs user's projects and updates the state
  registerProjects(user) {
    var user_id = user ? user.uid : "nouser";
    this.unsubscribeProjects = this.userRef.doc(user_id).onSnapshot(doc => {
      var projects = [];
      var datasetsRequested = {};
      if (!doc.exists) {
        console.log("No such document!");
        return;
      }
      if (
        doc &&
        doc.exists &&
        doc.data().list_of_projects
      ) {
          var projRefs = doc.data().list_of_projects;
          if (projRefs) {
            projRefs.forEach(projRef => {
              projRef.get().then(doc => {
                projects.push({
                  id: doc.id,
                  ...doc.data()
                })
                datasetsRequested[doc.id] = []
                if (
                    doc &&
                    doc.exists &&
                    doc.data().list_of_requests
                ) {
                  const requests = doc.data().list_of_requests;
                  requests.forEach(reqRef => {
                    reqRef.onSnapshot(req => {
                      datasetsRequested[doc.id].push(req.data());
                    })
                  })

                }
              });
            })
            this.setState({
              projects: projects,
              datasetsRequested: datasetsRequested
            });
          }
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

  handleSnackbarClose = (event, reason) =>{
    if (reason === 'clickaway') {
      return;
    }
    this.setState({
      open: false,
    });
  };


  makeDataRequest = (dataset) => {
    const { db } = this.props;
    const { setSnackbarOpen } = this;
    const project_id = this.state.project_selected.id;
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
  // Game plan: Retrieve all dataset requests from user's projects
  // Check if each dataset_id is in those requests.dataset_id
  componentDidUpdate(prevProps) {
    if (!prevProps.user || !this.props.user || prevProps.user.id !== this.props.user.id) {
      if (this.unsubscribeProjects) {
        this.unsubscribeProjects();
      }
      this.registerProjects(this.props.user);
    }
  } 
  render() {
    return (
      <div className="background">
      <div className="title">Explore Datasets</div>
      { this.props.user ? (<div className="home-container">
        <div className="project-display">
          <p>Requesting data for</p>
          <h2>{this.state.project_selected.name.length > 0 ? this.state.project_selected.name : "No project selected"}</h2>
        </div>
        <div className="project-select">
        <Button variant="contained" style={{backgroundColor: "#D36582", color: "white"}} onClick={this.handleClickListItem}>
          Select Project
        </Button>
        </div>
        <HomeProjectSelection
          id="ringtone-menu"
          projects={this.state.projects}
          keepMounted
          open={this.state.openDialog}
          onClose={this.handleClose}
          value={this.state.project_selected}
        />
    </div>):""
        }
      <div className="home-container">
      {this.state.datasets.length > 0 ? (
      <div className="flexGrow">
        {this.state.datasets.map(dataset => 
        <HomeDatasetRow
          makeDataRequest={this.makeDataRequest}
          dataset={dataset}
          user={this.props.user}
          db={this.props.db}
          project_selected={this.state.project_selected}
          datasetsRequested={this.state.datasetsRequested[this.state.project_selected.id]}
          />
        )}
      </div>
    ) : (
      <div>No datasets currently available</div>
    )
    }
    </div>
    <Snackbar open={this.state.open} autoHideDuration={6000} onClose={this.handleSnackbarClose}>
        <Alert onClose={this.handleSnackbarClose} severity={this.state.severity}>
          {this.state.message}
        </Alert>
    </Snackbar>
    </div>)
  }
}

export default Home;
