/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import classes from './EventForms.module.scss';
import { toastHandler, TOAST_STATES } from '../../helpers/toast';
import EventsService from '../../services/eventsService';
import Spinner from '../common/Spinner/Spinner';
import { Form } from 'react-bootstrap';
import Input from '../common/Input/Input';
import { validateNumber, validatePhoneNumber, validateText, validateURL } from '../../utils/validation';
import Map from '../Map/Map';
import { useNavigate } from 'react-router';

const defaultValues = {
    place: { name: 'place', value: "", valid: true, message: 'Place should be at least 5 characters long' },
    pricePerGuest: { name: 'pricePerGuest', value: "", valid: true, message: 'Price per guest should be a number greater than 0' },
    priceForFood: { name: 'priceForFood', value: "", valid: true, message: 'Price for food should be a number greater than 0' },
    priceForAccommodation: { name: 'priceForAccommodation', value: "", valid: true, message: 'Price for accommodation should be a number greater than 0' },
    accommodationDetails: { name: 'accommodationDetails', value: "", valid: true, message: 'Accommodation details should be at least 20 characters long' },
    accommodationContact: { name: 'accommodationContact', value: "", valid: true, message: 'Accommodation contact should be a valid phone number' },
    accommodationWebsite: { name: 'accommodationWebsite', value: "", valid: true, message: 'Accommodation website should be a valid URL' },
    mapsLink: { name: 'mapsLink', value: "", valid: true, message: 'Maps link should be a valid URL' },
}

const EditableForm = (props) => {
    const [place, setPlace] = useState(defaultValues.place)
    const [pricePerGuest, setPricePerGuest] = useState(defaultValues.pricePerGuest);
    const [priceForFood, setPriceForFood] = useState(defaultValues.priceForFood);
    const [priceForAccommodation, setPriceForAccommodation] = useState(defaultValues.priceForAccommodation);
    const [accommodationDetails, setAccommodationDetails] = useState(defaultValues.accommodationDetails);
    const [accommodationContact, setAccommodationContact] = useState(defaultValues.accommodationContact);
    const [accommodationWebsite, setAccommodationWebsite] = useState(defaultValues.accommodationWebsite);
    const [mapsLink, setMapsLink] = useState(defaultValues.mapsLink);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        loadData()
    }, [loading]);

    const loadData = () => {
        setPlace({ ...place, value: props.event.place })
        setPricePerGuest({ ...pricePerGuest, value: props.event.pricePerGuest })
        setPriceForFood({ ...priceForFood, value: props.event.priceForFood })
        setPriceForAccommodation({ ...priceForAccommodation, value: props.event.priceForAccommodation })
        setAccommodationDetails({ ...accommodationDetails, value: props.event.accommodationDetails })
        setAccommodationContact({ ...accommodationContact, value: props.event.accommodationContact })
        setMapsLink({ ...mapsLink, value: props.event.placeGoogleMapsLink })
        setLoading(false)
    }

    const sendClickedHandler = async () => {
        let valid = true;
        for (const data of responseFields) {
            if (!data.field.valid || data.field.value === "") {
                valid = false
                break
            }
        }

        if (valid && props.event.accommodationNeeded) {
            for (const data of accommodationFields) {
                if (!data.field.valid || data.field.value === "") {
                    valid = false
                }
            }
        }

        if (!valid) {
            return toastHandler({ success: TOAST_STATES.ERROR, message: 'Please fill in all required fields' })
        }

        let accommodationData = {}
        if (props.event.accommodationNeeded) {
            accommodationData = {
                priceForAccommodation: priceForAccommodation.value,
                accommodationDetails: accommodationDetails.value,
                accommodationContact: accommodationContact.value,
                accommodationWebsite: accommodationWebsite.value,
                mapsLink: mapsLink.value
            }
        }

        await EventsService.send({
            id: props.event.id,
            place: place.value,
            pricePerGuest: pricePerGuest.value,
            priceForFood: priceForFood.value,
            ...accommodationData
        })
        toastHandler({ success: TOAST_STATES.PENDING, message: 'Response sent' })

        navigate('/')
    }

    const setPositionHandler = (pos) => {
        setMapsLink({ ...mapsLink, valid: true, value: `https://www.google.com/maps/search/?api=1&query=${pos.latitude},${pos.longitude}` })
    }

    const accommodationFields = [
        {
            label: 'Price for accommodation', type: 'number', placeholder: '2000$',
            field: priceForAccommodation, setField: setPriceForAccommodation, validateFn: validateNumber
        },
        {
            label: 'Accommodation details', type: 'textarea', placeholder: 'Hotel, 4 stars',
            field: accommodationDetails, setField: setAccommodationDetails, validateFn: (text) => validateText(text, 19)
        },
        {
            label: 'Accommodation contact', type: 'text', placeholder: '+359774839284',
            field: accommodationContact, setField: setAccommodationContact, validateFn: validatePhoneNumber
        },
        {
            label: 'Accommodation website', type: 'text', placeholder: 'https://www.hotel.com',
            field: accommodationWebsite, setField: setAccommodationWebsite, validateFn: validateURL
        },
        {
            label: 'Link to Google maps pin', type: 'text', placeholder: 'https://www.google.com/maps/place/...',
            field: mapsLink, setField: setMapsLink, validateFn: validateURL
        }
    ]

    const responseFields = [
        {
            label: 'Place', type: 'text', placeholder: 'Sofia, Tsar Boris №3',
            field: place, setField: setPlace, validateFn: (text) => validateText(text, 4)
        },
        {
            label: 'Price per guest', type: 'number', placeholder: '200$',
            field: pricePerGuest, setField: setPricePerGuest, validateFn: validateNumber
        },
        {
            label: 'Price for food', type: 'number', placeholder: '1000$',
            field: priceForFood, setField: setPriceForFood, validateFn: validateNumber
        },
    ]

    if (loading) {
        return <Spinner />
    }

    return (
        <>
            {props.heading && <div className={classes.Category}>{props.heading}</div>}
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
                    && <>
                        <Map setPosition={setPositionHandler} />
                        <button className={classes.SaveBtn} type='button' onClick={sendClickedHandler}>Send</button>
                    </>
                }
            </Form>
        </>
    );
}

export default EditableForm;