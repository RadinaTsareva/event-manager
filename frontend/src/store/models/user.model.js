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
        if (state.account?.token) {
            state.account = { token: state.account.token, token_type: state.account.token_type, ...payload };
        } else {
            state.account = payload;
        }
        state.isLoggedIn = !!(payload && (payload.token || state.account.token));
    }),
    /**
     * THUNKS
     */
    registerUser: thunk(async (actions, payload, { getState, getStoreState }) => {
        const res = await UserService.registerUser(payload)
        actions.setAccount(res);
    }),
    login: thunk(async (actions, payload, { getState, getStoreState }) => {
        const res = await UserService.login(payload)
        actions.setAccount(res);
    }),
    loadUser: thunk(async (actions, payload, { getState, getStoreState }) => {
        const res = await UserService.getCurrentUser()
        actions.setAccount(res.data);
    }),
    logout: thunk((actions, payload, { getState, getStoreState }) => {
        actions.setAccount(null);
    })
};
