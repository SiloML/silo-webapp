import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

class ProjectEntry extends React.Component {
  constructor(props) {
    super(props);
    this.project_id = props.id;
    console.log(props);
    this.colRef = props.db.collection("requests");
    this.docRef = props.db.doc("/projects/" + this.project_id);
    this.state = {
      datasets: [],
      desc: "",
      name: ""
    };
  }

  componentDidMount() {
    this.unsubscribe1 = this.colRef.onSnapshot(snapshot => {
      var reqs = [];
      snapshot.docs.forEach(docSnapshot => {
        if (docSnapshot.data().project_id === this.project_id) {
          var datasetInfo;
          this.props.db
            .doc("/datasets/" + docSnapshot.data().dataset_id)
            .get()
            .then(doc => {
              if (doc && doc.exists) {
                datasetInfo = doc.data();
                var ownerName;
                this.props.db
                  .doc("/users/" + datasetInfo.owner_id)
                  .get()
                  .then(doc => {
                    if (doc && doc.exists) {
                      ownerName = doc.data().name;
                      reqs.push([
                        datasetInfo.name,
                        ownerName,
                        docSnapshot.data().status,
                        datasetInfo.connection_status
                      ]);
                      this.setState({
                        datasets: reqs
                      });
                    }
                  });
              }
            });
        }
      });
    });

    this.unsubscribe2 = this.docRef.onSnapshot(docSnapshot => {
      this.setState({
        desc: docSnapshot.data().description,
        name: docSnapshot.data().name
      });
    });
  }

  componentWillUnmount() {
    this.unsubscribe1();
    this.unsubscribe2();
  }

  render() {
    const classes = makeStyles({
      table: {
        minWidth: 650
      }
    });
    return (
      <div>
        <div>
          {this.state.desc} by {this.state.name}
        </div>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Dataset</TableCell>
                <TableCell align="right">Owner</TableCell>
                <TableCell align="right">Request Status</TableCell>
                <TableCell align="right">Database Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.datasets.map(row => (
                <TableRow key={row.name}>
                  <TableCell component="th" scope="row">
                    {row[0]}
                  </TableCell>
                  <TableCell align="right">{row[1]}</TableCell>
                  <TableCell align="right">{row[2]}</TableCell>
                  <TableCell align="right">{row[3]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  }
}

export default ProjectEntry;
