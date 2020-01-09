import React from "react";
import ProjectEntry from "./ProjectEntry";

class ProjectList extends React.Component {
  constructor(props) {
    super(props);
    this.colRef = props.db.collection("projects");
    this.state = {
      projects: []
    };
  }

  componentDidMount() {
    var projs = [];
    this.unsubscribe = this.colRef.onSnapshot(snapshot => {
      snapshot.forEach(docSnapshot => {
        if (docSnapshot.data().researcher_id === this.props.user) {
          projs.push(docSnapshot.id);
        }
      });
    });
    this.setState({
      projects: projs
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    return this.state.projects.length > 0 ? (
      <>
        {this.state.projects.map(proj => (
          <ProjectEntry db={this.props.db} user={this.props.user} id={proj} />
        ))}
      </>
    ) : (
      <div>You don't have any research projects! Create one today!</div>
    );
  }
}

export default ProjectList;
