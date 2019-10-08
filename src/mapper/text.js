import TextField from '@material-ui/core/TextField';
import {createElement as h} from 'react';

export function Text(props) {
    const {schema, value} = props;
    return h(TextField, {onChange, value});

    function onChange(e) {
        props.onChange(e, e.target.value);
    }
}
