import React, { useEffect, useState } from 'react';
import { Form, FormGroup } from 'react-bootstrap';
import classes from './EventForms.module.scss';
import { toastHandler, TOAST_STATES } from '../../helpers/toast';
import EventsService from '../../services/eventsService';
import Spinner from '../common/Spinner/Spinner';
import Input from '../common/Input/Input';

const InitialForm = (props) => {
    const [organizer, setOrganizer] = useState('');
    const [organizers, setOrganizers] = useState([]);
    const [dateFrom, setDateFrom] = useState();
    const [dateTo, setDateTo] = useState();
    const [type, setType] = useState('');
    const [foodType, setFoodType] = useState('');
    const [description, setDescription] = useState('');
    const [guestsCount, setGuestsCount] = useState();
    const [accommodationNeeded, setAccommodationNeeded] = useState(false);
    const [types, setTypes] = useState([]);
    const [foodTypes, setFoodTypes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData()
    }, [loading]);

    const loadData = async () => {
        if (!props.event) {
            const types = await EventsService.getTypes(organizer)
            setTypes(types)

            const organizers = await EventsService.getOrganizers()
            setOrganizers(organizers)
        } else {
            setDateFrom(props.event.start.toISOString().substring(0, 16))
            setDateTo(props.event.end.toISOString().substring(0, 16))
            setType(props.event.type)
            setDescription(props.event.description)
            setAccommodationNeeded(props.event.accommodationNeeded)
        }

        setLoading(false)
    }

    const typeSelectedHandler = async (e) => {
        setType(e.target.value)

        const res = await EventsService.getFoodTypes(organizer, e.target.value)
        setFoodTypes(res)
    }

    const organizerSelectedHandler = async (e) => {
        setOrganizer(e.target.value)

        const res = await EventsService.getTypes(organizer)
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
            label: 'Date from', type: 'datetime-local', placeholder: '2021-01-01',
            field: dateFrom, setField: setDateFrom, validateFn: () => { }
        },
        {
            label: 'Date to', type: 'datetime-local', placeholder: '2021-01-01',
            field: dateTo, setField: setDateTo, validateFn: () => { }
        },
        {
            label: 'Description', type: 'text', placeholder: 'Description',
            field: description, setField: setDescription, validateFn: () => { }
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
                <FormGroup>
                    <Form.Label>Organizers</Form.Label>
                    <Form.Select
                        className={classes.SelectForm}
                        value={organizer}
                        onChange={organizerSelectedHandler}
                        disabled={props.disableFields}
                        aria-label="Select organizer">
                        <option value=''>Select organizer</option>
                        {organizers.map(organizer =>
                            <option key={organizer} value={organizer}>{organizer}</option>
                        )}
                    </Form.Select>
                </FormGroup>
                {fields.map(data =>
                    <div className={classes.Field} key={data.label}>
                        <Input key={data.label}
                            controlId={data.controlId} label={data.label}
                            type={data.type} placeholder={data.placeholder}
                            field={data.field} setField={data.setField}
                            validateFn={data.validateFn}
                            disabled={props.disableFields} />
                    </div>
                )}
                {organizer && <FormGroup>
                    <Form.Label>Event type</Form.Label>
                    <Form.Select
                        className={classes.SelectForm}
                        value={type}
                        onChange={typeSelectedHandler}
                        disabled={props.disableFields}
                        aria-label="Select event type">
                        <option value=''>Select event type</option>
                        {types.map(type =>
                            <option key={type} value={type}>{type}</option>
                        )}
                    </Form.Select>
                </FormGroup>
                }
                {type &&
                    <>
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
                        <FormGroup>
                            <Form.Label>Food type</Form.Label>
                            <Form.Select
                                className={classes.SelectForm}
                                value={foodType}
                                onChange={(e) => setFoodType(e.target.value)}
                                disabled={props.disableFields}
                                aria-label="Select event type">
                                <option value=''>Select food type</option>
                                {foodTypes.map(type =>
                                    <option key={type} value={type}>{type}</option>
                                )}
                            </Form.Select>
                        </FormGroup>
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