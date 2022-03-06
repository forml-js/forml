import DatePicker from '@mui/lab/DatePicker';
import Input from '@mui/material/Input';
import React from 'react';

export default function Date(props) {
    const { form, value } = props;

    const fullWidth = 'fullWidth' in form ? form.fullWidth : true;
    const disablePast = 'disablePast' in form ? form.disablePast : false;
    const disableFuture = 'disableFuture' in form ? form.disableFuture : false;
    const variant = 'variant' in form ? form.variant : 'inline';
    const autoOk = 'autoOk' in form ? form.autoOk : true;
    const openTo = 'openTo' in form ? form.openTo : 'date';
    const format = 'format' in form ? form.format : undefined;
    const disabled = 'readonly' in form ? form.readonly : false;
    const otherProps = 'otherProps' in form ? form.otherProps : {};

    return (
        <DatePicker
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
            {...otherProps}
        />
    );

    function onChange(value) {
        value = value ? value.format(format) : value;
        if (props.onChange) {
            props.onChange({ target: { value } });
        }
    }
}
