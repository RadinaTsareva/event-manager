/* eslint-disable react-hooks/exhaustive-deps */
import { useStoreState } from 'easy-peasy';
import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useLocation, useNavigate, useParams } from 'react-router';
import Spinner from '../../components/common/Spinner/Spinner';
import Button from '../../components/common/Button/Button';
import EditableForm from '../../components/EventForms/EditableForm';
import InitialForm from '../../components/EventForms/InitialForm';
import { toastHandler, TOAST_STATES } from '../../helpers/toast';
import EventsService from '../../services/eventsService';
import { convertEventStatus } from '../../utils/converter';
import { ROLES, STATUS } from '../../utils/enums';
import classes from './EventManagement.module.scss';
import ImageUpload from '../../components/ImageUpload/ImageUpload';

const EventManagement = (props) => {
    const { account } = useStoreState((state) => state.userStore);

    const [event, setEvent] = useState({});
    const [loading, setLoading] = useState(true);

    const urlParams = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (!!props.newEvent) {
            setEvent({})
            setLoading(false)
        } else {
            loadEventData()
        }
    }, [event?.id, location.state]);

    const loadEventData = async () => {
        const res = await EventsService.getById(urlParams.id)
        setEvent(res)
        setLoading(false)
    }

    const acceptClickedHandler = async () => {
        await EventsService.accept(event.id)
        toastHandler({ success: TOAST_STATES.SUCCESS, message: `${event.name} accepted` })
        navigate('/')
    }

    const rejectClickedHandler = async () => {
        await EventsService.reject(event.id)
        toastHandler({ success: TOAST_STATES.ERROR, message: `${event.name} rejected` })
        navigate('/')
    }
    if (loading || (event.id && !urlParams.id)) {
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
                        <InitialForm heading="Details" disableFields={true} event={event} />
                        {event.status === STATUS.EDITABLE ?
                            <EditableForm heading="Edit" event={event} />
                            : event.place && <EditableForm
                                heading={convertEventStatus(event.status)}
                                disableFields={true}
                                event={event} />
                        }
                    </Col>
                </Row>
                {
                    event.status === STATUS.EDITABLE &&
                    <div className={classes.ActionBtns}>
                        <Button className={classes.AcceptBtn} type='button' onClick={acceptClickedHandler}>Accept</Button>
                        <Button className={classes.RejectBtn} type='button' onClick={rejectClickedHandler}>Reject</Button>
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
                                    :
                                    <>
                                        <InitialForm heading='Edit needed' disableFields={true} event={event} />
                                        <EditableForm disableFields={true} event={event} />
                                    </>
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
                        <InitialForm heading={event.status === STATUS.EDITABLE ? 'Edit Pending' : event.status} disableFields={true} event={event} />
                        {event.place && <EditableForm disableFields={true} event={event} />}
                    </Col>
                }
            </Row>
            {
                event.status === STATUS.PENDING &&
                <div className={classes.ActionBtns}>
                    <Button className={classes.RejectBtn} type='button' onClick={rejectClickedHandler}>Reject</Button>
                </div>
            }
            {
                event.status === STATUS.ACCEPTED && account.role === ROLES.ORGANIZER &&
                <div className={classes.UploadForm}>
                    <h3>Upload images</h3>
                    <ImageUpload />
                </div>
            }
        </div >
    )
}

export default EventManagement;