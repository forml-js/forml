import { DatePicker } from '@mui/x-date-pickers';
import React, { useCallback, useMemo } from 'react';
import { usePickerUtils } from './date-utils.js';
import { useError, useDecorator } from '@forml/hooks';

export default function Date(props) {
    const { form, value } = props;
    const utils = usePickerUtils();
    const options = useDecorator('options');

    const fullWidth = 'fullWidth' in form ? form.fullWidth : true;
    const disablePast = 'disablePast' in form ? form.disablePast : false;
    const disableFuture = 'disableFuture' in form ? form.disableFuture : false;
    const pickerVariant = 'variant' in form ? form.variant : 'inline';
    const inputVariant = 'variant' in options ? options.variant : 'standard';
    const autoOk = 'autoOk' in form ? form.autoOk : true;
    const openTo =
        'openTo' in form
            ? form.openTo === 'date'
                ? 'day'
                : form.openTo
            : 'day';
    const format = 'format' in form ? form.format : undefined;
    const disabled = 'readonly' in form ? form.readonly : false;
    const otherProps = 'otherProps' in form ? form.otherProps : undefined;
    const error = useError(form.key);

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
        [value, props.onChange, format]
    );
    const slotProps = useMemo(
        () => ({
            textField: {
                variant: inputVariant,
                helperText: error ?? form.description,
                fullWidth: fullWidth,
            },
        }),
        [fullWidth, inputVariant, error, form.description]
    );

    return (
        <DatePicker
            value={utils.date(value)}
            label={form.title}
            helperText={form.error ?? form.description}
            error={!!error}
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
