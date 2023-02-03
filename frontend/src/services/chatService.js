import { RequestAPI } from "./baseApi";

const messages = [
    {
        id: 1,
        sender: 'name1',
        message: 'lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.',
        createdAt: '2021-01-01T00:00'
    },
    {
        id: 2,
        sender: 'name2',
        message: 'message2',
        createdAt: '2021-01-01T01:00'
    },
    {
        id: 3,
        sender: 'name3',
        message: 'lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.',
        createdAt: '2021-01-01T02:00'
    },
    {
        id: 4,
        sender: 'name4',
        message: 'message4',
        createdAt: '2021-01-01T03:00'
    }
]

class ChatService {
    static getChatsList = async () => {
        // get active chats list (users with previous messages)
        return [{ id: 1, value: 'User 1' }, { id: 2, value: 'User 2' }, { id: 3, value: 'User 3' }]
        // return await RequestAPI.get('/chat/list'); -> ready from Radi
    }

    static getOrganizers = async () => {
        // get organizers list
        return [{ id: 1, value: 'Organizer 1' }, { id: 2, value: 'Organizer 2' }, { id: 3, value: 'Organizer 3' }, { id: 4, value: 'Organizer 4' }]
        // return await RequestAPI.get('/organizers'); -> ready from Radi (sending id,name,email)
    }

    static sendMessage = async (id, message) => { // ready from Radi
        messages.push({
            id: messages.length + 1,
            sender: 'name',
            message,
            createdAt: new Date().toISOString()
        })
        // message: text
        // id: user id
        // await RequestAPI.post('/chat', { message, id });
    }

    static getMessages = async (id) => { //ready from Radi, I'm sending both received and sent messages
        // id: user id
        return messages;
        // return await RequestAPI.get('/chat', id);
    }
}

export default ChatService;