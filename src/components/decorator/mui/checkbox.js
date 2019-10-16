import * as MUI from '@material-ui/core';
import {createElement as h} from 'react';

/**
 * @component
 */
export default function Checkbox({title, description, error, checked, onChange}) {
    return h(MUI.FormGroup, {row: true}, [
        h(MUI.FormControlLabel, {label: title, control: h(MUI.Checkbox, {checked, onChange})}),
        (error || description) && h(MUI.FormHelperText, {error}, (error || description)),
    ])
}
