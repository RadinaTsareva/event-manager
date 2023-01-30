import React, { useEffect, useState } from 'react';
import { Form, FormGroup } from 'react-bootstrap';
import classes from './EventForms.module.scss';
import { toastHandler, TOAST_STATES } from '../../helpers/toast';
import EventsService from '../../services/eventsService';
import Spinner from '../common/Spinner/Spinner';
import Input from '../common/Input/Input';
import Select from '../common/Select/Select';
import { validateDate, validateEnum, validateText } from '../../utils/validation';
import UserService from '../../services/userService';

const defaultValues = {
    eventName: { name: 'eventName', value: "", valid: true, message: 'Event name should be at least 5 characters long' },
    organizer: { name: 'organizer', value: "", valid: true, message: 'Organizer not set' },
    dateFrom: { name: 'dateFrom', value: "", valid: true, message: 'Date from should not be in the past' },
    dateTo: { name: 'dateTo', value: "", valid: true, message: 'Date to should not be in the past and should be later than date from' },
    type: { name: 'type', value: "", valid: true, message: 'Type not set' },
    foodType: { name: 'foodType', value: "", valid: true, message: 'Food type not set' },
    description: { name: 'description', value: "", valid: true, message: 'Description should be at least 20 characters long' },
    guestsCount: { name: 'guestsCount', value: 0, valid: true, message: 'Guests count should be at least 1' },
    accommodationNeeded: { name: 'accommodationNeeded', value: false, valid: true, message: 'Accommodation needed not set' },
}

const InitialForm = (props) => {
    const [organizer, setOrganizer] = useState(defaultValues.organizer);
    const [organizers, setOrganizers] = useState([]);
    const [eventName, setEventName] = useState(defaultValues.eventName);
    const [dateFrom, setDateFrom] = useState(defaultValues.dateFrom);
    const [dateTo, setDateTo] = useState(defaultValues.dateTo);
    const [type, setType] = useState(defaultValues.type);
    const [isCatering, setIsCatering] = useState(false);
    const [foodType, setFoodType] = useState(defaultValues.foodType);
    const [description, setDescription] = useState(defaultValues.description);
    const [guestsCount, setGuestsCount] = useState(defaultValues.guestsCount);
    const [accommodationNeeded, setAccommodationNeeded] = useState(false);
    const [types, setTypes] = useState([]);
    const [foodTypes, setFoodTypes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData()
    }, [loading]);

    const loadData = async () => {
        if (!props.event) {
            const organizers = await EventsService.getOrganizers()
            setOrganizers(organizers)
        } else {
            setEventName(props.event.name)
            setDateFrom(props.event.start.toISOString().substring(0, 16))
            setDateTo(props.event.end.toISOString().substring(0, 16))
            setType(props.event.type)
            setDescription(props.event.description)
            setAccommodationNeeded(props.event.accommodationNeeded)
        }

        setLoading(false)
    }

    const typeSelectedHandler = async (newValue) => {
        setType(newValue)

        const res = await EventsService.getFoodTypes(organizer, newValue.value, isCatering)
        setFoodTypes(res)
    }

    const organizerSelectedHandler = async (newValue) => {
        setOrganizer(newValue)

        const res = await UserService.getEventTypes(organizer.value)
        setTypes(res)
    }

    const sendClickedHandler = async () => {
        if (!props.event) {
            await EventsService.create({
                organizer,
                start: dateFrom,
                end: dateTo,
                type,
                foodType,
                description,
                guestsCount,
                accommodationNeeded,
            })
            toastHandler({ success: TOAST_STATES.SUCCESS, message: 'Request sent' })
        } else {
            await EventsService.send(props.event.id, {
                start: dateFrom,
                end: dateTo,
                type,
                foodType,
                description,
                accommodationNeeded,
            })
            toastHandler({ success: TOAST_STATES.PENDING, message: 'Response sent' })
        }
    }

    const fields = [
        {
            label: 'Event name', type: 'text', placeholder: 'Event name',
            field: eventName, setField: setEventName, validateFn: (text) => validateText(text, 4)
        },
        {
            label: 'Date from', type: 'datetime-local',
            field: dateFrom, setField: setDateFrom, validateFn: validateDate
        },
        {
            label: 'Date to', type: 'datetime-local',
            field: dateTo, setField: setDateTo, validateFn: validateDate,
            onBlur: () => !!dateFrom.value && !!dateTo.value && new Date(dateFrom.value).getTime() < new Date(dateTo.value).getTime()
        },
        {
            label: 'Description', type: 'text', placeholder: 'Description',
            field: description, setField: setDescription, validateFn: (text) => validateText(text, 19)
        },
    ]

    const additionalFields = [
        {
            label: 'Guests count', type: 'number', placeholder: 'Guests count',
            field: guestsCount, setField: setGuestsCount, validateFn: () => { }
        }
    ]

    if (loading) {
        return <Spinner />
    }

    return (
        <>
            <div className={classes.Category}>{props.heading}</div>
            <Form>
                <Select
                    controlId='formGroupOrganizer'
                    label='Organizer'
                    field={organizer}
                    setField={organizerSelectedHandler}
                    validateFn={validateEnum}
                    disabled={props.disableFields}
                    enum={organizers}
                />
                {fields.map(data =>
                    <div className={classes.Field} key={data.label}>
                        <Input key={data.label}
                            controlId={data.controlId} label={data.label}
                            type={data.type} placeholder={data.placeholder}
                            field={data.field} setField={data.setField}
                            validateFn={data.validateFn}
                            disabled={props.disableFields}
                            onBlur={data.onBlur} />
                    </div>
                )}
                {organizer.value &&
                    <Select
                        controlId='formGroupEventType'
                        label='Event type'
                        field={type}
                        setField={typeSelectedHandler}
                        validateFn={validateEnum}
                        disabled={props.disableFields}
                        enum={types}
                    />
                }
                {type.value &&
                    <>
                        <Form.Group controlId="formFoodCheckbox" className={classes.Radio}>
                            <Form.Check
                                defaultChecked={!isCatering}
                                onChange={() => setIsCatering(!isCatering)}
                                type='radio'
                                id={'menu'}
                                name="group1"
                                label={'Menu'}
                            />
                            <Form.Check
                                defaultChecked={isCatering}
                                onChange={() => setIsCatering(!isCatering)}
                                type='radio'
                                id={'catering'}
                                name="group1"
                                label={'Catering'}
                            />
                        </Form.Group>
                        {additionalFields.map(data =>
                            <div className={classes.Field} key={data.label}>
                                <Input key={data.label}
                                    controlId={data.controlId} label={data.label}
                                    type={data.type} placeholder={data.placeholder}
                                    field={data.field} setField={data.setField}
                                    validateFn={data.validateFn}
                                    disabled={props.disableFields} />
                            </div>
                        )}
                        <Select
                            controlId='formGroupFoodType'
                            label='Food type'
                            field={foodType}
                            // TODO: fix this
                            setField={(newValue) => setFoodType(newValue)}
                            validateFn={validateEnum}
                            disabled={props.disableFields}
                            enum={foodTypes}
                        />
                        <Form.Check
                            className={classes.Checkbox}
                            type='checkbox'
                            id='accommodationNeeded'
                            label='Accommodation needed'
                            checked={accommodationNeeded}
                            onChange={(e) => setAccommodationNeeded(e.target.checked)}
                        />
                    </>
                }
                {!props.disableFields
                    && <button className={classes.SaveBtn} type='button' onClick={sendClickedHandler}>Send</button>
                }
            </Form>
        </>
    );
}

export default InitialForm;