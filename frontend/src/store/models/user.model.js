import { action, thunk } from 'easy-peasy';
import UserService from '../../services/userService';

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
    registerUser: thunk(async (actions, payload, { getState, getStoreState }) => {
        const data = await UserService.registerUser(payload)
        actions.setAccount(data);
    }),
    login: thunk(async (actions, payload, { getState, getStoreState }) => {
        const data = await UserService.login(payload)
        actions.setAccount(data);
    }),
    logout: thunk((actions, payload, { getState, getStoreState }) => {
        actions.setAccount(null);
    })
};
