/* eslint-disable react-hooks/exhaustive-deps */
import { useStoreState } from 'easy-peasy';
import React, { useEffect, useState } from 'react';
import { Nav } from 'react-bootstrap';
import classes from './Home.module.scss';

import EventsService from '../../services/eventsService';
import { ROLES } from '../../utils/enums';
import Calendar from '../Calendar/Calendar';
import Spinner from '../../components/common/Spinner/Spinner';

const Home = () => {
    const { isLoggedIn, account } = useStoreState((state) => state.userStore);

    const [events, setEvents] = useState([]);
    const [activePill, setActivePill] = useState('1');
    const [date, setDate] = useState({ month: new Date(Date.now()).getMonth(), year: new Date(Date.now()).getFullYear() });
    const [loading, setLoading] = useState(true);

    useEffect((e) => {
        loadAllData()
    }, [date.month, date.year, isLoggedIn]);

    const loadAllData = async () => {
        if (isLoggedIn && (account.role === ROLES.ORGANIZER || activePill === '2')) {
            await loadPersonalEvents()
        }
        if (!isLoggedIn || (isLoggedIn && account.role !== ROLES.ORGANIZER && activePill === '1')) {
            await loadAllEvents()
        }
        setLoading(false)
    }

    const loadPersonalEvents = async () => {
        const res = await EventsService.getPersonal(date.month + 1, date.year)
        setEvents(res)
    }

    const loadAllEvents = async () => {
        const res = await EventsService.getAll(date.month + 1, date.year)
        setEvents(res)
    }

    const clientEventTypeChangedHandler = (e) => {
        setActivePill(e)
        if (e === '1') {
            loadAllEvents()
        } else {
            loadPersonalEvents()
        }
    }

    const clientSelection = () => {
        if (account.role === ROLES.CLIENT) {
            return (
                <Nav variant="pills" activeKey={activePill} defaultActiveKey="1" className={classes.Pills} onSelect={clientEventTypeChangedHandler}>
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

    if (loading) {
        return <Spinner />
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
                <Calendar dateChangedHandler={setDate} events={events} account={account} />
            </div>
        </div>
    )
}

export default Home;