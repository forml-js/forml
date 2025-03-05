import { useError, useSelect, useDecorator } from '@forml/hooks';
import {
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select as MuiSelect,
} from '@mui/material';
import ObjectPath from 'objectpath';
import React, { useCallback, useMemo, useRef } from 'react';

/**
 * @component
 */
export default function Select(props) {
    const { form } = props;
    const ref = useRef(null);
    const options = useDecorator('options');
    const select = useSelect(form);

    const value = select.indexOf(props.value);
    const variant = 'variant' in options ? options.variant : 'standard';
    const title = useMemo(
        () => ('titleFun' in form ? form.titleFun(value) : form.title),
        [form.title, form.titleFun, value]
    );
    const disabled = 'readonly' in form ? form.readonly : false;
    const error = useError(form.key);
    const helperText = error ? error : form.description;

    const onChange = useCallback(
        (event) => {
            const selectedIndex = event.target.value;
            const value = select.valueOf(selectedIndex);
            props.onChange(
                { ...event, target: { ...event.target, value } },
                value
            );
        },
        [props.onChange, select]
    );

    const menuItems = useMemo(
        function () {
            const menuItems = [];
            for (let i = 0; i < form.titleMap.length; i++) {
                const key = ObjectPath.stringify([...form.key, i]);
                const { name } = form.titleMap[i];
                menuItems.push(
                    <MenuItem key={key} value={i}>
                        {name}
                    </MenuItem>
                );
            }
            return menuItems;
        },
        [form.titleMap, form.key, value]
    );

    return (
        <FormControl error={!!error}>
            {title ? <InputLabel variant={variant}>{title}</InputLabel> : null}
            <MuiSelect
                inputRef={ref}
                error={!!error}
                label={title}
                value={value ?? ''}
                placeholder={form.placeholder}
                disabled={disabled}
                onChange={onChange}
                variant={variant}
            >
                {menuItems}
            </MuiSelect>
            {helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
        </FormControl>
    );
}
