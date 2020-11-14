import { createElement as h } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import clsx from 'clsx';

/**
 * @component
 */

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        transition: 'all 0.3s',
        flex: '0 1 0',
        overflow: 'hidden',
    },
    active: {
        flex: '1',
    },
}));
export default function Panel(props) {
    const { active } = props;
    const classes = useStyles(props);

    return h(Paper, {
        ...props,
        className: clsx(props.className, classes.root, {
            [classes.active]: active,
        }),
    });
}
