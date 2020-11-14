import debug from 'debug';
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { createElement as h, forwardRef, Fragment, useState } from 'react';

const log = debug('rjsf:decorator:mui:array:item');

const useStyles = makeStyles(function (theme) {
    return {
        forms: {
            display: 'flex',
            flexDirection: 'column',
            flexGrow: '1',
            borderLeftWidth: '1px',
            borderLeftStyle: 'solid',
            borderLeftColor: theme.palette.divider,
            borderRightWidth: '1px',
            borderRightStyle: 'solid',
            borderRightColor: theme.palette.divider,
        },
        controls: {
            display: 'flex',
            flexDirection: 'column',
            padding: '0 0 -1px',
            '& button:not($destroy)': {
                borderRadius: '0',
                borderBottomWidth: '1px',
                borderBottomStyle: 'solid',
                borderBottomColor: theme.palette.divider,
                borderCollapse: 'collapse',
                width: theme.spacing(6),
                minWidth: theme.spacing(6),
            },
        },
        item: {
            display: 'flex',
            alignItems: 'stretch',
            paddingTop: 0,
            paddingBottom: 0,
            backgroundColor: theme.palette.background.paper,
        },
        icon: {
            padding: theme.spacing(1.5),
        },
        dragHandle: {
            padding: theme.spacing(1.5),
        },
        destroy: {
            marginTop: 'auto',
            borderRadius: '0',
            borderTopWidth: '1px',
            borderTopStyle: 'solid',
            borderTopColor: theme.palette.divider,
            borderCollapse: 'collapse',
            width: theme.spacing(6),
            minWidth: theme.spacing(6),
        },
    };
});
/**
 * @component
 */
export function ItemComponent(props, ref) {
    const classes = useStyles(props);
    const { index, disabled } = props;
    const { dragDropRef } = props;
    const { draggableProps, dragHandleProps } = props.otherProps;

    return h(
        ListItem,
        {
            divider: true,
            className: classes.item,
            ref,
            disableGutters: true,
            ...draggableProps,
        },
        [
            h(
                'div',
                {
                    ...dragHandleProps,
                    className: clsx(
                        dragHandleProps.className,
                        classes.dragHandle
                    ),
                },
                h(Icon, {}, 'drag_handle')
            ),
            h('div', { className: classes.forms }, props.children),
            h('div', { key: 'controls', className: classes.controls }, [
                h(
                    Button,
                    {
                        onClick: props.moveUp,
                        size: 'small',
                        disabled,
                    },
                    h(Icon, {}, 'keyboard_arrow_up')
                ),
                h(
                    Button,
                    {
                        onClick: props.moveDown,
                        size: 'small',
                        disabled,
                    },
                    h(Icon, {}, 'keyboard_arrow_down')
                ),
                h(
                    Button,
                    {
                        onClick: props.destroy,
                        className: classes.destroy,
                        color: 'secondary',
                        size: 'small',
                        disabled,
                    },
                    h(Icon, {}, 'delete_forever')
                ),
            ]),
        ]
    );
}

export default forwardRef(ItemComponent);
