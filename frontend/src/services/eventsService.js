import { STATUS } from "../utils/enums";
import { RequestAPI } from "./baseApi";

const personalEvents = [{
    id: 1,
    status: STATUS.EDITABLE,
    name: 'Event 1',
    start: new Date(Date.now() + 10000 * 60 * 60 * 3),
    end: new Date(Date.now() + 10000 * 60 * 60 * 5),
    organizer: 'John Doe',
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
}, {
    // TODO an event should look like this, with empty fields on commencement
    id: 3,
    status: STATUS.EDITABLE,
    name: 'Event 3',
    start: new Date(Date.now() + 10000 * 60 * 60 * 3),
    end: new Date(Date.now() + 10000 * 60 * 60 * 5),
    organizer: {
        firstName: 'John',
        lastName: 'Doe'
    },
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
}]

const allEvents = [{
    id: 2,
    status: STATUS.ACCEPTED,
    name: 'Event 2',
    start: new Date(Date.now() + 1000 * 60 * 60 * 2),
    end: new Date(Date.now() + 1000 * 60 * 60 * 3),
    organizer: {
        firstName: 'John',
        lastName: 'Doe'
    }
}]

class EventsService {
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
        return personalEvents.filter(event => event.id === +id)[0]
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
}

export default EventsService;