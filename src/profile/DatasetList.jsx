import React from "react";

class DatasetList extends React.Component {
  constructor(props) {
    super(props);
    this.userDocRef = props.db.collection("users");
    this.datasetRef = props.db.collection("datasets");
    this.state = {
      loading: false,
      datasets: [],
      tables: []
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    const userid = this.props.user ? this.props.user.uid : "nouser";
    this.unsubscribe = this.userDocRef.doc(userid).onSnapshot(docSnapshot => {
      if (
        docSnapshot &&
        docSnapshot.exists &&
        docSnapshot.data().list_of_datasets
      ) {
        this.setState({ datasets: docSnapshot.data().list_of_datasets });
        this.state.datasets.forEach(dataset => this.addSnapshot(dataset));
      }
    });
    this.setState({ loading: false });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  addSnapshot(docRef) {
    docRef.onSnapshot(docSnapshot => {
      console.log("here");
      this.setState({
        tables: [
          docSnapshot.data().name,
          docSnapshot.data().description,
          docSnapshot.data().connectionStatus
        ]
      });
    });
    this.forceUpdate();
  }

  render() {
    console.log(this.state.tables);
    return (
      <>
        {this.state.tables.length > 0 || this.state.loading
          ? this.state.tables.map(entry => (
              <div>
                {entry[0]}, {entry[1]}, {entry[2]}
              </div>
            ))
          : "You haven't uploaded any datasets yet, become a data owner today!"}
      </>
    );
  }
}

export default DatasetList;
