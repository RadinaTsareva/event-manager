/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import classes from './EventForms.module.scss';
import { toastHandler, TOAST_STATES } from '../../helpers/toast';
import EventsService from '../../services/eventsService';
import { Form } from 'react-bootstrap';
import Input from '../common/Input/Input';
import Button from '../common/Button/Button';
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
    placeWebsite: { name: 'placeWebsite', value: "", valid: true, message: 'Accommodation website should be a valid URL' },
    mapsLink: { name: 'mapsLink', value: "", valid: true, message: 'Maps link should be a valid URL' },
}

const EditableForm = (props) => {
    const [place, setPlace] = useState(defaultValues.place)
    const [pricePerGuest, setPricePerGuest] = useState(defaultValues.pricePerGuest);
    const [priceForFood, setPriceForFood] = useState(defaultValues.priceForFood);
    const [priceForAccommodation, setPriceForAccommodation] = useState(defaultValues.priceForAccommodation);
    const [accommodationDetails, setAccommodationDetails] = useState(defaultValues.accommodationDetails);
    const [accommodationContact, setAccommodationContact] = useState(defaultValues.accommodationContact);
    const [placeWebsite, setPlaceWebsite] = useState(defaultValues.placeWebsite);
    const [mapsLink, setMapsLink] = useState(defaultValues.mapsLink);

    const navigate = useNavigate();

    useEffect(() => {
        if (props.event.place) {
            loadData()
        }
    }, []);

    const loadData = () => {
        setPlace({ ...place, value: props.event.place })
        setPricePerGuest({ ...pricePerGuest, value: props.event.pricePerGuest })
        setPriceForFood({ ...priceForFood, value: props.event.priceForFood })
        setPriceForAccommodation({ ...priceForAccommodation, value: props.event.priceForAccommodation })
        setAccommodationDetails({ ...accommodationDetails, value: props.event.accommodationDetails })
        setAccommodationContact({ ...accommodationContact, value: props.event.accommodationContact })
        setPlaceWebsite({ ...placeWebsite, value: props.event.placeWebsiteLink })
        setMapsLink({ ...mapsLink, value: props.event.placeGoogleMapsLink })
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
            }
        }

        await EventsService.send({
            eventId: props.event.id,
            place: place.value,
            pricePerGuest: pricePerGuest.value,
            priceForFood: priceForFood.value,
            placeWebsite: placeWebsite.value,
            placeGoogleMapsLink: mapsLink.value,
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
            controlId: 'formGroupAccommodationPrice', label: 'Price for accommodation', type: 'number', placeholder: '2000$',
            field: priceForAccommodation, setField: setPriceForAccommodation, validateFn: validateNumber
        },
        {
            controlId: 'formGroupAccommodationDetails', label: 'Accommodation details', type: 'textarea', placeholder: 'Hotel, 4 stars',
            field: accommodationDetails, setField: setAccommodationDetails, validateFn: (text) => validateText(text, 19)
        },
        {
            controlId: 'formGroupAccommodationContact', label: 'Accommodation contact', type: 'text', placeholder: '+359774839284',
            field: accommodationContact, setField: setAccommodationContact, validateFn: validatePhoneNumber
        },
        {
            controlId: 'formGroupplaceWebsite', label: 'Place website', type: 'text', placeholder: 'https://www.hotel.com',
            field: placeWebsite, setField: setPlaceWebsite, validateFn: validateURL
        },
        {
            controlId: 'formGroupMapsLink', label: 'Link to Google maps pin', type: 'text', placeholder: 'https://www.google.com/maps/place/...',
            field: mapsLink, setField: setMapsLink, validateFn: validateURL
        }
    ]

    const responseFields = [
        {
            controlId: 'formGroupPlace', label: 'Place', type: 'text', placeholder: 'Sofia, Tsar Boris №3',
            field: place, setField: setPlace, validateFn: (text) => validateText(text, 4)
        },
        {
            controlId: 'formGroupGuestPrice', label: 'Price per guest', type: 'number', placeholder: '200$',
            field: pricePerGuest, setField: setPricePerGuest, validateFn: validateNumber
        },
        {
            controlId: 'formGroupFoodPrice', label: 'Price for food', type: 'number', placeholder: '1000$',
            field: priceForFood, setField: setPriceForFood, validateFn: validateNumber
        },
    ]

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
                        <Button className={classes.SendBtn} onClick={sendClickedHandler}>Send</Button>
                    </>
                }
            </Form>
        </>
    );
}

export default EditableForm;