/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import { Carousel, Form } from 'react-bootstrap';
import { Eye, EyeSlash, PersonFillSlash } from 'react-bootstrap-icons';

import classes from './Gallery.module.scss';
import Spinner from '../../components/common/Spinner/Spinner';
import EventsService from '../../services/eventsService';
import { useParams } from 'react-router';
import { useStoreState } from 'easy-peasy';
import Input from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';
import Feedback from '../../components/Feedback/Feedback';
import UserService from '../../services/userService';
import { STATUS } from '../../utils/enums';
import { toastHandler, TOAST_STATES } from '../../helpers/toast';

const defaultValues = {
    comment: { name: 'comment', value: "", valid: false, message: '' },
}

const Gallery = (props) => {
    const { account } = useStoreState((state) => state.userStore);

    const [event, setEvent] = useState({});
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [index, setIndex] = useState(0);
    const [commentField, setCommentField] = useState(defaultValues.comment);
    const [comments, setComments] = useState([]);

    const messagesEndRef = useRef(null);
    const urlParams = useParams()

    useEffect(() => {
        loadData();
    }, [loading, account?.blacklisted.length]);


    const scrollToBottom = () => {
        setTimeout(() => messagesEndRef.current?.lastElementChild?.scrollIntoView({ inline: 'center', behavior: 'smooth' }), 100)
    }

    const loadData = async () => {
        const resEvent = await EventsService.getById(urlParams.id);
        setEvent(resEvent);

        const resPics = await EventsService.getPics(urlParams.id);
        setImages(resPics);

        if (resEvent.isPublic) {
            const resComments = await EventsService.getCommentsByEventId(urlParams.id);
            setComments(resComments);
            scrollToBottom();
        }

        setLoading(false);
    }

    const selectHandler = (selectedIndex, e) => {
        setIndex(selectedIndex);
    };

    const eventPublicHandler = async (isPublic) => {
        await EventsService.update(urlParams.id, { isPublic });
        await loadData()
        toastHandler({ success: TOAST_STATES.SUCCESS, message: `Event set to ${isPublic ? 'public' : 'private'}` })
    }

    const commentClickedHandler = async () => {
        await EventsService.comment(event.id, commentField.value);
        setCommentField(defaultValues.comment)
        scrollToBottom();
    }

    const blockClickedHandler = async (userId) => {
        await UserService.blacklistUser(userId);
        toastHandler({ success: TOAST_STATES.SUCCESS, message: 'User blocked successfully' })
    }

    const getVisibility = () => {
        if (account?.email === event.clientEmail) {
            if (event.isPublic) {
                return <span>
                    <EyeSlash className={classes.Hidden} onClick={() => eventPublicHandler(false)} />
                </span>
            }
            return <span>
                <Eye className={classes.Visible} onClick={() => eventPublicHandler(true)} />
            </span>
        }
        return null
    }

    if (loading) {
        return <Spinner />
    }

    return (
        <>
            <Feedback
                showModal={account
                    && (event.clientEmail === account.email
                        || event.organizerEmail === account.email)
                    && event.status === STATUS.FINISHED
                    && !event.hasFeedback}
                account={account}
                event={event} />
            <div className={classes.Container}>
                <div className={classes.Heading}>
                    <h1>
                        Gallery for {event.name}
                        {getVisibility()}
                    </h1>
                </div>
                <div className={classes.Carousel}>
                    <Carousel slide={false} activeIndex={index} onSelect={selectHandler}>
                        {images.map((image, index) =>
                            <Carousel.Item key={index}>
                                <img
                                    className="d-block"
                                    src={image}
                                    alt={`Slide ${index + 1}`}
                                />
                            </Carousel.Item>
                        )}
                    </Carousel>
                </div>
                <div className={classes.Event}>
                    <h3>Event details</h3>
                    <div className={classes.EventInfo}>
                        <p><span>Location:</span> {event.place}</p>
                        <p><span>Organizer:</span> {event.organizerName}</p>
                        <p><span>Start:</span> {new Date(event.start).toLocaleString()}</p>
                        <p><span>End:</span> {new Date(event.end).toLocaleString()}</p>
                    </div>
                </div>
                {
                    event.isPublic
                        ? <div className={classes.CommentSection}>
                            <h3>Comments</h3>
                            <div className={classes.Comments} ref={messagesEndRef}>
                                {
                                    comments.map((comment, index) =>
                                        <div key={index} className={classes.Comment}>
                                            <p>{comment.userName} {
                                                account && !account?.blacklisted.includes(comment.userId) ?
                                                    <PersonFillSlash onClick={() => blockClickedHandler(comment.userId)} />
                                                    : null
                                            }</p>
                                            <p>{comment.content}</p>
                                        </div>
                                    )
                                }
                            </div>
                            {account
                                ? <Form className={classes.SubmitComment}>
                                    <Input
                                        controlId='formGroupComment'
                                        type='textarea' placeholder='Enter Comment'
                                        field={commentField} setField={setCommentField}
                                        validateFn={() => commentField.value !== ''} />
                                    <Button disabled={!commentField.valid} onClick={commentClickedHandler}>Send</Button>
                                </Form>
                                : null
                            }
                        </div>
                        : null
                }
            </div>
        </>
    )
}

export default Gallery;