import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { createElement as h } from 'react';
import clsx from 'clsx';

/**
 * @component
 */
const useStyles = makeStyles(function(theme) {
    return {
        root: {
            padding: theme.spacing(1),
            flex: 1,
        },
        disableGutters: {
            paddingLeft: theme.spacing(0),
            paddingRight: theme.spacing(0),
        },
        disablePadding: {
            paddingTop: theme.spacing(0),
            paddingBottom: theme.spacing(0),
        },
        alignItems: (props) => {
            const { form } = props;
            const alignItems = 'alignItems' in form ? form.alignItems : 'flex-start';
            return { alignItems };
        },
        horizontal: { display: 'flex', flexDirection: 'row' },
        vertical: { display: 'flex', flexDirection: 'column' },
    };
});

export default function FieldSet(props) {
    const { title, description, form } = props;
    const classes = useStyles(props);

    const layout = 'layout' in form ? form.layout : 'vertical';
    const disableGutters = 'disableGutters' in form ? form.disableGutters : false;
    const disablePadding = 'disablePadding' in form ? form.disablePadding : false;
    const fullWidth = 'fullWidth' in form ? form.fullWidth : false;
    const component = 'component' in form ? form.component : 'fieldset';

    return h(FormControl, {
        className: clsx(classes.root, classes[layout], {
            [classes.disableGutters]: disableGutters,
            [classes.disablePadding]: disablePadding
        }),
        fullWidth,
        component
    }, [
        h(FormLabel, { key: 'label', component: 'legend' }, title),
        h(Typography, { key: 'help', variant: 'body1' }, description),
        props.children,
    ]);
}
