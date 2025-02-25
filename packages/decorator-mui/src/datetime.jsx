import { DateTimePicker } from '@mui/x-date-pickers';
import React, { useCallback, useMemo } from 'react';
import { usePickerUtils } from './date-utils.js';

export default function DateTime(props) {
    const { value, form } = props;
    const utils = usePickerUtils();

    const fullWidth = 'fullWidth' in form ? form.fullWidth : true;
    const disablePast = 'disablePast' in form ? form.disablePast : false;
    const disableFuture = 'disableFuture' in form ? form.disableFuture : false;
    const variant = 'variant' in form ? form.variant : 'dialog';
    const autoOk = 'autoOk' in form ? form.autoOk : true;
    const openTo = 'openTo' in form ? form.openTo : 'hours';
    const format = 'format' in form ? form.format : undefined;
    const disabled = 'readonly' in form ? form.readonly : false;
    const otherProps = 'otherProps' in form ? form.otherProps : {};

    const onChange = useCallback(
        function onChange(value) {
            value = value
                ? format
                    ? value.format
                        ? value.format(format)
                        : value.toFormat
                          ? value.toFormat(format)
                          : value.toLocaleString()
                    : value.toLocaleString()
                : value;
            if (props.onChange) {
                props.onChange({ target: { value } }, value);
            }
        },
        [value, props.onChange]
    );
    const slotProps = useMemo(
        () => ({
            textField: {
                variant: 'standard',
                fullWidth: fullWidth,
            },
        }),
        [fullWidth]
    );

    return (
        <DateTimePicker
            value={utils.date(value)}
            onChange={onChange}
            disablePast={disablePast}
            disableFuture={disableFuture}
            slotProps={slotProps}
            variant={variant}
            autoOk={autoOk}
            openTo={openTo}
            format={format}
            disabled={disabled}
            disableMaskedInput
            {...otherProps}
        />
    );
}
