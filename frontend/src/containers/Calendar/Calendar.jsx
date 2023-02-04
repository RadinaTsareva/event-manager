import React, { useEffect, useRef, useState } from 'react';
import { DayPilot, DayPilotMonth } from "daypilot-pro-react";
import { useNavigate } from 'react-router';

import { STATUS } from '../../utils/enums';
import classes from './Calendar.module.scss';
import { convertColorByStatus } from '../../utils/converter';

const Calendar = (props) => {
    const [data, setData] = useState({
        businessBeginsHour: new Date(Date.now()).getHours(),
        businessEndsHour: 24,
        weekStarts: 1,
        visible: true,
        startDate: new Date(Date.now()).toISOString(),
        ...(props.preview ? { cellHeight: 50 } : {}),
        eventClickHandling: props.preview ? 'Disabled' : 'Enabled',
        cellHeaderClickHandling: props.preview ? 'Disabled' : 'Enabled',
        allowMultiSelect: false,
    });
    const [event, setEvent] = useState(null);
    const calendarRef = useRef(null);

    const navigate = useNavigate();

    useEffect(() => {
        loadEvents()
        const date = new Date(data.startDate)
        props.dateChangedHandler({ month: date.getMonth(), year: date.getFullYear() })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.startDate, props.events]);

    const loadEvents = () => {
        const events = props.events.map(e => {
            const color = convertColorByStatus(e.status)
            const start = new Date(e.start)
            const end = new Date(e.end)
            e.start = start
            e.end = end
            e.text = props.preview ? 'Event' : `${e.name}, ${e.organizerName}`
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
        navigate('/events/' + e.id)
    }

    const galleryHandler = (e) => {
        navigate('/events/gallery/' + e.id)
    }

    const eventActions = (e) => {
        if (props.account?.role && event.status !== STATUS.FINISHED) {
            return (<div>
                <p><span>Actions</span></p>
                <div className={classes.ActionBtns}>
                    <button className={classes.ManageBtn} onClick={() => manageEventHandler(e)}>Manage</button>
                </div>
            </div>)
        }

        return null
    }

    const beforeRender = (args) => {
        if (props.preview) {
            const disabled = props.events.find(item => DayPilot.Util.overlaps(args.cell.start, args.cell.end, new DayPilot.Date(item.start), new DayPilot.Date(item.end)));
            if (disabled) {
                args.cell.properties.disabled = true;
                args.cell.properties.backColor = convertColorByStatus(STATUS.REJECTED);
            }

            const disabledOld = args.cell.start < DayPilot.Date.today().addDays(1);
            if (disabledOld) {
                args.cell.properties.disabled = true;
                args.cell.properties.backColor = convertColorByStatus(STATUS.REJECTED);
            }
        }
    }

    return (
        <div className={[classes.Container, props.className].join(' ')}>
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
                    onBeforeCellRender={beforeRender}
                    onTimeRangeSelected={props.timeRangeHandler}
                    onEventClick={clickHandler}
                />
            </div>
            {event && !props.preview ?
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
                        {event.status === STATUS.FINISHED && (event.isPublic || props.account.email === event.organizerEmail || props.account.email === event.clientEmail)
                            && <button className={classes.GalleryBtn} onClick={() => galleryHandler(event)}>Visit Gallery</button>}
                    </div>
                </>
                : null}
        </div >
    )
}

export default Calendar;