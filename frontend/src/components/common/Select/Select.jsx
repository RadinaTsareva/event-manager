import React from 'react';
import { Form } from 'react-bootstrap';
import classes from './Select.module.scss';
import PropTypes from 'prop-types';

const Select = (props) => {
    const validate = (field, setField, fn) => {
        if (props.onBlur) {
            setField({ ...field, valid: fn(field.value) && props.onBlur() })
        } else {
            setField({ ...field, valid: fn(field.value) })
        }
    }

    const changeField = (field, setField, newValue) => {
        setField({ ...field, value: newValue, valid: true })
    }

    return (
        <Form.Group className={["mb-3", classes.FormGroup].join(', ')} controlId={props.controlId}>
            <Form.Label>{props.label}</Form.Label>
            <Form.Select
                className={classes.SelectForm}
                value={props.field.value}
                onChange={(e) => changeField(props.field, props.setField, e.target.value.toLowerCase())}
                onBlur={() => validate(props.field, props.setField, props.validateFn)}
                disabled={props.disabled}
                aria-label={["Select", props.field.name].join(' ')}>
                <option value=''>Select {props.field.name}</option>
                {Object.values(props.enum).map(type =>
                    <option key={type} value={type}>{type}</option>
                )}
            </Form.Select>
            {!props.field.valid ? <span>{props.field.message}</span> : null}
        </Form.Group>
    )
}

Select.propTypes = {
    controlId: PropTypes.string,
    label: PropTypes.string,
    field: PropTypes.any,
    setField: PropTypes.func,
    validateFn: PropTypes.func,
    enum: PropTypes.object,
    disabled: PropTypes.bool || undefined
};

export default Select;