import React from 'react';
import Button from '@material-ui/core/Button';

export default function RequestButton({ user, dataset, makeDataRequest, datasetsRequested, project_selected }) {
const handleClick = () => {
    makeDataRequest(dataset);
  };

  var disabled = false;
  var message = "Request";
  var color = "primary"
  var backgroundColor = "primary"
  
  if (!user) {
      disabled = true;
      message = "Log in to request"
  } else if (project_selected.id === "default") {
      disabled = true;
      message = "Choose a project"
  } else {
      var request = datasetsRequested.filter(d => d.dataset_id === dataset.id)
      if (request.length > 0) {
        if (request[0].status === "Pending") {
            disabled = true;
            message = "Pending"
        } else if (request[0].status === "Approved") {
            disabled = true;
            message = "Approved"
            color = "white"
            backgroundColor = "#a2ad9c"
        } 
      } 
      
  }
  return (
    <div>
      <Button variant="contained" color="primary" style={{backgroundColor: backgroundColor, color: color}} disabled={disabled} onClick={handleClick}>
            {message}
      </Button>
    </div>
  );
}
