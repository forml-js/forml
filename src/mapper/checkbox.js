import MuiCheckbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import {createElement as h} from 'react';

export function Checkbox(props) {
    const {schema, form, value, onChange} = props;
    return h(FormGroup, {row: true}, h(FormControlLabel, {
                 label: form.title,
                 control: h(MuiCheckbox, {
                     checked: value,
                     disabled: form.readonly,
                     onChange,
                 }),
             }));
}
