import React from 'react';
import PropTypes from 'prop-types';

import classes from './Card.module.scss';
import Select from '../common/Select/Select';
import { validateOptions } from '../../utils/validation';

const Card = (props) => (
    <div className={classes.Card} style={{ backgroundColor: props.theme }}>
        <div className={classes.Heading}>
            {props.icon}
            <p>{props.heading}</p>
        </div>
        <div className={classes.Select}>
            <Select
                controlId='formGroupField'
                type={props.type}
                field={props.field}
                setField={props.setField}
                validateFn={validateOptions}
                options={props.options}
            />
        </div>
        <div className={classes.Body}>
            <p>{props.caption}</p>
        </div>
    </div >
)

Card.propTypes = {
    theme: PropTypes.string || undefined,
    heading: PropTypes.string,
    caption: PropTypes.string,
    field: PropTypes.string,
    setField: PropTypes.func,
    options: PropTypes.object,
    icon: PropTypes.element,
    type: PropTypes.string,
}

export default Card;