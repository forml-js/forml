import { DateTimePicker } from '@mui/x-date-pickers';
import React, { useCallback, useMemo } from 'react';
import { useDecorator } from '@forml/hooks';
import { usePickerUtils } from './date-utils.js';

export default function DateTime(props) {
    const { value, form } = props;
    const options = useDecorator('options');
    const utils = usePickerUtils();

    const fullWidth = 'fullWidth' in form ? form.fullWidth : true;
    const disablePast = 'disablePast' in form ? form.disablePast : false;
    const disableFuture = 'disableFuture' in form ? form.disableFuture : false;
    const pickerVariant = 'variant' in form ? form.variant : 'dialog';
    const inputVariant = 'variant' in options ? options.variant : 'standard';
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
                variant: inputVariant,
                fullWidth: fullWidth,
            },
        }),
        [fullWidth, inputVariant]
    );

    return (
        <DateTimePicker
            value={utils.date(value)}
            onChange={onChange}
            disablePast={disablePast}
            disableFuture={disableFuture}
            slotProps={slotProps}
            variant={pickerVariant}
            autoOk={autoOk}
            openTo={openTo}
            format={format}
            disabled={disabled}
            disableMaskedInput
            {...otherProps}
        />
    );
}
