import { STATUS } from "../utils/enums";
import { RequestAPI } from "./baseApi";

const personalEvents = [{
    id: 1,
    status: STATUS.EDITABLE,
    name: 'Event 1',
    start: new Date(Date.now() + 10000 * 60 * 60 * 3),
    end: new Date(Date.now() + 10000 * 60 * 60 * 5),
    organizerName: 'John Doe',
    organizerEmail: 'alabala2@gmail.com',
    organizerId: 1,
    type: 'Type 1',
    moreInfo: 'More info 1',
    description: 'Description 1',
    accommodationNeeded: true,
    place: '',
    pricePerGuest: 0,
    priceForFood: 0,
    foodDetails: '',
    priceForAccommodation: 0,
    accommodationDetails: '',
    accommodationContact: '',
    accommodationWebsite: '',
    hasFeedback: false,
    isPublic: false,
}, {
    // TODO an event should look like this, with empty fields on commencement
    id: 3,
    status: STATUS.EDITABLE,
    name: 'Event 3',
    start: new Date(Date.now() + 10000 * 60 * 60 * 3),
    end: new Date(Date.now() + 10000 * 60 * 60 * 5),
    organizerName: 'John Doe',
    organizerEmail: 'alabala1@gmail.com',
    organizerId: 1,
    type: 'Type 1',
    moreInfo: 'More info 1',
    description: 'Description 1',
    accommodationNeeded: true,
    place: 'Place 3',
    pricePerGuest: 100,
    priceForFood: 200,
    foodDetails: 'Food details 3',
    priceForAccommodation: 300,
    accommodationDetails: 'Accommodation details 3',
    accommodationContact: '+380000000000',
    accommodationWebsite: 'https://www.google.com',
    hasFeedback: false,
    isPublic: false,
}]

const allEvents = [{
    id: 2,
    status: STATUS.ACCEPTED,
    name: 'Event 2',
    type: 'Type 2',
    place: 'Place 2',
    clientEmail: 'alabala@gmail.com',
    isPublic: true,
    start: new Date(Date.now() + 1000 * 60 * 60 * 2),
    end: new Date(Date.now() + 1000 * 60 * 60 * 3),
    organizerName: 'John Doe',
    organizerEmail: 'alabala1@gmail.com'
}]

const comments = [
    {
        userId: 1,
        userName: 'John Doe 1',
        content: 'Comment 1',
    },
    {
        userId: 2,
        userName: 'Jane Doe 2',
        content: 'Comment 2',
    },
    {
        userId: 3,
        userName: 'John Doe 3',
        content: 'Comment 3',
    }
]
class EventsService {
    static getPics = async (id) => {
        return Array(10).fill('https://picsum.photos/200/300')
        // return RequestAPI.get(`/events/${id}/pics`)
    }

    static getTypes = async (organizer) => {
        return ['Type 1', 'Type 2', 'Type 3']
        // return RequestAPI.get('/events/types')
    }

    static getOrganizers = async () => {
        return ['Organizer 1', 'Organizer 2', 'Organizer 3']
        // return RequestAPI.get('/events/organizers')
    }

    static getFoodTypes = async (organizer, eventType) => {
        return ['Food type 1', 'Food type 2', 'Food type 3']
        // return RequestAPI.get(`/events/${eventType}/foodTypes`)
    }

    static getPersonal = async (month) => {
        return personalEvents
        // only not finished events
        // return RequestAPI.get('/events/personal')
    }

    static getAll = async (month) => {
        return allEvents
        // only finished events
        // return RequestAPI.get('/events')
    }

    static getById = async (id) => {
        return personalEvents.concat(allEvents).filter(event => event.id === +id)[0]
        // return RequestAPI.get(`/events/${id}`)
    }

    static accept = async (id) => {
        // return RequestAPI.post(`/events/${id}/accept`)
    }

    static reject = async (id) => {
        // return RequestAPI.post(`/events/${id}/reject`)
    }

    static send = async (id, data) => {
        console.log('[SEND] data', data)
        // return RequestAPI.post('/events', data)
    }

    static update = async (id, data) => {
        console.log('[UPDATE] data', data)
        let event = personalEvents.concat(allEvents).filter(event => event.id === +id)[0]
        Object.keys(data).forEach(key => {
            event[key] = data[key]
        })
        // return RequestAPI.put(`/events/${id}`, data)
    }

    static comment = async (id, commentInput) => {
        console.log('[COMMENT] data', commentInput)
        // return RequestAPI.post(`/events/${id}/comment`, commentInput)
    }

    static getCommentsByEventId = async (id) => {
        // sorted by date from newest to oldest
        return comments
        // return RequestAPI.get(`/events/${id}/comments`)
    }

    static sendFeedback = async (id, rating, feedback) => {
        // rating is a number from 1 to 5
        // return RequestAPI.post(`/events/${id}/feedback`, {feedback, rating})
    }
}

export default EventsService;