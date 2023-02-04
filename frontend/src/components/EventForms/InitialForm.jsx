/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import classes from './EventForms.module.scss';
import { toastHandler, TOAST_STATES } from '../../helpers/toast';
import EventsService from '../../services/eventsService';
import Input from '../common/Input/Input';
import Select from '../common/Select/Select';
import { validateDate, validateOptions, validateText, validateNumber } from '../../utils/validation';
import UserService from '../../services/userService';
import Calendar from '../../containers/Calendar/Calendar';
import { useNavigate } from 'react-router';

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
    const [date, setDate] = useState({ month: new Date(Date.now()).getMonth(), year: new Date(Date.now()).getFullYear() });
    const [events, setEvents] = useState([]);
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

    const navigate = useNavigate();

    useEffect(() => {
        loadData()
    }, []);

    const loadEvents = async (organizer) => {
        const res = await EventsService.getAllByOrganizer(organizer.value, date.month + 1, date.year)
        setEvents(res)
    }

    const loadData = async () => {
        if (!props.event) {
            const organizers = await EventsService.getOrganizers()
            setOrganizers(organizers)
        } else {
            setOrganizer({ ...organizer, value: props.event.organizerName })
            setEventName({ ...eventName, value: props.event.name })
            setDateFrom({ ...dateFrom, value: new Date(props.event.start).toISOString().substring(0, 16) })
            setDateTo({ ...dateTo, value: new Date(props.event.end).toISOString().substring(0, 16) })
            setType({ ...type, value: props.event.type })
            setIsCatering(props.event.isCatering)
            setFoodType({ ...foodType, value: props.event.foodType })
            setDescription({ ...description, value: props.event.description })
            setGuestsCount({ ...guestsCount, value: props.event.guestsCount })
            setAccommodationNeeded(!!props.event.accommodationNeeded)
        }
    }

    const typeSelectedHandler = async (newValue) => {
        setType(newValue)
        const res = await EventsService.getFoodTypes(organizer.value, newValue.value, isCatering)
        setFoodTypes(res)
    }

    const menuOrCateringSelectedHandler = async (value) => {
        let res = await EventsService.getFoodTypes(organizer.value, type.value, value)
        setFoodType(defaultValues.foodType)
        setFoodTypes(res)
        setIsCatering(value)
    }

    const organizerSelectedHandler = async (newValue) => {
        setOrganizer(newValue)

        await loadEvents(newValue)

        const res = await UserService.getEventTypes(newValue.value)
        setTypes(res)
    }

    const timeRangeHandler = ({ start, end }) => {
        setDateFrom({ ...dateFrom, value: start.toString('yyyy-MM-ddThh:mm') })
        setDateTo({ ...dateTo, value: end.toString('yyyy-MM-ddThh:mm') })
    }

    const sendClickedHandler = async () => {
        if (!props.event) {
            await EventsService.create({
                organizerId: organizer.value,
                name: eventName.value,
                isCatering,
                start: dateFrom.value,
                end: dateTo.value,
                type: type.value,
                foodType: foodType.value,
                description: description.value,
                guestsCount: guestsCount.value,
                accommodationNeeded,
            })
            toastHandler({ success: TOAST_STATES.SUCCESS, message: 'Request sent' })
        } else {
            await EventsService.send(props.event.id, {
                start: dateFrom.value,
                end: dateTo.value,
                type: type.value,
                foodType: foodType.value,
                description: description.value,
                accommodationNeeded,
            })
            toastHandler({ success: TOAST_STATES.PENDING, message: 'Response sent' })
        }

        navigate('/')
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
            field: guestsCount, setField: setGuestsCount, validateFn: validateNumber
        }
    ]

    return (
        <>
            <div className={classes.Category}>{props.heading}</div>
            <Form>
                <Select
                    controlId='formGroupOrganizer'
                    label='Organizer'
                    field={organizer}
                    setField={organizerSelectedHandler}
                    validateFn={validateOptions}
                    disabled={props.disableFields}
                    options={organizers}
                />
                {organizer.value && !props.disableFields &&
                    <Calendar
                        dateChangedHandler={setDate}
                        events={events}
                        timeRangeHandler={timeRangeHandler}
                        preview={true} />}
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
                        validateFn={validateOptions}
                        disabled={props.disableFields}
                        options={types}
                    />
                }
                {type.value &&
                    <>
                        <Form.Group controlId="formFoodCheckbox" className={classes.Radio}>
                            <Form.Check
                                defaultChecked={!isCatering}
                                onChange={() => menuOrCateringSelectedHandler(!isCatering)}
                                type='radio'
                                id={'menu'}
                                name="group1"
                                label={'Menu'}
                            />
                            <Form.Check
                                defaultChecked={isCatering}
                                onChange={() => menuOrCateringSelectedHandler(!isCatering)}
                                type='radio'
                                disabled={props.disableFields}
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
                            setField={setFoodType}
                            validateFn={validateOptions}
                            disabled={props.disableFields}
                            options={foodTypes}
                        />
                        <Form.Check
                            className={classes.Checkbox}
                            type='checkbox'
                            id='accommodationNeeded'
                            label='Accommodation needed'
                            disabled={props.disableFields}
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