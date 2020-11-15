import clsx from 'clsx';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { createElement as h, forwardRef } from 'react';

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

    const disablePadding =
        'disablePadding' in form ? form.disablePadding : false;
    const disableGutters =
        'disableGutters' in form ? form.disableGutters : false;
    const icon = 'icon' in form ? form.icon : 'view_list';

    return h(
        Paper,
        {
            className: clsx(classes.root, {
                [classes.open]: open,
                [classes.disablePadding]: disablePadding,
                [classes.disableGutters]: disableGutters,
            }),
        },
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
                        icon &&
                            h(
                                ListItemIcon,
                                { key: 'icon', edge: 'start' },
                                h(Icon, { color }, icon)
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
