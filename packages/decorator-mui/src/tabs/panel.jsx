import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import clsx from 'clsx';

/**
 * @component
 */

const useStyles = makeStyles(() => ({
    root: {
        position: 'absolute',
        display: 'flex',
        transition: 'all 0.3s',
        flex: '1 1 100%',
        height: '100%',
        zIndex: 1,
        '&$active': {
            position: 'relative',
            zIndex: 99,
        },
        '&$vertical': {
            transform: 'translateX(-100vw)',
            '$active ~ &': {
                transform: 'translateX(100vw)',
            },
            '&$active': {
                transform: 'translateX(0vw)',
            },
        },
        '&$horizontal': {
            transform: 'translateY(-100vh)',
            '$active ~ &': {
                transform: 'translateY(100vh)',
            },
            '&$active': {
                transform: 'translateY(0vh)',
            },
        },
    },
    active: {},
    horizontal: {},
    vertical: {},
}));
export default function Panel(props) {
    const { active, form, parent } = props;
    const classes = useStyles(props);

    const elevation = 'elevation' in form ? form.elevation : 0;
    const layout = 'layout' in parent ? parent.layout : 'horizontal';

    return (
        <Paper
            {...props}
            elevation={elevation}
            className={clsx(props.className, classes.root, classes[layout], {
                [classes.active]: active,
            })}
        />
    );
}
