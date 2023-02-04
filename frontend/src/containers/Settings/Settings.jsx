/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { Form, Table } from 'react-bootstrap';
import classes from './Settings.module.scss';

import Input from '../../components/common/Input/Input';
import { validateConfirmPassword, validateOptions, validatePassword, validatePhoneNumber, validateText } from '../../utils/validation';
import Button from '../../components/common/Button/Button';
import Select from '../../components/common/Select/Select';
import { GENDER, ORGANIZER_EVENT_TYPES, ROLES } from '../../utils/enums';
import UserService from '../../services/userService';
import Spinner from '../../components/common/Spinner/Spinner';
import { toastHandler, TOAST_STATES } from '../../helpers/toast';
import { CloudPlus, PencilFill, TrashFill } from 'react-bootstrap-icons';

const defaultValues = {
    email: { name: 'email', value: "", valid: true, message: 'Invalid email' },
    password: { name: 'password', value: "", valid: true, message: 'Password must contain at least 1 upper case letter, 1 lower case letter and 1 number. It should be at least 8 characters!' },
    confirmPassword: { name: 'confirmPassword', value: "", valid: true, message: 'Passwords not matching' },
    name: { name: 'name', value: "", valid: true, message: 'Name should be at least 2 characters long' },
    description: { name: 'description', value: "", valid: true, message: 'Description should be at least 20 characters long' },
    address: { name: 'address', value: "", valid: true, message: 'Address should be at least 10 characters long' },
    phoneNumber: { name: 'phone', value: "", valid: true, message: 'Invalid phone number' },
    role: { name: 'role', value: "", valid: true, message: 'Not selected' },
    gender: { name: 'gender', value: "", valid: true, message: 'Not selected' }
}

