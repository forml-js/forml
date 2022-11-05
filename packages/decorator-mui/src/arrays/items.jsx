import clsx from 'clsx';
import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import makeStyles from '@mui/styles/makeStyles';
import React, { forwardRef } from 'react';
import { useLocalizer } from '@forml/hooks';

const useStyles = makeStyles(function (theme) {
    return {
        root: {
            margin: theme.spacing?.(1),
            flex: '1 1 auto',
        },
        disablePadding: {
            marginTop: 0,
            marginBottom: 0,
        },
        disableGutters: {
            marginLeft: 0,
            marginRight: 0,
        },
        list: {
            display: 'flex',
            flexDirection: 'column',
            flex: '1 1 auto',
        },
        controls: {
            justifyContent: 'flex-end',
        },
    };
});

/**
 * @component
 */
function Items(props, ref) {
    const { title, form, otherProps } = props;
    const { error, description } = props;
    const { value, disabled } = props;

    const classes = useStyles(props);
    const color = error ? 'error' : 'info';
    const localizer = useLocalizer();

    const disablePadding =
        'disablePadding' in form ? form.disablePadding : false;
    const disableGutters =
        'disableGutters' in form ? form.disableGutters : false;
    const icon = 'icon' in form ? form.icon : 'view_list';
    const addText =
        'addText' in form
            ? localizer.getLocalizedString(form.addText)
            : title
            ? `${localizer.getLocalizedString('Add')} ${title}`
            : localizer.getLocalizedString('Add');

    return (
        <Paper
            className={clsx(classes.root, {
                [classes.disablePadding]: disablePadding,
                [classes.disableGutters]: disableGutters,
            })}
        >
            <List
                disablePadding
                dense
                ref={ref}
                {...otherProps}
                className={clsx(
                    otherProps && otherProps.className,
                    classes.list
                )}
            >
                <ListItem key="title" dense={false} divider>
                    {icon && (
                        <ListItemIcon key="icon" edge="start">
                            <Icon color={color}>{icon}</Icon>
                        </ListItemIcon>
                    )}
                    <ListItemText
                        key="text"
                        primaryTypographyProps={{ color, variant: 'subtitle2' }}
                        primary={title}
                        secondary={error || description}
                    />
                    <Button
                        onClick={props.add}
                        color={color}
                        edge="end"
                        startIcon={<Icon>add</Icon>}
                        disabled={disabled}
                    >
                        {addText}
                    </Button>
                </ListItem>
                {props.children}
                {value && value.length === 0 && (
                    <ListItem key="empty" divider>
                        <ListItemText
                            secondary="empty"
                            secondaryTypographyProps={{ align: 'center' }}
                        />
                    </ListItem>
                )}
            </List>
        </Paper>
    );
}
export default forwardRef(Items);
