import React from 'react';
import { Form } from 'react-bootstrap';
import classes from './Input.module.scss';
import PropTypes from 'prop-types';

const Input = (props) => {
    const validate = (field, setField, fn) => {
        if (typeof field === 'object') {
            if (props.onBlur) {
                setField({ ...field, valid: fn(field.value) && props.onBlur() })
            } else {
                setField({ ...field, valid: fn(field.value) })
            }
        }
    }

    const changeField = (field, setField, newValue) => {
        if (typeof field === 'object') {
            setField({ ...field, value: newValue, valid: true })
        } else {
            setField(newValue)
        }
    }

    return (
        <Form.Group className={["mb-3", classes.Input].join(' ')} controlId={props.controlId}>
            {props.label && <Form.Label>{props.label}</Form.Label>}
            <Form.Control
                value={typeof props.field === 'object' ? props.field.value : props.field}
                onChange={(e) => changeField(props.field, props.setField, e.target.value)}
                onBlur={() => validate(props.field, props.setField, props.validateFn)}
                {...(props.type === 'textarea' ? { as: 'textarea', rows: 2 } : { type: props.type })}
                placeholder={props.placeholder}
                required={true}
                disabled={props.disabled}
            />
            {typeof props.field === 'object' && !props.field.valid ? <span>{props.field.message}</span> : null}
        </Form.Group>
    )
}

Input.propTypes = {
    controlId: PropTypes.string,
    label: PropTypes.string,
    type: PropTypes.string,
    placeholder: PropTypes.string,
    field: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    setField: PropTypes.func,
    validateFn: PropTypes.func,
    disabled: PropTypes.bool
};

export default Input;