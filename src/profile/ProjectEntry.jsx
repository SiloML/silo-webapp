import React from "react";

class ProjectEntry extends React.Component {
  constructor(props) {
    super(props);
    this.project_id = "tyWTzzwTdoLYI1RahBtK";
    console.log(props);
    this.colRef = props.db.collection("requests");
    this.state = {
      datasets: []
    };
  }

  componentDidMount() {
    this.unsubscribe1 = this.colRef.onSnapshot(snapshot => {
      var reqs = [];
      snapshot.docs.forEach(docSnapshot => {
        if (docSnapshot.data().project_id === this.project_id) {
          reqs.push([docSnapshot.data().dataset_id, docSnapshot.data().status]);
        }
      });
      this.setState({
        datasets: reqs
      });
    });
  }
  render() {
    return this.state.datasets.map(pair => (
      <div>
        {pair[0]} was {pair[1]}
      </div>
    ));
  }
}

export default ProjectEntry;
