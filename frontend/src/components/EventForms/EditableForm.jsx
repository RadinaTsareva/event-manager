/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import classes from './EventForms.module.scss';
import { toastHandler, TOAST_STATES } from '../../helpers/toast';
import EventsService from '../../services/eventsService';
import Spinner from '../common/Spinner/Spinner';
import { Form } from 'react-bootstrap';
import Input from '../common/Input/Input';

const EditableForm = (props) => {
    const [place, setPlace] = useState('');
    const [dateFrom, setDateFrom] = useState();
    const [dateTo, setDateTo] = useState();
    const [pricePerGuest, setPricePerGuest] = useState();
    const [priceForFood, setPriceForFood] = useState();
    const [foodDetails, setFoodDetails] = useState('');
    const [priceForAccommodation, setPriceForAccommodation] = useState();
    const [accommodationDetails, setAccommodationDetails] = useState('');
    const [accommodationContact, setAccommodationContact] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData()
    }, [loading]);

    const loadData = () => {
        setPlace(props.event.place)
        setDateFrom(props.event.start.toISOString().substring(0, 16))
        setDateTo(props.event.end.toISOString().substring(0, 16))
        setPricePerGuest(props.event.pricePerGuest)
        setPriceForFood(props.event.priceForFood)
        setFoodDetails(props.event.foodDetails)
        setPriceForAccommodation(props.event.priceForAccommodation)
        setAccommodationDetails(props.event.accommodationDetails)
        setAccommodationContact(props.event.accommodationContact)
        setLoading(false)
    }

    const sendClickedHandler = async () => {
        let accommodationData = {}
        if (props.event.accommodationNeeded) {
            accommodationData = {
                priceForAccommodation,
                accommodationDetails,
                accommodationContact
            }
        }

        //needs also the placeGoogleMapsLink and placeWebsite
        //needs eventId in the data
        await EventsService.send(props.event.id, {
            place,
            start: dateFrom, //those are set in the create
            end: dateTo, //those are set in the create
            pricePerGuest,
            priceForFood,
            foodDetails, //no idea what that is, nothing like that in the DB
            ...accommodationData //can be null depending if the event wants accommodation
        })
        toastHandler({ success: TOAST_STATES.PENDING, message: 'Response sent' })
    }

    const accommodationFields = [
        {
            label: 'Price for accommodation', type: 'number', placeholder: '2000$',
            field: priceForAccommodation, setField: setPriceForAccommodation, validateFn: () => { }
        },
        {
            label: 'Accommodation details', type: 'textarea', placeholder: 'Hotel, 4 stars',
            field: accommodationDetails, setField: setAccommodationDetails, validateFn: () => { }
        },
        {
            label: 'Accommodation contact', type: 'text', placeholder: '+359774839284',
            field: accommodationContact, setField: setAccommodationContact, validateFn: () => { }
        },
    ]

    const responseFields = [
        {
            label: 'Place', type: 'text', placeholder: 'Sofia, Tsar Boris №3',
            field: place, setField: setPlace, validateFn: () => { }
        },
        {
            label: 'Date from', type: 'datetime-local', placeholder: '2021-01-01',
            field: dateFrom, setField: setDateFrom, validateFn: () => { }
        },
        {
            label: 'Date to', type: 'datetime-local', placeholder: '2021-01-01',
            field: dateTo, setField: setDateTo, validateFn: () => { }
        },
        {
            label: 'Price per guest', type: 'number', placeholder: '200$',
            field: pricePerGuest, setField: setPricePerGuest, validateFn: () => { }
        },
        {
            label: 'Price for food', type: 'number', placeholder: '1000$',
            field: priceForFood, setField: setPriceForFood, validateFn: () => { }
        },
        {
            label: 'Food details', type: 'textarea', placeholder: '...',
            field: foodDetails, setField: setFoodDetails, validateFn: () => { }
        },
    ]

    if (loading) {
        return <Spinner />
    }

    return (
        <>
            <div className={classes.Category}>{props.heading}</div>
            <Form>
                {responseFields.concat(props.event.accommodationNeeded ? accommodationFields : []).map(data =>
                    <div className={classes.Field} key={data.label}>
                        <Input key={data.label}
                            controlId={data.controlId} label={data.label}
                            type={data.type} placeholder={data.placeholder}
                            field={data.field} setField={data.setField}
                            validateFn={data.validateFn}
                            disabled={props.disableFields} />
                    </div>
                )}
                {!props.disableFields
                    && <button className={classes.SaveBtn} type='button' onClick={sendClickedHandler}>Send</button>
                }
            </Form>
        </>
    );
}

export default EditableForm;