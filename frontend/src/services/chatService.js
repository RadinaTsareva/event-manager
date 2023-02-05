import { RequestAPI } from "./baseApi";

class ChatService {
    static getChatsList = async () => {
        return RequestAPI.get('/chat/list');
    }

    static getOrganizers = async () => {
        return RequestAPI.get('/organizers');
    }

    static sendMessage = async (id, message) => {
        await RequestAPI.post('/chat', { message, id });
    }

    static getMessages = async (id) => {
        return RequestAPI.get(`/chat/${id}`);
    }
}

export default ChatService;