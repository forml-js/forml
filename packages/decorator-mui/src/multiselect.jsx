import { useError, useLocalizer } from '@forml/hooks';
import {
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select as MuiSelect,
} from '@mui/material';
import React, { useCallback, useMemo, useRef } from 'react';
import ObjectPath from 'objectpath';

console.log('Select: %o, MenuItem: %o', MuiSelect, MenuItem);

/**
 * @component
 */
export default function Multiselect(props) {
    const { form } = props;
    const localize = useLocalizer();
    const ref = useRef(null);

    const disabled = 'readonly' in form ? form.readonly : false;
    const title = localize(form.title);
    const placeholder = localize(form.placeholder);
    const description = localize(form.description);
    const error = useError(form.key);
    console.log('Multiselect(error: %o)', error);
    const helperText = useMemo(() => (error ? error : description), [error]);
    const value = useMemo(() => {
        return props.value.map((value) => {
            return form.titleMap.findIndex(
                (titleMap) => titleMap.value === value
            );
        });
    }, [form.titleMap, props.value]);

    const onChange = useCallback(
        (event) => {
            const nextValue = event.target.value.map((selectedIndex) => {
                const titleMap = form.titleMap[selectedIndex];
                return titleMap.value;
            });
            props.onChange(
                { ...event, target: { ...event.target, value: nextValue } },
                nextValue
            );
        },
        [props.onChange, form.titleMap, value]
    );

    const options = useMemo(
        function () {
            const menuItems = [];
            for (let i = 0; i < form.titleMap.length; i++) {
                const key = ObjectPath.stringify([...form.key, i]);
                const { name } = form.titleMap[i];
                menuItems.push(
                    <MenuItem key={key} value={i}>
                        {localize(name)}
                    </MenuItem>
                );
            }
            return menuItems;
        },
        [form.titleMap, form.key, localize, value]
    );

    return (
        <FormControl variant="standard" error={!!error}>
            {title ? <InputLabel>{title}</InputLabel> : null}
            <MuiSelect
                inputRef={ref}
                error={!!error}
                value={value}
                placeholder={placeholder}
                disabled={disabled}
                onChange={onChange}
                multiple
            >
                {options}
            </MuiSelect>
            {helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
        </FormControl>
    );
}
