import { KeyboardDateTimePicker } from '@material-ui/pickers';
import Input from '@material-ui/core/Input';
import React from 'react';

export default function DateTime(props) {
    const { value, form } = props;

    const fullWidth = 'fullWidth' in form ? form.fullWidth : true;
    const disablePast = 'disablePast' in form ? form.disablePast : false;
    const disableFuture = 'disableFuture' in form ? form.disableFuture : false;
    const variant = 'variant' in form ? form.variant : 'dialog';
    const autoOk = 'autoOk' in form ? form.autoOk : true;
    const openTo = 'openTo' in form ? form.openTo : 'hours';
    const format = 'format' in form ? form.format : 'YYYY/MM/DD HH:mm';
    const disabled = 'readonly' in form ? form.readonly : false;

    return (
        <KeyboardDateTimePicker
            value={value}
            onChange={onChange}
            fullWidth={fullWidth}
            disablePast={disablePast}
            disableFuture={disableFuture}
            variant={variant}
            autoOk={autoOk}
            openTo={openTo}
            format={format}
            TextFieldComponent={({ InputProps, ...props }) => (
                <Input {...props} {...InputProps} />
            )}
            disabled={disabled}
        />
    );

    function onChange(value) {
        value = value ? value.toISOString() : value;
        if (props.onChange) {
            props.onChange({ target: { value } });
        }
    }
}
