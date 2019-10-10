import TextField from '@material-ui/core/TextField';
import {get} from 'lodash';
import {createElement as h} from 'react';
import {useLocalizer} from '../context';

export function Text(props) {
    const {schema, value, form, error} = props;
    const {otherProps}                 = props;
    const localize                     = useLocalizer();

    return h(TextField, {
        type: form.type,
        disabled: form.readonly,
        fullWidth: get(form, 'fullWidth', true),
        placeholder: localize.getLocalizedString(get(form, 'placeholder')),
        helperText:
            (error || form.description) && localize.getLocalizedString(error || form.description),
        error: !!error,
        label: localize.getLocalizedString(get(form, 'title')),
        value,
        onChange,
        ...otherProps,
        ...form.otherProps,
    });

    function onChange(e) {
        props.onChange(e, e.target.value);
    }
}

export function TextArea(props) {
    const {form} = props;
    return h(Text, {
        ...props,
        otherProps: {
            multiline: true,
            rows: form.rows,
            rowMax: form.rowMax,
        }
    });
}
