import React, { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';

import classes from './Chat.module.scss';
import Select from '../../components/common/Select/Select';
import EventsService from '../../services/eventsService';
import Spinner from '../../components/common/Spinner/Spinner';
import Input from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';
import { Col, Form, Row } from 'react-bootstrap';
import ChatService from '../../services/chatService';
import { PersonFill } from 'react-bootstrap-icons';
import { useStoreState } from 'easy-peasy';
import { ROLES } from '../../utils/enums';

const Chat = (props) => {
    const { account } = useStoreState((state) => state.userStore);

    const [organizer, setOrganizer] = useState('');
    const [organizerId, setOrganizerId] = useState('');
    const [organizers, setOrganizers] = useState([]);
    const [chatsList, setChatsList] = useState([]);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    const messagesEndRef = useRef(null);

    useEffect(() => {
        loadData()
    }, []);

    useEffect(() => { }, [loading])

    const scrollToBottom = () => {
        setTimeout(() => messagesEndRef.current?.lastElementChild?.scrollIntoView({ inline: 'center', behavior: 'smooth' }), 100)
    }

    const loadData = async () => {
        if (account.role === ROLES.CLIENT) {
            const organizers = await EventsService.getOrganizers()
            setOrganizers(organizers)
        }

        const chatsList = await ChatService.getChatsList()
        setChatsList(chatsList)
        setLoading(false)
    }

    const loadMessages = async (id) => {
        flushSync(async () => {
            const messages = await ChatService.getMessages(id || organizerId)
            setMessages(messages)
        })
        scrollToBottom()
    }

    const sendMessageHandler = async () => {
        setInput('')
        await ChatService.sendMessage(organizerId, input)
        await loadMessages()
    }

    const organizerSelectedHandler = async (newValue) => {
        if (!newValue) {
            return
        }

        setLoading(true)
        const organizer = organizers.find(o => o.id === +newValue)
        await loadMessages(organizer.id)

        setOrganizer(organizer.value)
        setOrganizerId(organizer.id)
        setLoading(false)
    }

    const userClickedHandler = async (u) => {
        setOrganizer(u.value)
        setOrganizerId(u.id)

        await loadMessages(u.id)
    }

    if (loading) {
        return <Spinner />
    }

    return (
        <div className={classes.Container}>
            <div className={classes.Heading}>
                {
                    organizerId
                        ? <h1>Chat with {organizer}</h1>
                        : <h1>Chat</h1>
                }
                <p>Handle event data</p>
            </div>
            <hr />
            <Row>
                <Col md={3}>
                    {account.role === ROLES.CLIENT && <Select
                        controlId='formGroupOrganizer'
                        label='Organizer'
                        field={organizerId}
                        setField={organizerSelectedHandler}
                        options={organizers}
                    />}
                    <div className={classes.ChatsList}>
                        {chatsList.map((c, i) => {
                            return (
                                <div key={i} className={classes.User}>
                                    <p onClick={() => userClickedHandler(c)}><PersonFill /> {c.value}</p>
                                </div>
                            )
                        })}
                    </div>
                </Col>
                <Col>
                    {organizerId && <div className={classes.Chat}>
                        <div className={classes.Messages} ref={messagesEndRef}>
                            {messages.map((m, i) => {
                                return (
                                    <div key={i} className={classes.Message}>
                                        <span className={classes.From}>From {m.sender}</span>
                                        <p className={classes.Text}>{m.message}</p>
                                        <span className={classes.CreatedAt}>{new Date(m.createdAt).toLocaleString()}</span>
                                    </div>
                                )
                            })}
                        </div>
                        <div>
                            <Form>
                                <Input
                                    controlId='formGroupInput'
                                    type='text' placeholder='Type your message here...'
                                    field={input} setField={setInput} />
                                <Button onClick={sendMessageHandler}>Send</Button>
                            </Form>
                        </div>
                    </div>}
                </Col>
            </Row>
        </div>
    )
}

export default Chat;