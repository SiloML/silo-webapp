import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import "./DataEntry.css";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import CheckIcon from "@material-ui/icons/CheckOutlined";
import CloseIcon from "@material-ui/icons/CloseOutlined";
import Button from "@material-ui/core/Button";

class DataEntry extends React.Component {
  constructor(props) {
    super(props);
    this.dataset_id = props.id;
    this.colRef = props.db.collection("requests");
    this.docRef = props.db.doc("/datasets/" + this.dataset_id);
    this.state = {
      projects: [],
      desc: "",
      name: "",
      otp: "",
      loading: true
    };
  }

  componentDidMount() {
    this.unsubscribe1 = this.colRef.onSnapshot(snapshot => {
      var reqs = [];
      snapshot.docs.forEach(docSnapshot => {
        if (
          docSnapshot.data().dataset_id === this.dataset_id &&
          docSnapshot.data().status !== "Rejected"
        ) {
          var projectInfo;
          this.props.db
            .doc("/projects/" + docSnapshot.data().project_id)
            .get()
            .then(doc => {
              if (doc && doc.exists) {
                projectInfo = doc.data();
                var ownerName;
                this.props.db
                  .doc("/users/" + projectInfo.researcher_id)
                  .get()
                  .then(usr => {
                    if (usr && usr.exists) {
                      ownerName = usr.data().name;
                      reqs.push([
                        projectInfo.name,
                        projectInfo.description,
                        ownerName,
                        docSnapshot.data().status,
                        docSnapshot.id
                      ]);
                      this.setState({
                        projects: reqs,
                        loading: false
                      });
                    }
                  });
              }
            });
        }
      });
    });

    this.unsubscribe2 = this.docRef.onSnapshot(docSnapshot => {
      if (docSnapshot && docSnapshot.data()) {
        this.setState({
          desc: docSnapshot.data().description,
          name: docSnapshot.data().name,
          otp: docSnapshot.data().OTP
        });
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribe1();
    this.unsubscribe2();
  }

  updateRequest(loc, newState) {
    var docRef = this.props.db.collection("requests").doc(loc);
    docRef.update({ status: newState });
  }

  render() {
    const classes = makeStyles({
      table: {
        minWidth: 650
      }
    });
    return (
      <div className="box">
        <div className="titleBox">
          <h2>{this.state.name}</h2>
          <p>{this.state.desc}</p>
          <p>
            API Key: {"    "}
            {this.dataset_id}
          </p>
          <p>
            {this.state.otp && this.state.otp.length > 0 ? " OTP: " : <></>}
            {this.state.otp}
          </p>
        </div>
        {this.state.projects.length > 0 || this.state.loading ? (
          <TableContainer component={Paper} style={{ maxHeight: "300px" }}>
            <Table
              stickyHeader
              className={classes.table}
              aria-label="sticky table"
            >
              <TableHead>
                <TableRow>
                  <TableCell>Project</TableCell>
                  <TableCell align="right">Description</TableCell>
                  <TableCell align="right">Researcher</TableCell>
                  <TableCell align="right">Request Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.projects.map(row => (
                  <TableRow key={row.name}>
                    <TableCell component="th" scope="row">
                      {row[0]}
                    </TableCell>
                    <TableCell align="right">{row[1]}</TableCell>
                    <TableCell align="right">{row[2]}</TableCell>
                    <TableCell align="right">
                      {row[3] === "Pending" ? (
                        <div>
                          <Button
                            onClick={() => {
                              this.updateRequest(row[4], "Approved");
                            }}
                          >
                            <CheckIcon />
                          </Button>
                          <Button
                            onClick={() => {
                              this.updateRequest(row[4], "Rejected");
                            }}
                          >
                            <CloseIcon />
                          </Button>
                        </div>
                      ) : (
                        <CheckIcon
                          style={{
                            background: "green",
                            color: "white",
                            width: "60px",
                            paddingTop: "3px",
                            paddingBottom: "3px",
                            marginRight: "35px",
                            borderRadius: "5px"
                          }}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <div>No data requests yet for this dataset</div>
        )}
      </div>
    );
  }
}

export default DataEntry;
