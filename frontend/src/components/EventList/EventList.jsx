import React from 'react';
import { Badge, ListGroup } from 'react-bootstrap';

import classes from './EventList.module.scss';

const EventList = (props) => {
    const events = () => {
        if (!props.events) {
            return <h2 className={classes.Warning}>No {props.status.toLowerCase()} events</h2>
        }
        return (
            props.events.map((event) => (
                <ListGroup.Item
                    as="li"
                    className="d-flex justify-content-between align-items-start"
                >
                    <div className="ms-2 me-auto">
                        {event.name}
                    </div>
                    <Badge bg="primary" pill>
                        {props.status}
                    </Badge>
                </ListGroup.Item>
            ))
        )
    }


    return (
        <div className={classes.Element}>
            <h1 className={classes.Heading}>{props.status}</h1>
            <ListGroup as="ol">
                {events()}
            </ListGroup>
        </div>
    )
}

export default EventList;
