import { useStoreState } from 'easy-peasy';
import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useParams } from 'react-router';
import Spinner from '../../components/common/Spinner/Spinner';
import EditableForm from '../../components/EventForms/EditableForm';
import InitialForm from '../../components/EventForms/InitialForm';
import { toastHandler, TOAST_STATES } from '../../helpers/toast';
import EventsService from '../../services/eventsService';
import { ROLES, STATUS } from '../../utils/enums';
import classes from './EventManagement.module.scss';

const EventManagement = (props) => {
    const { account } = useStoreState((state) => state.userStore);

    const [event, setEvent] = useState({});
    const [loading, setLoading] = useState(true);

    const urlParams = useParams()

    useEffect(() => {
        if (!!props.newEvent) {
            setLoading(false)
        } else {
            loadEventData()
        }
    }, [event]);

    const loadEventData = async () => {
        const res = await EventsService.getById(urlParams.id)
        setEvent(res)
        setLoading(false)
    }

    const acceptClickedHandler = async () => {
        await EventsService.accept(event.id)
        toastHandler({ success: TOAST_STATES.SUCCESS, message: `${event.name} accepted` })
    }

    const rejectClickedHandler = async () => {
        await EventsService.reject(event.id)
        toastHandler({ success: TOAST_STATES.ERROR, message: `${event.name} rejected` })
    }

    if (loading) {
        return <Spinner />
    }

    if (account.role === ROLES.CLIENT) {
        if (!!props.newEvent) {
            return (
                <div className={classes.Container}>
                    <div className={classes.Heading}>
                        <h1>Request a new event</h1>
                    </div>
                    <hr />
                    <Row>
                        <Col className={classes.Form}>
                            <InitialForm heading='Details' />
                        </Col>
                    </Row>
                    {
                        event.status === STATUS.EDITABLE &&
                        <div className={classes.ActionBtns}>
                            <button className={classes.AcceptBtn} type='button' onClick={acceptClickedHandler}>Accept</button>
                            <button className={classes.RejectBtn} type='button' onClick={rejectClickedHandler}>Reject</button>
                        </div>
                    }
                </div>
            )
        }

        return (
            <div className={classes.Container}>
                <div className={classes.Heading}>
                    <h1>Manage {event.name}</h1>
                    <p>Handle event data</p>
                </div>
                <hr />
                <Row>
                    <Col className={classes.Form}>
                        {event.status === STATUS.EDITABLE ?
                            <EditableForm heading="Edit" event={event} />
                            : <EditableForm
                                heading={event.status}
                                disableFields={true}
                                event={event} />
                        }
                    </Col>
                </Row>
                {
                    event.status === STATUS.EDITABLE &&
                    <div className={classes.ActionBtns}>
                        <button className={classes.AcceptBtn} type='button' onClick={acceptClickedHandler}>Accept</button>
                        <button className={classes.RejectBtn} type='button' onClick={rejectClickedHandler}>Reject</button>
                    </div>
                }
            </div>
        )
    }

    return (
        <div className={classes.Container}>
            <div className={classes.Heading}>
                <h1>Manage {event.name}</h1>
                <p>Handle event data</p>
            </div>
            <hr />
            <Row>
                {(event.status === STATUS.PENDING || event.status === STATUS.EDIT_PENDING)
                    && <>
                        <Col className={classes.Form}>
                            {
                                event.status === STATUS.PENDING
                                    ? <InitialForm heading='Requested' disableFields={true} event={event} />
                                    : <EditableForm heading='Edit needed' disableFields={true} event={event} />
                            }
                        </Col>
                        <Col className={['vr', classes.VerticalLine].join(' ')} xs={1}></Col>
                        <Col className={classes.Form}>
                            <EditableForm heading='Your response' event={event} />
                        </Col>
                    </>
                }
                {(event.status === STATUS.ACCEPTED || event.status === STATUS.REJECTED || event.status === STATUS.EDITABLE)
                    && <Col className={classes.Form}>
                        <EditableForm heading={event.status === STATUS.EDITABLE ? 'Edit Pending' : event.status} disableFields={true} event={event} />
                    </Col>
                }
            </Row>
            {
                event.status === STATUS.PENDING &&
                <div className={classes.ActionBtns}>
                    <button className={classes.AcceptBtn} type='button' onClick={acceptClickedHandler}>Accept</button>
                    <button className={classes.RejectBtn} type='button' onClick={rejectClickedHandler}>Reject</button>
                </div>
            }
        </div >
    )
}

export default EventManagement;