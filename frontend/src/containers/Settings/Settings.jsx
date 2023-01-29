import React, { useEffect, useState } from 'react';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { Form } from 'react-bootstrap';
import classes from './Settings.module.scss';

import Input from '../../components/common/Input/Input';
import { validateAddress, validateConfirmPassword, validateEnum, validateName, validatePassword, validatePhoneNumber } from '../../utils/validation';
import Button from '../../components/common/Button/Button';
import Select from '../../components/common/Select/Select';
import { GENDER, ROLES } from '../../utils/enums';
import UserService from '../../services/userService';
import Spinner from '../../components/common/Spinner/Spinner';
import { toastHandler, TOAST_STATES } from '../../helpers/toast';

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
        loadData()
    }, []);

    const loadData = () => {
        setNameField({ ...defaultValues.name, value: account.name })
        setAddressField({ ...defaultValues.address, value: account.address })
        setPhoneNumberField({ ...defaultValues.phoneNumber, value: account.phoneNumber })
        setGenderField({ ...defaultValues.gender, value: account.gender })
        setPasswordField({ ...defaultValues.password, value: account.password })
        setConfirmPasswordField({ ...defaultValues.confirmPassword, value: account.password })
        setLoading(false)
    }

    const fields = [
        {
            controlId: 'formGroupName', label: 'Change name', type: 'text', placeholder: 'Enter new name',
            field: nameField, setField: setNameField, validateFn: validateName
        },
        {
            controlId: 'formGroupPhoneNumber', label: 'Change phone number', type: 'text', placeholder: 'Enter new phone number',
            field: phoneNumberField, setField: setPhoneNumberField, validateFn: validatePhoneNumber
        },
        {
            controlId: 'formGroupAddress', label: 'Change address', type: 'text', placeholder: 'Enter new address',
            field: addressField, setField: setAddressField, validateFn: validateAddress
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
                        validateFn={validateEnum}
                        enum={GENDER}
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
                    <Button disabled={!passwordField.valid || passwordField.value === "" && (!confirmPasswordField.valid || confirmPasswordField.value === "")} onClick={() => infoSubmitHandler(passwordField)}>Submit</Button>
                </Form>
            </div>
            {
                account.role === ROLES.ORGANIZER &&
                <>
                    {/* TODO add organizer settings */}
                    TODO
                </>
            }
        </div>
    );
}

export default Settings;