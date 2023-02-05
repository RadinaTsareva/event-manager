import { STATUS } from "../utils/enums";
import { RequestAPI } from "./baseApi";

const personalEvents = [{
    id: 1,
    status: STATUS.REJECTED,
    name: 'Event 1',
    start: new Date(Date.now() + 10000 * 60 * 60 * 3),
    end: new Date(Date.now() + 10000 * 60 * 60 * 5),
    organizerName: 'John Doe',
    organizerEmail: 'alabala2@gmail.com',
    organizerId: 1,
    clientEmail: 'alabala@gmail.com',
    type: 'Type 1',
    moreInfo: 'More info 1',
    description: 'Description 1',
    foodType: 'Food type 1',
    accommodationNeeded: true,
    place: '',
    pricePerGuest: 0,
    guestsCount: 1,
    priceForFood: 0,
    foodDetails: '', // TODO this is foodType in the BE or is catering ??
    priceForAccommodation: 0,
    accommodationDetails: '',
    accommodationContact: '',
    accommodationWebsite: '',
    hasFeedback: false,
    isPublic: false,
}, {
    // TODO an event should look like this, with empty fields on commencement
    id: 3,
    status: STATUS.FINISHED,
    name: 'Event 3',
    start: new Date(Date.now() + 10000 * 60 * 60 * 3),
    end: new Date(Date.now() + 10000 * 60 * 60 * 5),
    organizerName: 'John Doe',
    organizerEmail: 'alabala1@gmail.com',
    organizerId: 1,
    clientEmail: 'alabala@gmail.com',
    type: 'Type 1',
    moreInfo: 'More info 1',
    description: 'Description 1',
    accommodationNeeded: true,
    place: 'Place 3',
    pricePerGuest: 100,
    priceForFood: 200,
    foodType: 'Food type 1',
    guestsCount: 10,
    foodDetails: 'Food details 3',
    priceForAccommodation: 300,
    accommodationDetails: 'Accommodation details 3',
    accommodationContact: '+380000000000',
    accommodationWebsite: 'https://www.google.com',
    hasFeedback: false, // TODO change to hasGivenFeedback (i wrote it like that in the BE)
    isPublic: false,
}]

const allEvents = [{
    id: 10,
    status: STATUS.FINISHED,
    name: 'Event 2',
    type: 'Type 2',
    place: 'Place 2',
    clientEmail: 'alabala@email.com',
    isPublic: true,
    hasFeedback: false,
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
        // return RequestAPI.get(`/events/${id}/pics`) -> ready from Radi
    }

    static uploadPics = async (id, pics) => {
        // return RequestAPI.post(`/events/${id}/pics`, pics)
    }

    static getOrganizers = async () => {
        return RequestAPI.get('/organizers')
    }

    static getFoodTypes = async (organizerId, eventType, isCatering) => {
        return RequestAPI.get(`/events/${eventType}/foodTypes?isCatering=${isCatering}&organizerId=${organizerId}`)
    }

    static getPersonal = async (month, year) => {
        // return personalEvents
        return RequestAPI.get(`/events/personal/${month}/${year}`)
    }

    static getAll = async (month, year) => {
        return allEvents
        // only finished events
        // return RequestAPI.get(`/events/${month}/${year}`)
    }

    static getAllByOrganizer = async (id, month, year) => {
        return RequestAPI.get(`/events/${month}/${year}?organizerId=${id}`)
    }

    static getAllPersonal = async (month, year) => {
        return RequestAPI.get(`/events/personal/all`)
    }

    static getById = async (id) => {
        const event = await RequestAPI.get(`/events/${id}`)
        if (!event) {
            return personalEvents.concat(allEvents).filter(event => event.id === +id)[0]
        }
        return event
    }

    static create = async (data) => {
        console.log('[CREATE] data', data)
        return RequestAPI.post('/events/new', data) //->ready from Radi
    }

    static accept = async (id) => {
        return RequestAPI.post(`/events/${id}/accept`)
    }

    static reject = async (id) => {
        return RequestAPI.post(`/events/${id}/reject`)
    }

    static send = async (data) => { //this is for the whole data
        console.log('[SEND] data', data)
        return RequestAPI.post(`/events/${data.eventId}`, data) //TODO adding event_id in the data -> done in the BE
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
        comments.push({
            userId: id,
            userName: 'John Doe',
            content: commentInput,
        })
        // return RequestAPI.post(`/events/${id}/comment`, commentInput)
    }

    static getCommentsByEventId = async (id) => {
        // sorted by date from newest to oldest
        return comments
        // return RequestAPI.get(`/events/${id}/comments`) -> ready from radi (user id == created_by_id in the DB)
    }

    static sendFeedback = async (id, rating, feedback) => { // is that feedback for the organizer of the client?
        // rating is a number from 1 to 5
        // return RequestAPI.post(`/events/${id}/feedback`, {feedback, rating})
    }
}

export default EventsService;