import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Icon from '@material-ui/core/Icon';
import { createElement as h } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        '&$horizontal': {
            flexDirection: 'row',
        },
        '&$vertical': {
            flexDirection: 'column',
        },
    },
    content: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
    },
    panels: {
        display: 'flex',
        flex: 1,
        overflow: 'hidden',
        position: 'relative',
    },
    tabs: {
        display: 'flex',
        flex: 0,
        zIndex: 10,
        alignItems: 'flex-start',
        '&$vertical': {
            flexDirection: 'row',
            borderBottom: '1px solid black',
            borderBottomColor: theme.palette.divider,
        },
        '&$horizontal': {
            flexDirection: 'column',
            borderRight: '1px solid black',
            borderRightColor: theme.palette.divider,
        },
    },
    vertical: {},
    horizontal: {},
    title: {
        flex: '0 0 0',
        '$vertical &': {
            borderRight: '1px solid black',
            borderRightColor: theme.palette.divider,
        },
    },
}));

/**
 * @component
 */
export default function Container(props) {
    const { title, description, form } = props;
    const classes = useStyles(props);

    const layout = 'layout' in form ? form.layout : 'vertical';

    return h(Paper, { className: clsx(classes.root, classes[layout]) }, [
        h(
            List,
            {
                className: clsx(classes.tabs, classes[layout]),
                dense: true,
                disablePadding: true,
            },
            [
                title &&
                    h(
                        ListItem,
                        {
                            key: 'tab-bar',
                            className: classes.title,
                            divider: layout === 'horizontal',
                            disableGutters: layout === 'vertical',
                        },
                        [
                            h(
                                ListItemIcon,
                                { key: 'icon' },
                                h(Icon, { fonSize: 'small' }, 'view_carousel')
                            ),
                            h(ListItemText, {
                                key: 'title',
                                primaryTypographyProps: {
                                    variant: 'subtitle2',
                                    color: 'textPrimary',
                                    noWrap: true,
                                },
                                primary: title,
                                secondaryTypographyProps: {
                                    variant: 'caption',
                                    noWrap: true,
                                },
                                secondary: description,
                            }),
                        ]
                    ),
                props.tabs,
            ]
        ),
        h('div', { key: 'tab-panel', className: classes.panels }, props.panels),
    ]);
}
