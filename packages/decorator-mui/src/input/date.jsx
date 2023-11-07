import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Input from '@mui/material/Input';
import React, { useCallback, useMemo } from 'react';

export default function Date(props) {
    const { form, value } = props;

    const settings = useMemo(
        () => ({
            fullWidth: 'fullWidth' in form ? form.fullWidth : true,
            disablePast: 'disablePast' in form ? form.disablePast : false,
            disableFuture: 'disableFuture' in form ? form.disableFuture : false,
            variant: 'variant' in form ? form.variant : 'inline',
            autoOk: 'autoOk' in form ? form.autoOk : true,
            openTo: 'openTo' in form ? form.openTo : 'date',
            format: 'format' in form ? form.format : undefined,
            disabled: 'readonly' in form ? form.readonly : false,
        }),
        [form]
    );
    const otherProps = useMemo(
        () => ('otherProps' in form ? form.otherProps : {}),
        [form]
    );
    const renderInput = useCallback(
        ({ InputProps, ...props }) => <Input {...props} {...InputProps} />,
        []
    );
    const onChange = useCallback(
        function onChange(value) {
            value = value ? value.format(settings.format) : value;
            if (props.onChange) {
                props.onChange({ target: { value } });
            }
        },
        [value, props.onChange, settings.format]
    );

    return (
        <DatePicker
            value={value}
            onChange={onChange}
            renderInput={renderInput}
            {...settings}
            {...otherProps}
        />
    );
}
