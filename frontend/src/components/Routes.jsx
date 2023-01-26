import React, { useEffect, useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { useLocation, useNavigate } from 'react-router';

import Sign from '../containers/Sign/Sign';
import Spinner from './common/Spinner/Spinner';
import Gallery from '../containers/Gallery/Gallery';
import Home from '../containers/Home/Home';
import { ROLES } from '../utils/enums';
import EventManagement from '../containers/EventManagement/EventManagement';

const RouteOptions = {
    GO_TO_HOME: 'GO_TO_HOME',
    GO_TO_HOME_CLIENT: 'GO_TO_HOME_CLIENT',
    GO_TO_HOME_ORGANIZER: 'GO_TO_HOME_ORGANIZER',
};

const Router = (props) => {
    const { isLoggedIn, account } = useStoreState((state) => state.userStore);
    const { setAccount } = useStoreActions((actions) => actions.userStore);

    const [routerAction, setRouterAction] = useState(null);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        setRouterAction(resolveNavigationRoute())

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoggedIn]);

    useEffect(() => {
        if ('#' + location.pathname !== window.location.hash) {
            navigate(location.pathname)
        }
        // TODO
        setAccount({ role: ROLES.CLIENT, token: 'token', email: 'alabala@gmail.com', blacklisted: [1, 2] })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname]);

    const resolveNavigationRoute = () => {
        switch (true) {
            case isLoggedIn && account?.role === ROLES.CLIENT:
                return RouteOptions.GO_TO_HOME_CLIENT;
            case isLoggedIn && account?.role === ROLES.ORGANIZER:
                return RouteOptions.GO_TO_HOME_ORGANIZER;
            case !isLoggedIn:
                return RouteOptions.GO_TO_HOME;
            default:
                return RouteOptions.GO_TO_HOME;
        }
    };

    if (!routerAction) {
        return (<Spinner />)
    }

    if (routerAction) {
        switch (routerAction) {
            case RouteOptions.GO_TO_HOME:
                return (
                    (
                        <Routes>
                            <Route path="/" exact element={<Home />} />
                            <Route path="/login" element={<Sign />} />
                            <Route path="/events/gallery/:id" exact element={<Gallery />} />
                            <Route path="*" element={<Navigate to='/' />} />
                        </Routes>
                    )
                );
            case RouteOptions.GO_TO_HOME_ORGANIZER:
                return (
                    (
                        <Routes>
                            <Route path="/" exact element={<Home />} />
                            <Route path="/events/:id" exact element={<EventManagement />} />
                            <Route path="*" element={<Navigate to='/' />} />
                        </Routes>
                    )
                );
            case RouteOptions.GO_TO_HOME_CLIENT:
                return (
                    (
                        <Routes>
                            <Route path="/" exact element={<Home />} />
                            <Route path="/request" exact element={<EventManagement newEvent />} />
                            <Route path="/events/:id" exact element={<EventManagement />} />
                            <Route path="/events/gallery/:id" exact element={<Gallery />} />
                            <Route path="*" element={<Navigate to='/' />} />
                        </Routes>
                    )
                );
            default:
                return (
                    (
                        <Routes>
                            <Route path='/' exact element={<Sign />} />
                            <Route path="*" element={<Navigate to='/sign' />} />
                        </Routes>
                    )
                );
        }
    }
}

export default Router;