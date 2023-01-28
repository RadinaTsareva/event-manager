import { ROLES, STATUS } from "../utils/enums";
import { RequestAPI } from "./baseApi";

const clients = [
    {
        id: 1,
        name: 'John',
        email: 'client1@gmail.com',
        accountBlocked: true
    },
    {
        id: 2,
        name: 'John',
        email: 'client2@gmail.com',
        accountBlocked: false
    }
]

const organizers = [
    {
        id: 1,
        name: 'John',
        email: 'organizer1@gmail.com',
        accountBlocked: true
    },
    {
        id: 2,
        name: 'John',
        email: 'organizer2@gmail.com',
        accountBlocked: false
    }
]

const events = [
    ...Object.values(STATUS).map((status, index) => {
        return {
            id: index + 1,
            name: 'Event ' + (index + 1),
            description: 'Event ' + (index + 1) + ' description lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.',
            clientEmail: 'client@gmail.com',
            organizerEmail: 'organizer@gmail.com',
            status,
            start: '2021-0' + (index + 1) + '-01T00:00',
            end: '2021-0' + (index + 1) + '-09T00:00',
        }
    })
]

class AdminService {
    static getData = async (type) => {
        const data = type === ROLES.CLIENT ? clients : type === ROLES.ORGANIZER ? organizers : events;
        return data;
        // return RequestAPI.get('/admin/' + type);
    }

    static searchFilter = async (data) => {
        const type = data.type === ROLES.CLIENT ? clients : data.type === ROLES.ORGANIZER ? organizers : events;
        if (data.type !== 'event') {
            return type.filter(item => item.name.toLowerCase().includes(data.search.toLowerCase()) || item.email.toLowerCase().includes(data.search.toLowerCase()));
        }

        return type.filter(item => item.name.toLowerCase().includes(data.search.toLowerCase()) || item.description.toLowerCase().includes(data.search.toLowerCase()));

        // data:
        // {
        //      type: 'client' || 'organizer' || 'event',
        //      search: 'search string'
        // }
        // return RequestAPI.post('/admin/search', data);
    }

    static setUserBlockStatus = async (data) => {
        const type = data.type === ROLES.CLIENT ? clients : organizers;
        const user = type.find(item => item.id === data.id);
        user.accountBlocked = data.blocked;

        // data:
        // {
        //      id: 1,
        //      type: 'client' || 'organizer',
        //      blocked: true || false
        // }
        // await RequestAPI.post('/admin/block', data);
    }

    static setEventStatus = async (data) => {
        // data:
        // {
        //      id: 1,
        //      status: 'accepted' || 'rejected' || ...
        // }
        // await RequestAPI.post('/admin/event/status', data);
    }
}

export default AdminService;