import React, { useState, useEffect } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import { ExclamationCircleFill } from 'react-bootstrap-icons';
import classes from './EventsStatus.module.scss';
import { useStoreState } from 'easy-peasy';
import { useNavigate } from 'react-router';

import { ROLES, STATUS } from '../../utils/enums';
import Button from '../../components/common/Button/Button';
import Spinner from '../../components/common/Spinner/Spinner';
import Badge from '../../components/common/Badge/Badge';
import EventsService from '../../services/eventsService';
import { getStatusOrderByRole } from '../../utils/converter';

const EventsStatus = (props) => {
    const { account } = useStoreState((state) => state.userStore);

    const [activeTab, setActiveTab] = useState(STATUS.EDITABLE);
    const [importantCount, setImportantCount] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredByType, setFilteredByType] = useState({});

    const navigate = useNavigate();

    useEffect(() => {
        loadEvents();
    }, [activeTab, loading]);

    const loadEvents = async () => {
        const eventsRes = await EventsService.getAllPersonal();

        const indexOfFinished = getStatusOrderByRole(account.role).indexOf(STATUS.FINISHED);

        const importantCounts = Array(getStatusOrderByRole(account.role).length).fill(0)
        const filteredByType = {};
        Object.values(STATUS).forEach(status => filteredByType[status] = []);
        eventsRes.forEach(event => {
            const index = getStatusOrderByRole(account.role).indexOf(event.status);
            if (index < indexOfFinished || (index === indexOfFinished && !event.hasFeedback)) {
                event.important = true
                importantCounts[index]++;
            }
            filteredByType[event.status].push(event);
        });

        setImportantCount(importantCounts);
        setFilteredByType(filteredByType);

        setLoading(false);
    }

    const getTitle = (status, index) => {
        if (status === STATUS.EDIT_PENDING) {
            status = 'Edit pending'
        }

        if (status === STATUS.EDITABLE || status === STATUS.FINISHED) {
            return <>
                <span>{status}</span>
                <Badge>{importantCount[index]}</Badge>
            </>
        }

        return <span>{status}</span>
    }

    const navigateEventHandler = (event) => {
        if (event.status === STATUS.FINISHED) {
            return navigate(`/events/gallery/${event.id}`)
        }
        navigate(`/events/${event.id}`)
    }

    if (loading) {
        return <Spinner />
    }

    return (
        <>
            <div className={classes.Heading}>
                <h1>My events</h1>
                <p>Here you can find all of your events by status</p>
            </div>
            <div className={classes.Tabs}>
                <Tabs activeKey={activeTab} onSelect={(tab) => setActiveTab(tab)}>
                    {getStatusOrderByRole(account.role).map((status, index) => (
                        <Tab key={status}
                            eventKey={status}
                            title={getTitle(status, index)}>
                            <ul className={classes.List}>
                                {filteredByType[activeTab].map(event => (
                                    <li key={event.id} className={event.important ? classes.Important : ''} >
                                        {event.important && <span><ExclamationCircleFill size={18} /></span>}
                                        <span>{event.name} ({account.role === ROLES.CLIENT ? event.organizerEmail : event.clientEmail})</span>
                                        <Button onClick={() => navigateEventHandler(event)}>{event.status === STATUS.FINISHED ? 'Visit' : 'Manage'}</Button>
                                    </li>
                                ))}
                                {filteredByType[activeTab].length === 0
                                    && <li className={classes.Empty}><p>No events</p></li>}
                            </ul>
                        </Tab>
                    ))}
                </Tabs>
            </div>
        </>
    );
}

export default EventsStatus;
