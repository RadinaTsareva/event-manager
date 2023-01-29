import { ROLES } from "../utils/enums";
import { RequestAPI } from "./baseApi";

class UserService {
    static login = async (data) => {
        return { role: ROLES.CLIENT, token: 'token', email: 'alabala@gmail.com', blacklisted: [1, 2] }
        // await RequestAPI.post('/users/login', data)
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
}

export default UserService;