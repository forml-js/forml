import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { createElement as h } from 'react';

/**
 * @component
 */
const useStyles = makeStyles(function (theme) {
    return {
        root: { margin: theme.spacing(0, 0, 1, 0), padding: theme.spacing(1) },
    };
});
export default function FieldSet(props) {
    const { title } = props;
    const classes = useStyles();
    return h(
        Paper,
        { className: classes.root },
        h(FormControl, { fullWidth: true, component: 'fieldset' }, [
            h(FormLabel, { key: 'label', component: 'legend' }, title),
            props.children,
        ])
    );
}
