import React from 'react';
import classes from './Button.module.scss';

const Button = (props) => {
    return (
        <button
            className={["btn btn-success", classes.Btn, props.className].join(' ')}
            type="button"
            onClick={props.onClick}
            disabled={props.disabled}
        >
            <span>{props.children}</span>
        </button>
    )
}

export default Button;