import {KeyboardDateTimePicker} from '@material-ui/pickers';
import {createElement as h} from 'react';

function labelFunc(date, invalid) {
    return date.toLocaleString();
}

export default function DateTime(props) {
    const {value, form} = props;

    const fullWidth     = 'fullWidth' in form ? form.fullWidth : true;
    const disablePast   = 'disablePast' in form ? form.disablePast : false;
    const disableFuture = 'disableFuture' in form ? form.disableFuture : false;
    const variant       = 'variant' in form ? form.variant : 'dialog';
    const autoOk        = 'autoOk' in form ? form.autoOk : true;
    const openTo        = 'openTo' in form ? form.openTo : 'hours';
    const format        = 'format' in form ? form.format : 'YYYY/MM/DD HH:mm'

    return h(KeyboardDateTimePicker, {
        value,
        onChange,
        fullWidth,
        disablePast,
        disableFuture,
        variant,
        autoOk,
        openTo,
        format,
    })

    function onChange(value) {
        value = value ? value.toISOString() : value;
        if (props.onChange) {
            props.onChange({target: {value}});
        }
    }
}
