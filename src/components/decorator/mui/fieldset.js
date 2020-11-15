import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/FormLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { createElement as h } from 'react';
import clsx from 'clsx';

/**
 * @component
 */
const useStyles = makeStyles(function (theme) {
    return {
        paper: {
            flex: 1,
            flexDirection: 'inherit',
            margin: theme.spacing(1),
        },
        root: {
            padding: theme.spacing(1),
            flex: 1,
        },
        disableMargin: {
            margin: theme.spacing(0),
        },
        disableGutters: {
            paddingLeft: theme.spacing(0),
            paddingRight: theme.spacing(0),
        },
        disablePadding: {
            '&$vertical, &$horizontal': {
                marginTop: theme.spacing(0),
                marginBottom: theme.spacing(0),
                paddingTop: theme.spacing(0),
                paddingBottom: theme.spacing(0),
            },
            marginTop: theme.spacing(0),
            marginBottom: theme.spacing(0),
            paddingTop: theme.spacing(0),
            paddingBottom: theme.spacing(0),
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
            padding: theme.spacing(1.0),
        },
        vertical: {
            display: 'flex',
            flexDirection: 'column',
            padding: theme.spacing(1.0),
        },
        header: {
            display: 'flex',
            flexDirection: 'column',
            padding: theme.spacing(1.0, 2.0),
            borderBottom: '1px solid black',
            borderBottomColor: theme.palette.divider,
            marginBottom: theme.spacing(0.5),
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
    const fullWidth = 'fullWidth' in form ? form.fullWidth : false;
    const component = 'component' in form ? form.component : 'div';
    const elevation = 'elevation' in form ? form.elevation : 1;

    let content = h(
        FormGroup,
        {
            className: clsx(classes.root, {
                [classes.disableGutters]: true,
                [classes.disablePadding]: true,
            }),
            fullWidth,
            component,
        },
        [
            (title || description) &&
                h('div', { className: classes.header }, [
                    h(FormLabel, { key: 'label' }, title),
                    h(
                        FormHelperText,
                        { key: 'help', variant: 'caption' },
                        description
                    ),
                ]),
            h(
                component,
                {
                    className: clsx(classes[layout], {
                        [classes.disableGutters]: disableGutters,
                        [classes.disablePadding]: disablePadding,
                    }),
                },
                props.children
            ),
        ]
    );

    if (title || description) {
        content = h(
            Paper,
            {
                className: clsx(classes.paper, {
                    [classes.disableMargin]: disableMargin,
                }),
                elevation,
            },
            content
        );
    }

    return content;
}