const Settings = (props) => {
    const { account } = useStoreState((state) => state.userStore);
    const { setAccount } = useStoreActions((actions) => actions.userStore);

    const [nameField, setNameField] = useState();
    const [passwordField, setPasswordField] = useState();
    const [confirmPasswordField, setConfirmPasswordField] = useState();
    const [addressField, setAddressField] = useState();
    const [phoneNumberField, setPhoneNumberField] = useState();
    const [genderField, setGenderField] = useState();

    const [eventTypes, setEventTypes] = useState([]);
    const [expandEventForm, setExpandEventForm] = useState(false);
    const [newEventType, setNewEventType] = useState({});

    const [menuTypes, setMenuTypes] = useState([]);
    const [expandMenuForm, setExpandMenuForm] = useState(false);
    const [newMenuType, setNewMenuType] = useState({});
    const [menuEventType, setMenuEventType] = useState();

    const [cateringTypes, setCateringTypes] = useState([]);
    const [expandCateringForm, setExpandCateringForm] = useState(false);
    const [newCateringType, setNewCateringType] = useState({});
    const [cateringEventType, setCateringEventType] = useState();

    const [loading, setLoading] = useState(true);

    const infoSubmitHandler = async (data) => {
        if (data.name !== defaultValues.password.name && data.value === account[data.name]) {
            toastHandler({ success: TOAST_STATES.ERROR, message: 'No changes made' })
            return
        }

        await UserService.updateInfo({ [data.name]: data.value })
        setAccount({ ...account, [data.name]: data.value })

        toastHandler({ success: TOAST_STATES.SUCCESS, message: 'Changes saved' })
    }

    useEffect(() => {
        setData()
        loadEventTypes()
    }, []);

    const setData = () => {
        setNameField({ ...defaultValues.name, value: account.name })
        setAddressField({ ...defaultValues.address, value: account.address })
        setPhoneNumberField({ ...defaultValues.phoneNumber, value: account.phoneNumber })
        setGenderField({ ...defaultValues.gender, value: account.gender })
        setPasswordField({ ...defaultValues.password, value: account.password })
        setConfirmPasswordField({ ...defaultValues.confirmPassword, value: account.password })
        setLoading(false)
    }

    const loadEventTypes = async () => {
        const eventTypes = await UserService.getEventTypes()
        setEventTypes(eventTypes)

        if (!menuEventType && !cateringEventType) {
            setMenuTypes(await UserService.getMenuTypes(eventTypes[0].id))
            setMenuEventType({ value: eventTypes[0].id })

            setCateringTypes(await UserService.getCateringTypes(eventTypes[0].id))
            setCateringEventType({ value: eventTypes[0].id })
        }
    }

    const loadMenuTypes = async (data) => {
        const menuTypes = await UserService.getMenuTypes(data || menuEventType.value)
        setMenuTypes(menuTypes)
    }

    const loadCateringTypes = async (data) => {
        const cateringTypes = await UserService.getCateringTypes(data || cateringEventType.value)
        setCateringTypes(cateringTypes)
    }

    const enableEditHandler = (element, data) => {
        const updatedElements = [...data.arrayField]
        const found = updatedElements.find(el => el.value === element.value)
        found.edit = true

        data.setArrayField(updatedElements)
    }

    const deleteProductHandler = async (element, data) => {
        const updatedElements = [...data.arrayField]
        const found = updatedElements.find(el => el.id === element.id)
        const index = updatedElements.indexOf(found)
        updatedElements.splice(index, 1)
        data.setArrayField(updatedElements)

        await UserService.deleteType(element.id, data.type)

        toastHandler({ success: TOAST_STATES.SUCCESS, message: 'Type deleted successfully' })
    }

    const updateTypeHandler = async (element, data) => {
        const updatedElements = [...data.arrayField]
        const found = updatedElements.find(el => el.id === element.id)
        delete found.edit
        data.setArrayField(updatedElements)

        await UserService.updateType(data.type, { ...element })
    }

    const saveTypeHandler = async (data) => {
        if (Object.values(data.newType).every((el) => el !== '')) {
            await UserService.addNewType(data.type, { value: data.newType.value, eventTypeId: data.select?.field.value })
        } else {
            toastHandler({ success: TOAST_STATES.ERROR, message: 'Invalid new type data' })
        }

        data.setExpandForm(false)
        data.setNewType({})

        await data.loadData()
    }

    const selectEventTypeHandler = async (eventType, data) => {
        data.select.setField(eventType)
        await data.loadData(+eventType.value)
    }

    const fields = [
        {
            controlId: 'formGroupName', label: 'Change name', type: 'text', placeholder: 'Enter new name',
            field: nameField, setField: setNameField, validateFn: (text) => validateText(text, 1)
        },
        {
            controlId: 'formGroupPhoneNumber', label: 'Change phone number', type: 'text', placeholder: 'Enter new phone number',
            field: phoneNumberField, setField: setPhoneNumberField, validateFn: validatePhoneNumber
        },
        {
            controlId: 'formGroupAddress', label: 'Change address', type: 'text', placeholder: 'Enter new address',
            field: addressField, setField: setAddressField, validateFn: (text) => validateText(text, 9)
        },
    ]

    const types = [
        {
            heading: 'Event types', th: 'Type', arrayField: eventTypes, setArrayField: setEventTypes,
            expandForm: expandEventForm, setExpandForm: setExpandEventForm, newType: newEventType, setNewType: setNewEventType,
            loadData: loadEventTypes, type: ORGANIZER_EVENT_TYPES.EVENT
        },
        {
            heading: 'Menu types', th: 'Type', arrayField: menuTypes, setArrayField: setMenuTypes,
            expandForm: expandMenuForm, setExpandForm: setExpandMenuForm, newType: newMenuType, setNewType: setNewMenuType,
            loadData: loadMenuTypes, type: ORGANIZER_EVENT_TYPES.MENU,
            select: { controlId: 'formGroupType', label: 'Select type', field: menuEventType, setField: setMenuEventType, options: eventTypes, }
        },
        {
            heading: 'Catering types', th: 'Type', arrayField: cateringTypes, setArrayField: setCateringTypes,
            expandForm: expandCateringForm, setExpandForm: setExpandCateringForm, newType: newCateringType, setNewType: setNewCateringType,
            loadData: loadCateringTypes, type: ORGANIZER_EVENT_TYPES.CATERING,
            select: { controlId: 'formGroupType', label: 'Select type', field: cateringEventType, setField: setCateringEventType, options: eventTypes, }
        },
    ]

    if (loading) {
        return <Spinner />
    }

    return (
        <div className={classes.Container}>
            <div className={classes.Heading}>
                <h1>Settings</h1>
                <p>Manage your profile</p>
            </div>
            <hr />
            {fields.map(data =>
                <div className={classes.MiniForm} key={data.label}>
                    <Form>
                        <Form.Label>{data.label}</Form.Label>
                        <Input
                            controlId={data.controlId}
                            type={data.type} placeholder={data.placeholder}
                            field={data.field} setField={data.setField}
                            validateFn={data.validateFn} />
                        <Button disabled={!data.field.valid || data.field.value === ''} onClick={() => infoSubmitHandler(data.field)}>Submit</Button>
                    </Form>
                </div>
            )}
            <div className={classes.MiniForm}>
                <Form onSubmit={infoSubmitHandler}>
                    <Form.Label>Change gender</Form.Label>
                    <Select
                        controlId='formGroupGender'
                        field={genderField}
                        setField={setGenderField}
                        validateFn={validateOptions}
                        options={GENDER}
                    />
                    <Button disabled={!genderField.valid || genderField.value === ''} onClick={() => infoSubmitHandler(genderField)}>Submit</Button>
                </Form>
            </div>
            <div className={classes.MiniForm}>
                <Form onSubmit={infoSubmitHandler}>
                    <Form.Label>Change password</Form.Label>
                    <Input
                        controlId='formGroupPassword' label='New password'
                        type='password' placeholder='Enter new password'
                        field={passwordField} setField={setPasswordField}
                        validateFn={validatePassword} />
                    <Input
                        controlId='formGroupPassword' label='Confirm password'
                        type='password' placeholder='Confirm new password'
                        field={confirmPasswordField} setField={setConfirmPasswordField}
                        validateFn={validatePassword} onBlur={() => validateConfirmPassword(passwordField.value, confirmPasswordField.value)} />
                    <Button disabled={(!passwordField.valid || passwordField.value === "") && (!confirmPasswordField.valid || confirmPasswordField.value === "")} onClick={() => infoSubmitHandler(passwordField)}>Submit</Button>
                </Form>
            </div>
            {
                account.role === ROLES.ORGANIZER &&
                types.map(data =>
                    <div key={data.type}>
                        <hr />
                        <div>
                            <div className={classes.Category}>{data.heading}</div>
                            {data.select && <Select
                                controlId={data.select.controlId}
                                label={data.select.label}
                                field={data.select.field}
                                setField={(e) => selectEventTypeHandler(e, data)}
                                options={data.select.options}
                            />}
                            <div className={classes.Types}>
                                <Table hover responsive>
                                    <thead>
                                        <tr>
                                            <th>Delete</th>
                                            <th>{data.th}</th>
                                            <th>Edit</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.arrayField.map(type =>
                                            <tr className={classes.Type} key={type.id} onDoubleClick={() => enableEditHandler(type, data)}>
                                                <td><TrashFill onClick={() => deleteProductHandler(type, data)} /></td>
                                                <td><input disabled={!type.edit} defaultValue={type.value} onChange={(e) => type.value = e.target.value}></input></td>
                                                <td>{type.edit
                                                    ? <CloudPlus onClick={() => updateTypeHandler(type, data)} />
                                                    : <PencilFill onClick={() => enableEditHandler(type, data)} />}</td>
                                            </tr>
                                        )}
                                        {data.expandForm ?
                                            <tr className={classes.Type} >
                                                <td></td>
                                                <td><input onChange={(e) => data.setNewType({ ...data.newType, value: e.target.value })} placeholder='Type' /></td>
                                                <td><CloudPlus onClick={() => saveTypeHandler(data)} /></td>
                                            </tr>
                                            : null}
                                    </tbody>
                                </Table>
                                {data.expandForm ? null : <button className={[classes.ExpandFormBtn, classes.SaveBtn].join(' ')} onClick={() => data.setExpandForm(true)}>+</button>}
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    );
}

export default Settings;