import {KeyboardDatePicker} from '@material-ui/pickers';
import {createElement as h} from 'react';

export default function Date(props) {
    const {form, value} = props;

    const fullWidth     = 'fullWidth' in form ? form.fullWidth : true;
    const disablePast   = 'disablePast' in form ? form.disablePast : false;
    const disableFuture = 'disableFuture' in form ? form.disableFuture : false;
    const variant       = 'variant' in form ? form.variant : 'dialog';
    const autoOk        = 'autoOk' in form ? form.autoOk : true;
    const openTo        = 'openTo' in form ? form.openTo : 'date';
    const format        = 'format' in form ? form.format : 'YYYY/MM/DD'

    return h(KeyboardDatePicker, {
        value,
        onChange,
        fullWidth,
        disablePast,
        disableFuture,
        variant,
        autoOk,
        openTo,
        format,
    });

    function onChange(value) {
        value = value ? value.format(format) : value;
        if (props.onChange) {
            props.onChange({target: {value}});
        }
    }
}
