import {RequestAPI} from "./baseApi";

const eventTypes = [
    { id: 1, value: 'event type 1' },
    { id: 2, value: 'event type 2' },
    { id: 3, value: 'event type 3' },
]

const menuTypes = [
    { id: 1, value: 'menu type 1' },
    { id: 2, value: 'menu type 2' },
]

const cateringTypes = [
    { id: 1, value: 'catering type 1' },
    { id: 2, value: 'catering type 2' },
    { id: 3, value: 'catering type 3' },
    { id: 4, value: 'catering type 4' },
]

class UserService {
    static login = async (data) => { //blacklistedCount -> the blacklist this user is blocked
        // return { role: ROLES.CLIENT, token: 'token', email: 'alabala@gmail.com', blacklistedCount: 1 }
        await RequestAPI.post('/users/login', data)
    }

    static registerUser = async (data) => {
        await RequestAPI.post('/users/register', data)
    }

    static blacklistUser = async (id) => {
        // await RequestAPI.post(`/users/${id}/blacklist`)
    }

    static updateInfo = async (data) => {
        // role and email cannot be changed
        // data: { name: 'name' } || { password: 'password' } || ...
        // await RequestAPI.put('/users/update', data)
    }

    static getEventTypes = async (id = null) => { //ready from Radi
        return eventTypes
        // if(id) {
        //     return RequestAPI.get(`/users/${id}/event-types`)
        // } else {
        //     return RequestAPI.get('/users/event-types')
        // }
    }

    static getMenuTypes = async (eventType, id = null) => { // ready from Radi
        return menuTypes
        // if(id) {
        //     return RequestAPI.get(`/users/${id}/${eventType}/menu-types`)
        // } else {
        //     return RequestAPI.get('/users/${eventType}/menu-types')
        // }
    }

    static getCateringTypes = async (eventType, id = null) => { //ready from Radi
        return cateringTypes
        // if(id) {
        //     return RequestAPI.get(`/users/${id}/${eventType}/catering-types`)
        // } else {
        //     return RequestAPI.get('/users/${eventType}/catering-types')
        // }
    }

    static deleteType = async (id, type) => {
        const typeArr = type === 'event-types' ? eventTypes : type === 'menu-types' ? menuTypes : cateringTypes;
        const index = typeArr.findIndex(t => t.id === id);
        typeArr.splice(index, 1);
        // type: 'event-types' || 'menu-types' || 'catering-types'
        // await RequestAPI.delete(`/users/${type}`, { id })
    }

    static updateType = async (type, data) => {
        const typeArr = type === 'event-types' ? eventTypes : type === 'menu-types' ? menuTypes : cateringTypes;
        const index = typeArr.findIndex(t => t.id === data.id);
        typeArr[index].value = data.value;
        // type: 'event-types' || 'menu-types' || 'catering-types'
        // data: { id: 1, value: 'type name' }
        // await RequestAPI.put(`/users/${type}`, data)
    }

    static addNewType = async (type, eventType, data) => {
        const typeArr = type === 'event-types' ? eventTypes : type === 'menu-types' ? menuTypes : cateringTypes;
        typeArr.push({id: typeArr.length + 1, value: data.value});
        // type: 'event-types' || 'menu-types' || 'catering-types'
        // data: { value: 'type name' , eventType : 'wedding'}
        // await RequestAPI.post(`/users/${type}`, data)
    }
}

export default UserService;