import clsx from 'clsx';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import React, { forwardRef } from 'react';
import { useLocalizer } from '../../../../context';

const useStyles = makeStyles(function (theme) {
    return {
        root: {
            margin: theme.spacing(1),
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
    const { label, form, otherProps } = props;
    const { error, description } = props;
    const { value, disabled } = props;

    const classes = useStyles(props);
    const color = error ? 'error' : 'initial';
    const localizer = useLocalizer();

    const disablePadding =
        'disablePadding' in form ? form.disablePadding : false;
    const disableGutters =
        'disableGutters' in form ? form.disableGutters : false;
    const icon = 'icon' in form ? form.icon : 'view_list';

    return (
        <Paper
            className={clsx(classes.root, {
                [classes.open]: open,
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
                        primary={label}
                        secondary={error || description}
                    />
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
                <ListItem key="controls" dense className={classes.controls}>
                    <Button
                        onClick={props.add}
                        color={color}
                        edge="end"
                        startIcon={<Icon>add</Icon>}
                        disabled={disabled}
                    >
                        {localizer.getLocalizedString('Add')} {label}
                    </Button>
                </ListItem>
            </List>
        </Paper>
    );
}
export default forwardRef(Items);
