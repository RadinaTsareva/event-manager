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
                aria-label={["Select", props.field?.name || props.type].join(' ')}>
                <option value=''>Select {props.field?.name || props.type}</option>
                {
                    Array.isArray(props.enum)
                        ? typeof props.enum[0] === 'object'
                            ? props.enum.map(type =>
                                <option key={type.id} value={type.id}>{type.value}</option>
                            ) : props.enum.map(type =>
                                <option key={type} value={type.toLowerCase()}>{type}</option>
                            ) : Object.values(props.enum).map(type =>
                                <option key={type} value={type.toLowerCase()}>{type}</option>
                            )
                }
            </Form.Select>
            {typeof props.field === 'object' && !props.field.valid ? <span>{props.field.message}</span> : null}
        </Form.Group>
    )
}

Select.propTypes = {
    controlId: PropTypes.string,
    label: PropTypes.string,
    field: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    setField: PropTypes.func,
    validateFn: PropTypes.func,
    // enum: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    enum: PropTypes.any,
    disabled: PropTypes.bool,
    type: PropTypes.string
};

export default Select;