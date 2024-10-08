import React from 'react';
import { Navbar, Nav, Container, Offcanvas } from 'react-bootstrap';

import classes from './Header.module.scss';
import { Link } from 'react-router-dom';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { GearFill, BoxArrowInRight, StarFill, CalendarEventFill, ExclamationCircle, ChatRightDotsFill, CalendarRangeFill } from 'react-bootstrap-icons';
import { ADMIN_ROLE, ROLES } from '../../../utils/enums';
import Spinner from '../Spinner/Spinner';
import Badge from '../Badge/Badge';

const Header = (props) => {
    const { isLoggedIn, account } = useStoreState((state) => state.userStore);
    const { logout } = useStoreActions((actions) => actions.userStore);

    const onLogoutClick = () => {
        logout()
    }

    if (account === null && isLoggedIn) {
        return (<Spinner />)
    }

    if (isLoggedIn && account.role === ADMIN_ROLE) {
        return null
    }

    return (
        <Navbar expand={!isLoggedIn} collapseOnSelect className={classes.Header} variant="dark">
            <Container fluid>
                <Navbar.Brand href="/">Event Organizer</Navbar.Brand>
                {(isLoggedIn) ?
                    <>
                        <Navbar.Toggle aria-controls="offcanvasNavbar" />
                        <Navbar.Offcanvas
                            id="offcanvasNavbar"
                            aria-labelledby="offcanvasNavbarLabel"
                            placement="end"
                        >
                            <Offcanvas.Header className={classes.CloseTitle} closeButton>
                                <Offcanvas.Title id="offcanvasNavbarLabel"></Offcanvas.Title>
                            </Offcanvas.Header>
                            <Offcanvas.Body className={classes.Body}>
                                <div className={classes.Account}>
                                    <h1>{account.name}</h1>
                                    <h2>{account.email}</h2>
                                    <h3>{account.role}</h3>
                                </div>
                                <hr />
                                <div className={classes.BodyNav}>
                                    <Nav>
                                        <div className={classes.Nav}>
                                            <CalendarRangeFill />
                                            <Link className="nav-link" to="/">Home</Link>
                                        </div>
                                        {account.role === ROLES.CLIENT ?
                                            <div className={classes.Nav}>
                                                <CalendarEventFill />
                                                <Link className="nav-link" to="/request" state={{ newEvent: true }}>Make a new request</Link>
                                            </div>
                                            : null
                                        }
                                        <div className={classes.Nav}>
                                            <StarFill />
                                            <Link className="nav-link" to="/events/status">My events {account.pendingEventsCount ? <Badge>{account.pendingEventsCount}</Badge> : null}</Link>
                                        </div>
                                        <div className={classes.Nav}>
                                            <ChatRightDotsFill />
                                            <Link className="nav-link" to="/chat">Chat</Link>
                                        </div>
                                        <div className={classes.Nav}>
                                            <GearFill />
                                            <Link className="nav-link" to="/settings">Account settings</Link>
                                        </div>
                                    </Nav>
                                    {isLoggedIn ?
                                        <Nav>
                                            <div className={classes.Nav}>
                                                <ExclamationCircle />
                                                <Link className={[classes.Logout, "nav-link"].join(' ')} to='/sign' onClick={onLogoutClick}>Log out</Link>
                                            </div>
                                        </Nav>
                                        : null}
                                </div>
                            </Offcanvas.Body>
                        </Navbar.Offcanvas>
                    </>
                    : <Nav>
                        <Nav.Item>
                            <div className={classes.NavLogin}>
                                <BoxArrowInRight />
                                <Link className={[classes.Login, "nav-link"].join(' ')} to='/login'>Log in</Link>
                            </div>
                        </Nav.Item>
                    </Nav>}
            </Container>
        </Navbar>
    )
}

export default Header;