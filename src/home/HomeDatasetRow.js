import React from 'react';
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import RequestButton from './RequestButton';

const HomeDatasetRow = ({ makeDataRequest, dataset, user, db, datasetsRequested, project_selected }) => (
    <ListItem key={dataset.id} button>
        <ListItemText id={dataset.name} primary={dataset.name} />
        <ListItemText id={dataset.description} primary={dataset.description} />
        <ListItemText id={dataset.owner_name} primary={dataset.owner_name} />
        <ListItemSecondaryAction>
            <RequestButton
                makeDataRequest={makeDataRequest}
                user={user}
                db={db}
                dataset={dataset}
                project_selected={project_selected}
                datasetsRequested={datasetsRequested}
            />
        </ListItemSecondaryAction>
    </ListItem>
)

export default HomeDatasetRow;