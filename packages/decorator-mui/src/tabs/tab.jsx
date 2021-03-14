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
    image: {
        objectFit: 'contain',
        maxWidth: theme.spacing(7),
        marginRight: theme.spacing(4),
    },
    vertical: {
        display: 'inline-flex',
        flex: '1 1 48px',
        width: 'auto',
        paddingBottom: theme.spacing(0.5),
        '&$active': {
            borderBottomWidth: theme.spacing(0.5),
            paddingBottom: theme.spacing(0.1),
        },
        '&:hover': {
            borderBottomWidth: theme.spacing(0.5),
            paddingBottom: theme.spacing(0.1),
        },
    },
    collapse: {
        '&$vertical': {
            maxWidth: theme.spacing(7),
            overflow: 'hidden',
            transition: 'all 0.3s',
            '&:hover,&$active': {
                maxWidth: '100%',
            }
        }
    },
    horizontal: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        paddingRight: theme.spacing(2),
        '&$active': {
            borderRightWidth: theme.spacing(0.5),
            paddingRight: theme.spacing(1.5),
        },
        '&:hover': {
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
    const collapse = 'collapse' in parent ? parent.collapse : false;

    const icon = 'icon' in form ? form.icon : 'dynamic_form';
    const image = 'image' in form ? form.image : null;

    let imageOrIcon = null;
    if (image) {
        imageOrIcon = (
            <img src={image} className={classes.image} />
        );
    } else if (icon) {
        imageOrIcon = (
            <ListItemIcon key="icon">
                <Icon>{icon}</Icon>
            </ListItemIcon>
        );
    }

    return (
        <ListItem
            onClick={activate}
            button
            divider
            className={clsx(classes.root, classes[layout], {
                [classes.active]: active,
                [classes.collapse]: collapse,
            })}
        >
            {imageOrIcon}
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
