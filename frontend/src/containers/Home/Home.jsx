/* eslint-disable react-hooks/exhaustive-deps */
import { useStoreState } from 'easy-peasy';
import React, { useEffect, useState } from 'react';
import { Nav } from 'react-bootstrap';

import EventList from '../../components/EventList/EventList';
import EventsService from '../../services/eventsService';
import { ROLES, STATUS } from '../../utils/enums';
import Calendar from '../Calendar/Calendar';
import classes from './Home.module.scss';

const Home = () => {
    const { isLoggedIn, account } = useStoreState((state) => state.userStore);

    const [personalEvents, setPersonalEvents] = useState([]);
    const [allEvents, setAllEvents] = useState([]);
    const [events, setEvents] = useState([]);
    const [month, setMonth] = useState();

    useEffect((e) => {
        if (isLoggedIn) {
            loadPersonalEvents()
        }
    }, [month]);

    useEffect((e) => {
        console.log('MONTH CHANGED', month);
        if (!isLoggedIn || (isLoggedIn && account.role !== ROLES.ORGANIZER)) {
            loadAllEvents()
        }
    }, [month]);

    const loadPersonalEvents = async () => {
        const res = await EventsService.getPersonal(account.id, month)
        setPersonalEvents(res)

        if (account?.role === ROLES.ORGANIZER) {
            setEvents(res)
        }
    }

    const loadAllEvents = async () => {
        const res = await EventsService.getAll(month)
        setAllEvents(res)
        setEvents(res)
    }

    const clientEventTypeChangedHandler = (e) => {
        if (e === '1') {
            setEvents(allEvents)
        } else {
            setEvents(personalEvents)
        }
    }

    const getEventsByStatus = (status) => {
        personalEvents.filter(e => e.status === status)
    }

    const clientSelection = () => {
        if (account.role === ROLES.CLIENT) {
            return (
                <Nav variant="pills" defaultActiveKey="1" className={classes.Pills} onSelect={clientEventTypeChangedHandler}>
                    <Nav.Item>
                        <Nav.Link eventKey="1">all events</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="2">personal events</Nav.Link>
                    </Nav.Item>
                </Nav>
            )
        }
        return null
    }

    return (
        <div className={classes.Layout}>
            <div className={classes.Heading}>
                <h1>Event organizer</h1>
                {!isLoggedIn ?
                    <p>This is the place where all events happen. It all starts here and eventually ends here. Simple. Easy. Fast.</p>
                    : account.role === ROLES.ORGANIZER ?
                        <p>Here you can find all your scheduled events.</p>
                        :
                        <span>Here you can find <span>{clientSelection()}</span></span>
                }
            </div>
            <div className={classes.Container}>
                {isLoggedIn &&
                    (<div className={classes.ContainerSection}>
                        <EventList status={STATUS.ACCEPTED} events={getEventsByStatus(STATUS.ACCEPTED)} />
                        <EventList status={STATUS.REJECTED} events={getEventsByStatus(STATUS.REJECTED)} />
                    </div>)
                }
                <Calendar monthChangedHandler={setMonth} events={events} accountRole={account?.role} />
                {isLoggedIn &&
                    (<div className={classes.ContainerSection}>
                        <EventList status={STATUS.PENDING} events={getEventsByStatus(STATUS.PENDING)} />
                        <EventList status={STATUS.EDITABLE} events={getEventsByStatus(STATUS.EDITABLE)} />
                    </div>)
                }
            </div>
        </div>
    )
}

export default Home;