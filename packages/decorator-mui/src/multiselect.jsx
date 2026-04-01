import { useError, useDecorator, useSelect } from '@forml/hooks';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import ObjectPath from 'objectpath';
import React, { useCallback, useMemo, useRef } from 'react';

/**
 * @component
 */
export default function Multiselect(props) {
    const { form } = props;
    const ref = useRef(null);
    const options = useDecorator('options');
    const select = useSelect(form);

    const variant = 'variant' in options ? options.variant : 'standard';
    const disabled = 'readonly' in form ? form.readonly : false;
    const title = 'titleFun' in form ? form.titleFun(props.value) : form.title;
    const placeholder = 'placeholder' in form ? form.placeholder : null;
    const description = 'description' in form ? form.description : null;
    const error = useError(form.key);
    const helperText = error ? error : description;
    const value = select.indexOf(props.value);
    const safeValue = Array.isArray(value) ? value : [];

    const onChange = useCallback(
        (event) => {
            const nextValue = event.target.value.map((selectedIndex) => {
                return select.valueOf(selectedIndex);
            });
            props.onChange(
                { ...event, target: { ...event.target, value: nextValue } },
                nextValue
            );
        },
        [props.onChange, form.titleMap, value]
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
        <FormControl variant={variant} error={!!error}>
            {title ? <InputLabel variant={variant}>{title}</InputLabel> : null}
            <Select
                inputRef={ref}
                error={!!error}
                value={safeValue}
                placeholder={placeholder}
                disabled={disabled}
                onChange={onChange}
                multiple
            >
                {menuItems}
            </Select>
            {helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
        </FormControl>
    );
}
