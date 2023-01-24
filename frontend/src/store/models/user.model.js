import { action, thunk } from 'easy-peasy';
import UserService from '../../services/userService';
import { ROLES } from '../../utils/enums';

export const userStore = {
    /**
     * STATE
     */
    isLoggedIn: false,
    account: null,
    /**
     * ACTIONS
     */
    setAccount: action((state, payload) => {
        state.account = payload;
        if (state.account) {
            state.account.role = payload.role
        }
        state.isLoggedIn = !!(payload && payload.token);
    }),
    /**
     * THUNKS
     */
    registerClient: thunk(async (actions, payload, { getState, getStoreState }) => {
        const { portalStore } = getStoreState();
        const data = await UserService.registerClient(payload)

        portalStore.chosenPortal = data.role ? null : ROLES.CLIENT;
        actions.setAccount(data);
    }),
    registerOrganizer: thunk(async (actions, payload, { getState, getStoreState }) => {
        const { portalStore } = getStoreState();
        const data = await UserService.registerOrganizer(payload)

        portalStore.chosenPortal = data.roles ? null : ROLES.CLIENT;
        actions.setAccount(data);
    }),
    login: thunk(async (actions, payload, { getState, getStoreState }) => {
        const { portalStore } = getStoreState();
        const data = await UserService.login(payload)

        portalStore.chosenPortal = data.roles.length > 0 ? null : ROLES.CLIENT;
        actions.setAccount(data);
    }),
    logout: thunk((actions, payload, { getState, getStoreState }) => {
        const { portalStore } = getStoreState();

        portalStore.chosenPortal = null;
        portalStore.chosenType = null;
        actions.setAccount(null);
    })
};
