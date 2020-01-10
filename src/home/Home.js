import React, { Component } from "react";
import List from "@material-ui/core/List";
import HomeDatasetRow from "./HomeDatasetRow";

class Home extends Component {
  constructor(props) {
    super(props);
    this.datasetRef = props.db.collection("datasets");
    this.userRef = props.db.collection("users");
    this.state = {
      datasets: [],
      projects: []
    };
  }

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
      if (!doc.exists) {
        console.log("No such document!");
        return;
      }
      var projRefs = doc.data().list_of_projects;
      if (projRefs) {
        projRefs.forEach(projRef => {
          projRef.get().then(doc => {
            projects.push({
              id: doc.id,
              ...doc.data()
            });
          });
        });
        this.setState({
          projects: projects
        });
      }
    });
  }

  componentDidUpdate(prevProps) {
    console.log(
      "component updated",
      prevProps.user && prevProps.user.uid,
      this.props.user && this.props.user.uid,
      this.state.projects
    );
    if (!prevProps.user || prevProps.user.id !== this.props.user.id) {
      if (this.unsubscribeProjects) {
        this.unsubscribeProjects();
      }
      this.registerProjects(this.props.user);
    }
  }

  render() {
    return this.state.datasets.length > 0 ? (
      <List dense>
        {this.state.datasets.map(dataset => (
          <HomeDatasetRow
            dataset={dataset}
            user={this.props.user}
            db={this.props.db}
            projects={this.state.projects}
          />
        ))}
      </List>
    ) : (
      <div>No datasets currently available</div>
    );
  }
}

export default Home;
