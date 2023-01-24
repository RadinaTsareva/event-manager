import { RequestAPI } from "./baseApi";

class UserService {
    static login = (data) => {
        return RequestAPI.post('/users/login', data)
    }

    static registerClient = (data) => {
        return RequestAPI.post('/users/register', data)
    }

    static registerOrganizer = (data) => {
        return RequestAPI.post('/users/register?type=BusinessHolder', data)
    }

    static setBusinessType = (data) => {
        return RequestAPI.post('/users/profile/businessType', { data })
    }

    static getProfile = () => {
        return RequestAPI.get('/users/profile')
    }

    static setAvailability = (availability) => {
        return RequestAPI.post('/users/profile/availability', { availability })
    }
}

export default UserService;