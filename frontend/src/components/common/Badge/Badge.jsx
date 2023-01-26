import React from 'react';
import classes from './Badge.module.scss';

const Badge = (props) => {
    return <p className={classes.Badge}>
        <span>{props.children}</span>
    </p>
}

export default Badge;