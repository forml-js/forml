import MuiCheckbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import {createElement as h} from 'react';

/**
 * @component
 */
export default function Checkbox({title, description, error, checked, onChange}) {
    return h(FormGroup, {row: true}, [
        h(FormControlLabel, {label: title, control: h(MuiCheckbox, {checked, onChange})}),
        (error || description) && h(FormHelperText, {error}, (error || description)),
    ])
}
