import React from 'react';
import { Form } from 'react-bootstrap';
import classes from './Select.module.scss';
import PropTypes from 'prop-types';

const Select = (props) => {
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
        <Form.Group className={["mb-3", classes.FormGroup].join(', ')} controlId={props.controlId}>
            {props.label && <Form.Label>{props.label}</Form.Label>}
            <Form.Select
                className={classes.SelectForm}
                value={typeof props.field === 'object' ? props.field.value : props.field}
                onChange={(e) => changeField(props.field, props.setField, e.target.value.toLowerCase())}
                onBlur={() => validate(props.field, props.setField, props.validateFn)}
                disabled={props.disabled}
                aria-label={["Select", typeof props.field === 'object' ? props.field.name : props.type].join(' ')}>
                <option value=''>Select {typeof props.field === 'object' ? props.field.name : props.type}</option>
                {Object.values(props.enum).map(type =>
                    <option key={type} value={type}>{type}</option>
                )}
            </Form.Select>
            {typeof props.field === 'object' && !props.field.valid ? <span>{props.field.message}</span> : null}
        </Form.Group>
    )
}

Select.propTypes = {
    controlId: PropTypes.string,
    label: PropTypes.string || undefined,
    field: PropTypes.string || PropTypes.object,
    setField: PropTypes.func,
    validateFn: PropTypes.func,
    enum: PropTypes.object,
    disabled: PropTypes.bool || undefined,
    type: PropTypes.string || undefined
};

export default Select;