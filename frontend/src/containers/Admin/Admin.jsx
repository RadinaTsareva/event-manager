import { useStoreActions } from 'easy-peasy';
import React, { useEffect, useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { CalendarEvent, CalendarEventFill, ExclamationCircle, PeopleFill, PersonLinesFill, Search } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';

import Input from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';
import Spinner from '../../components/common/Spinner/Spinner';
import Service from '../../components/Card/Card';
import { ADMIN_ROLE, ROLES, STATUS } from '../../utils/enums';
import { convertColorByStatus } from '../../utils/converter';

import classes from './Admin.module.scss';
import AdminService from '../../services/adminService';

const Admin = (props) => {
    const { logout } = useStoreActions((actions) => actions.userStore);

    const [adminFilter, setAdminFilter] = useState('event');
    const [search, setSearch] = useState('');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData()
    }, [loading, adminFilter]);

    const loadData = async () => {
        const res = await AdminService.getData(adminFilter);
        setData(res);

        setLoading(false);
    }

    const onLogoutClick = () => {
        logout()
    }

    const searchClickedHandler = async () => {
        const res = await AdminService.searchFilter({ type: adminFilter, search });
        setData(res);
    }

    const setUserBlockStatus = async (id, blocked) => {
        await AdminService.setUserBlockStatus({ id, type: adminFilter, blocked });

        const user = data.find(user => user.id === id);
        user.accountBlocked = blocked;

        setData([...data]);
    }

    const setEventStatusHandler = async (id, status) => {
        await AdminService.setEventStatus({ id, status });

        const event = data.find(event => event.id === id);
        event.status = status;

        setData([...data]);
    }

    if (loading) {
        return <Spinner />
    }

    return (
        <Row className={classes.Admin}>
            <Col md={3} xl={3} lg={3} className={classes.Sidebar}>
                <div className={classes.Account}>
                    <h1>{ADMIN_ROLE}</h1>
                </div>
                <hr />
                <div className={classes.BodyNav}>
                    <div>
                        <div className={classes.Nav}>
                            <PeopleFill />
                            <Button
                                className={adminFilter === ROLES.CLIENT ? classes.Active : null}
                                onClick={() => setAdminFilter(ROLES.CLIENT)}>Clients</Button>
                        </div>
                        <div className={classes.Nav}>
                            <PersonLinesFill />
                            <Button
                                className={adminFilter === ROLES.ORGANIZER ? classes.Active : null}
                                onClick={() => setAdminFilter(ROLES.ORGANIZER)}>Organizers</Button>
                        </div>
                        <div className={classes.Nav}>
                            <CalendarEventFill />
                            <Button
                                className={adminFilter === 'event' ? classes.Active : null}
                                onClick={() => setAdminFilter('event')}>Events</Button>
                        </div>
                    </div>
                    <div>
                        <div className={classes.Nav}>
                            <ExclamationCircle />
                            <Link className={[classes.Logout, "nav-link"].join(' ')} to='/' onClick={onLogoutClick}>Log out</Link>
                        </div>
                    </div>
                </div>
            </Col>
            <Col className={classes.Content}>
                <div className={classes.SearchBar}>
                    <Form>
                        <Input
                            controlId='formGroupSearch'
                            type='text' placeholder='Enter search term'
                            field={search} setField={setSearch}
                            validateFn={() => { }} />
                        <Button onClick={searchClickedHandler}><Search /> Search</Button>
                    </Form>
                </div>
                <div className={classes.Data}>
                    {
                        adminFilter === 'event'
                            ?
                            <div className={classes.Events}>
                                {data.map((event) => (
                                    <Service
                                        key={event.id}
                                        heading={event.name}
                                        caption={
                                            `Client: ${event.clientEmail}
                                            Organizer: ${event.organizerEmail}
                                            \nFrom: ${new Date(event.start).toLocaleString()}
                                            To: ${new Date(event.end).toLocaleString()}
                                            \n${event.description}`
                                        }
                                        field={event.status}
                                        setField={(status) => setEventStatusHandler(event.id, status)}
                                        enum={STATUS}
                                        type='event status'
                                        icon={<CalendarEvent />}
                                        theme={convertColorByStatus(event.status)} />
                                ))}
                            </div>
                            :
                            <ul className={classes.List}>
                                {data.map((user) => (
                                    <li key={user.id} >
                                        <span>{user.name} ({user.email})</span>
                                        {user.accountBlocked ?
                                            <Button className={classes.Unblock} onClick={() => setUserBlockStatus(user.id, false)}>Unblock</Button>
                                            : <Button className={classes.Block} onClick={() => setUserBlockStatus(user.id, true)}>Block</Button>}
                                    </li>
                                ))}
                            </ul>
                    }
                    {data.length === 0
                        && <p className={classes.Empty}><p>No data</p></p>}
                </div>
            </Col>
        </Row>
    )
}

export default Admin;