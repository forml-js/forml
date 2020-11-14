import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import { createElement as h } from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    content: {
        display: 'flex',
        flexDirection: 'row',
        overflow: 'hidden',
    },
}));

/**
 * @component
 */
export default function Container(props) {
    const { value } = props;
    const classes = useStyles(props);
    return h('div', {}, [
        h(
            AppBar,
            { key: 'tab-bar', position: 'static' },
            h(Tabs, { value }, props.tabs)
        ),
        h(
            'div',
            { key: 'tab-panel', className: classes.content },
            props.panels
        ),
    ]);
}
