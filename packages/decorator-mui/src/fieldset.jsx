import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Paper from '@mui/material/Paper';
import Icon from '@mui/material/Icon';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';
import clsx from 'clsx';

/**
 * @component
 */
const useStyles = makeStyles(function (theme) {
    return {
        paper: {
            flex: 1,
            flexDirection: 'inherit',
            margin: theme.spacing?.(1),
        },
        root: {
            padding: theme.spacing?.(1),
            minWidth: '0',
            flex: 1,
        },
        disableMargin: {
            margin: theme.spacing?.(0),
        },
        disableGutters: {
            '&$vertical, &$horizontal': {
                paddingLeft: theme.spacing?.(0),
                paddingRight: theme.spacing?.(0),
            },
            paddingLeft: theme.spacing?.(0),
            paddingRight: theme.spacing?.(0),
        },
        disablePadding: {
            '&$vertical, &$horizontal': {
                marginTop: theme.spacing?.(0),
                marginBottom: theme.spacing?.(0),
                paddingTop: theme.spacing?.(0),
                paddingBottom: theme.spacing?.(0),
            },
            marginTop: theme.spacing?.(0),
            marginBottom: theme.spacing?.(0),
            paddingTop: theme.spacing?.(0),
            paddingBottom: theme.spacing?.(0),
        },
        alignItems: (props) => {
            const { form } = props;
            const alignItems =
                'alignItems' in form ? form.alignItems : 'flex-start';
            return { alignItems };
        },
        horizontal: {
            display: 'flex',
            flexDirection: 'row',
            padding: theme.spacing?.(1.0),
            maxWidth: 'fill-available',
        },
        vertical: {
            display: 'flex',
            flexDirection: 'column',
            padding: theme.spacing?.(1.0),
            maxWidth: 'fill-available',
        },
        title: {
            display: 'flex',
            flexDirection: 'column',
        },
        formLabel: {},
        formHelperText: {
            color: theme.palette?.text?.primary,
        },
        icon: {
            display: 'inline-flex',
            minWidth: theme.spacing?.(6),
            color: theme.palette?.action?.active,
        },
        header: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: theme.spacing?.(1.0, 2.0),
            borderBottom: '1px solid black',
            borderBottomColor: theme.palette?.divider,
            marginBottom: theme.spacing?.(0.5),
        },
    };
});

export default function FieldSet(props) {
    const { title, description, form } = props;
    const classes = useStyles(props);

    const layout = 'layout' in form ? form.layout : 'vertical';
    const disableGutters =
        'disableGutters' in form ? form.disableGutters : false;
    const disablePadding =
        'disablePadding' in form ? form.disablePadding : false;
    const disableMargin = 'disableMargin' in form ? form.disableMargin : false;
    const Component = 'component' in form ? form.component : 'div';
    const elevation = 'elevation' in form ? form.elevation : 1;
    const icon = 'icon' in form ? form.icon : null;

    let content = (
        <FormGroup
            className={clsx(classes.root, {
                [classes.disableGutters]: true,
                [classes.disablePadding]: true,
            })}
            component={Component}
        >
            {(title || description) && (
                <div className={classes.header}>
                    {icon && (
                        <Icon key="icon" className={classes.icon}>
                            {icon}
                        </Icon>
                    )}
                    <div key="title" className={classes.title}>
                        <FormLabel key="label" className={classes.formLabel}>
                            <Typography variant="subtitle2">{title}</Typography>
                        </FormLabel>
                        <FormHelperText
                            key="help"
                            variant="caption"
                            className={classes.formHelperText}
                        >
                            {description}
                        </FormHelperText>
                    </div>
                </div>
            )}
            <Component
                className={clsx(classes[layout], {
                    [classes.disableGutters]: disableGutters,
                    [classes.disablePadding]: disablePadding,
                })}
            >
                {props.children}
            </Component>
        </FormGroup>
    );

    if (title || description) {
        content = (
            <Paper
                className={clsx(classes.paper, {
                    [classes.disableMargin]: disableMargin,
                })}
                elevation={elevation}
            >
                {content}
            </Paper>
        );
    }

    return content;
}
