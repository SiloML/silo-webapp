import React from 'react';
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import RequestButton from './RequestButton';
import "./home.css";

const HomeDatasetRow = ({ makeDataRequest, dataset, user, db, datasetsRequested, project_selected }) => (
    <div className="home-container-row">
        <div className="project-display">
            <h2>{dataset.name}</h2>
            <p>{dataset.description}</p>
        </div>
        <div className="project-select">
            <RequestButton
                    makeDataRequest={makeDataRequest}
                    user={user}
                    db={db}
                    dataset={dataset}
                    project_selected={project_selected}
                    datasetsRequested={datasetsRequested}
            />
        </div>
    </div>

)

export default HomeDatasetRow;