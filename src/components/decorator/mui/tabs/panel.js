import { createElement as h } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Slide from '@material-ui/core/Slide';
import clsx from 'clsx';

/**
 * @component
 */

const useStyles = makeStyles((theme) => ({
    root: {
        position: 'absolute',
        display: 'flex',
        transition: 'all 0.3s',
        flex: '1 1 100%',
        height: '100%',
        zIndex: '0',
        '&$active': {
            position: 'relative',
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

    let direction = null;
    if (layout == 'horizontal') {
        direction = 'left';
    } else {
        direction = 'up';
    }

    return h(Paper, {
        ...props,
        elevation,
        className: clsx(props.className, classes.root, classes[layout], {
            [classes.active]: active,
        }),
    });
}
