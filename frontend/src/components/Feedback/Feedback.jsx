import React, { useEffect, useState } from 'react';
import { Modal, Form } from 'react-bootstrap';
import { PersonFillSlash, StarFill } from 'react-bootstrap-icons';
import classes from './Feedback.module.scss';
import { toastHandler, TOAST_STATES } from '../../helpers/toast';
import UserService from '../../services/userService';
import Button from '../common/Button/Button';
import Input from '../common/Input/Input';
import EventsService from '../../services/eventsService';

const FeedbackModal = (props) => {
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [show, setShow] = useState(true);

    useEffect(() => {

    }, [props.account?.blacklisted.length]);

    const blacklistUserHandler = async () => {
        await UserService.blacklistUser(props.event.organizerId);
    }

    const submitClickedHandler = async (event) => {
        await EventsService.sendFeedback(props.event.id, rating, feedback);

        setShow(false);
        if (event.target.checkValidity()) {
            toastHandler({ success: TOAST_STATES.SUCCESS, message: 'Feedback submitted successfully' })
        }
    }

    if (!props.showModal || !props.account) {
        return null
    };

    return (
        <Modal show={show} className={classes.Modal} centered>
            <Modal.Header>
                <Modal.Title>Feedback</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <h3>Organizer: {props.event.organizerName} {!props.account.blacklisted.includes(props.event.organizerId) && <PersonFillSlash onClick={blacklistUserHandler} />}</h3>
                    <Form.Group>
                        <Form.Label>Rate</Form.Label>
                        <div className="d-flex align-items-center">
                            {[1, 2, 3, 4, 5].map((value) => (
                                <StarFill
                                    key={value}
                                    size={20}
                                    onClick={() => setRating(value)}
                                    className={`ml-1 cursor-pointer ${value <= rating ? 'text-warning' : 'text-muted'}`}
                                />
                            ))}
                        </div>
                    </Form.Group>
                    <Form.Group>
                        <Input
                            controlId='formGroupFeedback'
                            label='Feedback'
                            type='textarea' placeholder='Enter your opinion'
                            field={feedback} setField={setFeedback}
                            validateFn={() => { }} />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button disabled={feedback === '' || rating === 0} onClick={submitClickedHandler}>Submit</Button>
            </Modal.Footer >
        </Modal >
    );
}

export default FeedbackModal;
