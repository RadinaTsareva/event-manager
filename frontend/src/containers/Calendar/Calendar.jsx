import React, { useEffect, useRef, useState } from 'react';
import { DayPilotMonth } from "daypilot-pro-react";
import { useNavigate } from 'react-router';

import { ROLES, STATUS } from '../../utils/enums';
import classes from './Calendar.module.scss';
import { convertColorByStatus } from '../../utils/converter';

const Calendar = (props) => {
    const [data, setData] = useState({
        businessBeginsHour: new Date(Date.now()).getHours(),
        businessEndsHour: 24,
        weekStarts: 1,
        visible: true,
        startDate: new Date(Date.now()).toISOString(),
    });
    const [event, setEvent] = useState(null);
    const calendarRef = useRef(null);

    const navigate = useNavigate();

    useEffect(() => {
        loadEvents()
        props.monthChangedHandler(new Date(data.startDate).getMonth())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.startDate, props.events]);

    const loadEvents = () => {
        const res = props.events
        const events = res.map(e => {
            const color = convertColorByStatus(e.status)
            const start = new Date(e.start)
            const end = new Date(e.end)
            e.start = start
            e.end = end
            e.text = `${e.name}, ${e.organizerName}`
            e.backColor = 'white'
            e.fontColor = 'black'
            e.barColor = color
            e.moveDisabled = true
            return e
        })

        setData({ ...data, events })
    }

    const clickHandler = (e) => {
        setEvent(e.e.data)
    }

    const manageEventHandler = (e) => {
        console.log('e', e);
        navigate('/events/' + e.id)
    }

    const galleryHandler = (e) => {
        navigate('/events/gallery/' + e.id)
    }

    const eventActions = (e) => {
        if (props.accountRole && event.status !== STATUS.FINISHED) {
            return (<div>
                <p><span>Actions</span></p>
                <div className={classes.ActionBtns}>
                    <button className={classes.ManageBtn} onClick={() => manageEventHandler(e)}>Manage</button>
                </div>
            </div>)
        }

        return null
    }

    return (
        <div className={classes.Container}>
            <div className={classes.Selector}>
                <p>Select date</p>
                <input type='date'
                    className={classes.DateSelector}
                    onChange={(e) => {
                        setData({
                            ...data, startDate: new Date(e.target.value).toISOString()
                        })
                        setEvent(null)
                    }
                    } />
            </div>
            <div className={classes.Calendar}>
                <DayPilotMonth ref={calendarRef}
                    {...data}
                    onEventClick={clickHandler}
                />
            </div>
            {event ?
                <>
                    <div className={classes.Event}>
                        <div>
                            <p><span>Organizer</span></p>
                            <p>
                                <span>{event.organizerName}</span>
                            </p>
                        </div>
                        <div>
                            <p><span>Event</span></p>
                            <p>
                                <span>{event.name}</span>
                            </p>
                            <p>
                                Start: {new Date(event.start).toLocaleString()}
                            </p>
                            <p>
                                End: {new Date(event.end).toLocaleString()}
                            </p>
                        </div>
                        {eventActions(event)}
                        {props.accountRole !== ROLES.ORGANIZER
                            && <button className={classes.GalleryBtn} onClick={() => galleryHandler(event)}>Visit Gallery</button>}
                    </div>
                </>
                : null}
        </div >
    )
}

export default Calendar;