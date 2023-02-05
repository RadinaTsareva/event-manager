import { RequestAPI } from "./baseApi";

class UserService {
    static login = async (data) => {
        return RequestAPI.post('/auth/login', data)
    }

    static registerUser = async (data) => {
        console.log('data', data);
        return RequestAPI.post('/auth/register', data)
    }

    static getCurrentUser = async () => {
        return RequestAPI.get('/users/current-user')
    }

    static blacklistUser = async (id) => {
        await RequestAPI.post(`/users/${id}/blacklist`)
    }

    static updateInfo = async (data) => {
        await RequestAPI.post('/users/update', data)
    }

    static getEventTypes = async (id = null) => {
        if (id) {
            return RequestAPI.get(`/users/${id}/event-types`)
        } else {
            return RequestAPI.get('/users/event-types')
        }
    }

    static getMenuTypes = async (eventTypeId, id = null) => {
        if (id) {
            return RequestAPI.get(`/users/${id}/${eventTypeId}/menu-types`)
        } else {
            return RequestAPI.get(`/users/${eventTypeId}/menu-types`)
        }
    }

    static getCateringTypes = async (eventTypeId, id = null) => {
        if (id) {
            return RequestAPI.get(`/users/${id}/${eventTypeId}/catering-types`)
        } else {
            return RequestAPI.get(`/users/${eventTypeId}/catering-types`)
        }
    }

    static deleteType = async (id, type) => {
        await RequestAPI.post(`/users/${type}`, { id })
    }

    static updateType = async (type, data) => {
        await RequestAPI.post(`/users/update/${type}`, data)
    }

    static addNewType = async (type, data) => {
        await RequestAPI.post(`/users/create/${type}`, data)
    }
}

export default UserService;