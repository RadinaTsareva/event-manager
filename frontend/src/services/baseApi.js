
import axios from 'axios';
import { toastHandler, TOAST_STATES } from '../helpers/toast';
import store from '../store/index';
import { RESPONSE_STATUS } from '../utils/enums';
export class RequestAPI {
    static async get(endpoint) {
        this.auth()
        try {
            const data = await axios.get(process.env.REACT_APP_API_ENDPOINT + endpoint);
            return data.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    static async post(endpoint, body = undefined) {
        try {
            const data = await axios.post(process.env.REACT_APP_API_ENDPOINT + endpoint, body ? { ...body } : {});
            this.handleSuccess(data.data);
            return data.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    static async put(endpoint, body = undefined) {
        try {
            const data = await axios.put(process.env.REACT_APP_API_ENDPOINT + endpoint, body ? { ...body } : {});
            this.handleSuccess(data.data);
            return data.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    static async delete(endpoint) {
        try {
            const data = await axios.delete(process.env.REACT_APP_API_ENDPOINT + endpoint);
            this.handleSuccess(data.data);
            return data.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    static handleSuccess(data) {
        if (data && data.status === RESPONSE_STATUS.SUCCESS && data.message) {
            toastHandler({ success: TOAST_STATES.SUCCESS, message: data.message })
        }
    }

    static handleError(error) {
        const data = error.response.data
        this.userUnauthorized(data);
        this.genericError(data);
    }

    static userUnauthorized(error) {
        if (error.status === RESPONSE_STATUS.VALIDATION_ERROR) {
            toastHandler({ success: TOAST_STATES.ERROR, message: error.message })
        }
    }

    static genericError = (error) => {
        if (error.status !== RESPONSE_STATUS.VALIDATION_ERROR) {
            toastHandler({ success: TOAST_STATES.ERROR, message: error.message })
        }
    }

    static auth = () => {
        const token = store.getState().userStore.account?.token
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
}
