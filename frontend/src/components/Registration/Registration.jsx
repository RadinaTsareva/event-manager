import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import classes from './Registration.module.scss';
import Button from '../common/Button/Button';
import Input from '../common/Input/Input';
import Select from '../common/Select/Select';
import { toastHandler, TOAST_STATES } from '../../helpers/toast';
import { validateConfirmPassword, validateEmail, validateOptions, validatePassword, validatePhoneNumber, validateText } from '../../utils/validation';
import { useStoreActions } from 'easy-peasy';
import { GENDER, ROLES } from '../../utils/enums';

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

const Registration = (props) => {
    const { registerUser } = useStoreActions(actions => actions.userStore);

    const [emailField, setEmailField] = useState(defaultValues.email);
    const [nameField, setNameField] = useState(defaultValues.name);
    const [passwordField, setPasswordField] = useState(defaultValues.password);
    const [confirmPasswordField, setConfirmPasswordField] = useState(defaultValues.confirmPassword);
    const [addressField, setAddressField] = useState(defaultValues.address);
    const [phoneNumberField, setPhoneNumberField] = useState(defaultValues.phoneNumber);
    const [roleField, setRoleField] = useState(defaultValues.role);
    const [genderField, setGenderField] = useState(defaultValues.gender);

    const clearForm = () => {
        setEmailField(defaultValues.email)
        setNameField(defaultValues.name)
        setPasswordField(defaultValues.password)
        setConfirmPasswordField(defaultValues.confirmPassword)
        setAddressField(defaultValues.address)
        setPhoneNumberField(defaultValues.phoneNumber)
        setRoleField(defaultValues.role)
        setGenderField(defaultValues.gender)
    }

    const registerUserClickedHandler = () => {
        let valid = true;
        for (const data of fields.slice(0, 5)) {
            if (!data.field.valid || data.field.value === "") {
                valid = false
            }
        }

        if (valid && (!confirmPasswordField.valid || confirmPasswordField.value === "")) {
            valid = false
        }

        if (valid && (!genderField.valid || genderField.value === "") && (!roleField.valid || roleField.value === "")) {
            valid = false
        }

        const data = {}
        fields.slice(0, 5).forEach(el => {
            data[el.field.name] = el.field.value
        })

        if (valid) {
            registerUser(data)
            clearForm()
        } else {
            toastHandler({ success: TOAST_STATES.ERROR, message: 'Invalid form fields' })
        }
    }

    const fields = [
        {
            controlId: 'formGroupName', label: 'Name', type: 'text', placeholder: 'Enter name',
            field: nameField, setField: setNameField, validateFn: (text) => validateText(text, 1)
        },
        {
            controlId: 'formGroupPhoneNumber', label: 'Phone number', type: 'text', placeholder: 'Enter phone number',
            field: phoneNumberField, setField: setPhoneNumberField, validateFn: validatePhoneNumber
        },
        {
            controlId: 'formGroupEmail', label: 'Email', type: 'email', placeholder: 'Enter email',
            field: emailField, setField: setEmailField, validateFn: validateEmail
        },
        {
            controlId: 'formGroupAddress', label: 'Address', type: 'text', placeholder: 'Enter address',
            field: addressField, setField: setAddressField, validateFn: (text) => validateText(text, 9)
        },
        {
            controlId: 'formGroupPassword', label: 'Password', type: 'password', placeholder: 'Enter password',
            field: passwordField, setField: setPasswordField, validateFn: validatePassword
        },
    ]

    return (
        <div className={classes.Register}>
            <Form>
                <Select
                    controlId='formGroupRole'
                    label='Role'
                    field={roleField}
                    setField={setRoleField}
                    validateFn={validateOptions}
                    options={ROLES}
                />
                {fields.slice(0, 5).map(data =>
                    <Input key={data.label}
                        controlId={data.controlId} label={data.label}
                        type={data.type} placeholder={data.placeholder}
                        field={data.field} setField={data.setField}
                        validateFn={data.validateFn} />
                )}
                <Input
                    controlId='formGroupPassword' label='Confirm password'
                    type='password' placeholder='Enter password'
                    field={confirmPasswordField} setField={setConfirmPasswordField}
                    validateFn={validatePassword} onBlur={() => validateConfirmPassword(passwordField.value, confirmPasswordField.value)} />
                <Select
                    controlId='formGroupGender'
                    label='Gender'
                    field={genderField}
                    setField={setGenderField}
                    validateFn={validateOptions}
                    options={GENDER}
                />
                <Button onClick={registerUserClickedHandler}>Register</Button>
            </Form>
        </div >
    )
}

export default Registration;