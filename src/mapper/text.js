import TextField from '@material-ui/core/TextField';
import {get} from 'lodash';
import {createElement as h} from 'react';

export function Text(props) {
    const {schema, value, form} = props;

    const fullWidth   = get(form, 'fullWidth', true);
    const placeholder = get(form, 'placeholder', '');
    const label       = get(form, 'title', get(form, 'key', ''));

    return h(TextField, {value, onChange, fullWidth, label, placeholder});

    function onChange(e) {
        props.onChange(e, e.target.value);
    }
}
