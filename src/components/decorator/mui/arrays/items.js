import clsx from 'clsx';
import Collapse from '@material-ui/core/Collapse';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Divider from '@material-ui/core/Divider';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { createElement as h, forwardRef, useState } from 'react';

const useStyles = makeStyles(function (theme) {
    return {
        root: {},
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
    const { label, otherProps } = props;
    const { error, description } = props;
    const { value, disabled } = props;

    const classes = useStyles();
    const color = error ? 'error' : 'initial';

    return h(
        Paper,
        { className: clsx(classes.root, { [classes.open]: open }) },
        h(
            List,
            {
                disablePadding: true,
                dense: true,
                ref,
                ...otherProps,
                className: clsx(
                    otherProps && otherProps.className,
                    classes.list
                ),
            },
            [
                h(
                    ListItem,
                    {
                        key: 'title',
                        dense: false,
                        divider: true,
                    },
                    [
                        h(
                            ListItemIcon,
                            { key: 'icon', edge: 'start' },
                            h(Icon, { color }, 'view_list')
                        ),
                        h(ListItemText, {
                            key: 'text',
                            primaryTypographyProps: {
                                color,
                                variant: 'subtitle2',
                            },
                            primary: label,
                            secondary: error || description,
                            secondaryTypographyProps: {
                                color,
                                variant: 'caption',
                            },
                        }),
                    ]
                ),
                ...props.children,
                value &&
                    value.length === 0 &&
                    h(
                        ListItem,
                        { divider: true },
                        h(ListItemText, {
                            secondary: 'empty',
                            secondaryTypographyProps: { align: 'center' },
                        })
                    ),
                h(
                    ListItem,
                    {
                        key: 'controls',
                        dense: true,
                        className: classes.controls,
                    },
                    h(
                        Button,
                        {
                            onClick: props.add,
                            color,
                            edge: 'end',
                            startIcon: h(Icon, {}, 'add'),
                            disabled,
                        },
                        `Add ${label}`
                    )
                ),
            ]
        )
    );
}
export default forwardRef(Items);
