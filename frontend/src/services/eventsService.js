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
    status: STATUS.REJECTED,
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
    id: 2,
    status: STATUS.FINISHED,
    name: 'Event 2',
    type: 'Type 2',
    place: 'Place 2',
    clientEmail: 'alabala@gmail.com',
    isPublic: true,
    hasFeedback: true,
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

const personalStatusEvents = [
    {
        id: 1,
        status: STATUS.EDITABLE,
        name: 'Event 1',
        hasFeedback: false,
        organizerEmail: 'alabala1@gmail.com',
        clientEmail: 'alabala@gmail.com',
    },
    {
        id: 2,
        status: STATUS.EDIT_PENDING,
        name: 'Event 2',
        hasFeedback: false,
        organizerEmail: 'alabala1@gmail.com',
        clientEmail: 'alabala@gmail.com',
    },
    {
        id: 3,
        status: STATUS.FINISHED,
        name: 'Event 3',
        hasFeedback: false,
        organizerEmail: 'alabala1@gmail.com',
        clientEmail: 'alabala@gmail.com',
    },
    {
        id: 4,
        status: STATUS.FINISHED,
        name: 'Event 4',
        hasFeedback: true,
        organizerEmail: 'alabala1@gmail.com',
        clientEmail: 'alabala@gmail.com',
    },
]
class EventsService {
    static getPics = async (id) => {
        return Array(10).fill('https://picsum.photos/200/300')
        // return RequestAPI.get(`/events/${id}/pics`) -> ready from Radi
    }

    static getOrganizers = async () => { //isn't that a duplicate?
        return [{ id: 1, value: 'Organizer 1' }, { id: 2, value: 'Organizer 2' }, { id: 3, value: 'Organizer 3' }, { id: 4, value: 'Organizer 4' }]
        // return RequestAPI.get('/organizers')
    }

    static getFoodTypes = async (organizer, eventType, isCatering) => {
        if (isCatering) {
            return ['Food type 1', 'Food type 2', 'Food type 3']
        }
        return ['Food type 4', 'Food type 5', 'Food type 6']
        // return RequestAPI.get(`/events/${eventType}/foodTypes?isCatering=${isCatering}&&organizerId=${organizer.id}`) // TODO fix if wrong
    }

    static getPersonal = async (month) => {
        return personalEvents
        // only not finished events
        // return RequestAPI.get('/events/personal') -> ready from Radi
    }

    static getAll = async (month) => {
        return allEvents
        // only finished events
        // return RequestAPI.get('/events') -> ready from Radi
    }

    static getAllByOrganizer = async (month, id) => {
        return [{
            start: new Date(Date.now() + 1000 * 60 * 60 * 20 * id),
            end: new Date(Date.now() + 1000 * 60 * 60 * 30 * id),
        },
        {
            start: new Date(Date.now() + 1000 * 60 * 60 * 40 * id),
            end: new Date(Date.now() + 1000 * 60 * 60 * 50 * id),
        },
        {
            start: new Date(Date.now() + 1000 * 60 * 60 * 60 * id),
            end: new Date(Date.now() + 1000 * 60 * 60 * 70 * id),
        },
        {
            start: new Date(Date.now() + 1000 * 60 * 60 * 80 * id),
            end: new Date(Date.now() + 1000 * 60 * 60 * 90 * id),
        }]
        // only finished events
        // return RequestAPI.get(`/events?organizer=${id}`)
    }

    static getAllPersonal = async () => {
        return personalStatusEvents
        // return RequestAPI.get('/events/personal/all') -> ready from Radi
    }

    static getById = async (id) => {
        return personalEvents.concat(allEvents).filter(event => event.id === +id)[0]
        // return RequestAPI.get(`/events/${id}`) -> ready from Radi (with auth)
    }

    static create = async (data) => {
        console.log('[CREATE] data', data)
        // return RequestAPI.post('/events/new', data) ->ready from Radi
    }

    static accept = async (id) => {
        // return RequestAPI.post(`/events/${id}/accept`) -> ready from Radi
    }

    static reject = async (id) => {
        // return RequestAPI.post(`/events/${id}/reject`) -> ready from Radi
    }

    static send = async (data) => { //this is for the whole data
        console.log('[SEND] data', data)
        // return RequestAPI.post('/events', data) //TODO adding event_id in the data -> done in the BE
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
        // return RequestAPI.get(`/events/${id}/comments`) -> ready from radi (user id == created_by_id in the DB)
    }

    static sendFeedback = async (id, rating, feedback) => { // is that feedback for the organizer of the client?
        // rating is a number from 1 to 5
        // return RequestAPI.post(`/events/${id}/feedback`, {feedback, rating})
    }
}

export default EventsService;