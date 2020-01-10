import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import { blue } from '@material-ui/core/colors';

// If logged out: "Log in to request", disabled
// if (!loggedIn) {
//     disabled = true;
//     message = "Log in to request";
// }
// If logged in but requested: "Pending", disabled

// If logged in but not requests: "Request", click to open modal

const useStyles = makeStyles({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
});

function SimpleDialog(props) {
  const classes = useStyles();
  const { onClose, selectedValue, open, projects } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = value => {
    onClose(value);
  };

  return (
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle id="simple-dialog-title">Request data for...</DialogTitle>
      <List>
        {projects.map((project) => (
            <ListItem button onClick={() => handleListItemClick(project.id)} key={project.id}>
                <ListItemText primary={project.name} />
            </ListItem>
        ))
        }
        <ListItem autoFocus button onClick={() => handleListItemClick('addAccount')}>
           {/* TODO: Use Dhruvik's Create Project button */}
          <ListItemText primary="create project" />
        </ListItem>
      </List>
    </Dialog>
  );
}

export default function RequestButton({ user, db, projects, dataset, makeDataRequest }) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = project_id => {
    setOpen(false);
    makeDataRequest(project_id, dataset);
  };

  return (
    <div>
      <Button variant="contained" color="primary" disabled={!user} onClick={handleClickOpen}>
            {user ? "Request": "Log in to request"}
      </Button>
      <SimpleDialog open={open} onClose={handleClose} user={user} db={db} projects={projects}/>
    </div>
  );
}
