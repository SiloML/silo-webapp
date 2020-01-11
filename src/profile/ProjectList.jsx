import React from "react";
import ProjectEntry from "./ProjectEntry";
import Zoom from "@material-ui/core/Zoom";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import "./ProjectList.css";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import * as firebase from "firebase";

class ProjectList extends React.Component {
  constructor(props) {
    super(props);
    this.colRef = props.db.collection("projects");
    this.state = {
      projects: [],
      loading: true,
      addDialogOpen: false,
      nameHolder: "",
      descHolder: ""
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    var projs = this.state.projects;
    this.unsubscribe = this.colRef.onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if (
          change.type === "added" &&
          change.doc.data().researcher_id === this.props.user.uid
        ) {
          projs.push(change.doc.id);
        }
      });
      this.setState({
        projects: projs
      });
      this.setState({ loading: false });
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const fab = {
      color: "primary",
      className: "fab",
      icon: <AddIcon />,
      label: "Add"
    };
    const transitionDuration = {
      enter: 100,
      exit: 100
    };

    return (
      <div>
        <div className="projectList">
          {this.state.projects.length > 0 || this.state.loading ? (
            this.state.projects.map(proj => (
              <ProjectEntry
                db={this.props.db}
                user={this.props.user}
                id={proj}
              />
            ))
          ) : (
            <div>You don't have any research projects! Create one today!</div>
          )}

          <Dialog
            open={this.state.addDialogOpen}
            onClose={() => {
              this.setState({ addDialogOpen: false });
            }}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">
              Create a new project
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                Please enter a name and description to start your project! You
                can request to add datasets on the homepage later.
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Name"
                type="name"
                value={this.state.nameHolder}
                onChange={event => {
                  this.setState({ nameHolder: event.target.value });
                }}
              />
              <TextField
                autoFocus
                margin="dense"
                id="desc"
                label="Description"
                type="text"
                value={this.state.descHolder}
                onChange={event => {
                  this.setState({ descHolder: event.target.value });
                }}
                fullWidth
                multiline
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  this.setState({ addDialogOpen: false });
                }}
                color="primary"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  let db = this.props.db;
                  let userid = this.props.user.uid;
                  console.log(this.state.nameHolder);
                  this.props.db
                    .collection("projects")
                    .add({
                      name: this.state.nameHolder,
                      description: this.state.descHolder,
                      researcher_id: userid
                    })
                    .then(function(projectRef) {
                      /* Add dataset reference to user */
                      const userRef = db.collection("users").doc(userid);
                      userRef.update({
                        list_of_projects: firebase.firestore.FieldValue.arrayUnion(
                          projectRef
                        )
                      });
                    });
                  this.setState({
                    addDialogOpen: false,
                    nameHolder: "",
                    descHolder: ""
                  });
                }}
                color="primary"
                type="submit"
              >
                Create
              </Button>
            </DialogActions>
          </Dialog>
          <Fab
            aria-label={fab.label}
            className={fab.className}
            style={{backgroundColor: "#D36582", color:"white"}}
            onClick={() => {
              this.setState({ addDialogOpen: true });
            }}
          >
            {fab.icon}
          </Fab>
        </div>
      </div>
    );
  }
}

export default ProjectList;
