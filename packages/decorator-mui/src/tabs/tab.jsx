import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flex: '0 0 0',
        transition: 'all 0.3s',
        borderBottomWidth: 0,
        borderBottomStyle: 'solid',
        borderBottomColor: theme.palette.primary.main,
        borderRightWidth: 0,
        borderRightStyle: 'solid',
        borderRightColor: theme.palette.primary.main,
    },
    vertical: {
        paddingBottom: theme.spacing(0.5),
        '&$active': {
            borderBottomWidth: theme.spacing(0.5),
            paddingBottom: theme.spacing(0.1),
        },
    },
    horizontal: {
        paddingRight: theme.spacing(2),
        '&$active': {
            borderRightWidth: theme.spacing(0.5),
            paddingRight: theme.spacing(1.5),
        },
    },
    active: {},
}));

/**
 * @component
 */
export default function Tab(props) {
    const { title, description } = props;
    const { activate, active } = props;
    const { form, parent } = props;

    const classes = useStyles(props);

    const layout = 'layout' in parent ? parent.layout : 'vertical';
    const icon = 'icon' in form ? form.icon : 'dynamic_form';

    return (
        <ListItem
            onClick={activate}
            button
            className={clsx(classes.root, classes[layout], {
                [classes.active]: active,
            })}
        >
            <ListItemIcon key="icon">
                <Icon fontSize="small">{icon}</Icon>
            </ListItemIcon>
            <ListItemText
                key="title"
                primary={title}
                primaryTypographyProps={{ noWrap: true }}
                secondary={description}
                secondaryTypographyProps={{ nowrap: true, variant: 'caption' }}
            />
        </ListItem>
    );
}
