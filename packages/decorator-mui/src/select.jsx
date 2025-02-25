import { useError, useLocalizer } from '@forml/hooks';
import {
    FormControl,
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
export default function Select(props) {
    const { form } = props;
    const localize = useLocalizer();
    const ref = useRef(null);

    const disabled = 'readonly' in form ? form.readonly : false;
    const title = localize(form.title);
    const placeholder = localize(form.placeholder);
    const description = localize(form.description);
    const error = useError(form.key);
    const helperText = useMemo(() => (error ? error : description), [error]);
    const value = useMemo(() => {
        return form.titleMap.findIndex(
            (titleMap) => titleMap.value === props.value
        );
    }, [form.titleMap, props.value]);

    const onChange = useCallback(
        (event) => {
            const selectedIndex = event.target.value;
            const titleMap = form.titleMap[selectedIndex];
            const value = titleMap.value;
            props.onChange(
                { ...event, target: { ...event.target, value } },
                value
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
        <FormControl error={!!error}>
            <InputLabel variant="standard">{title}</InputLabel>
            <MuiSelect
                inputRef={ref}
                error={!!error}
                label={title}
                value={value ?? ''}
                placeholder={placeholder}
                helperText={helperText}
                disabled={disabled}
                onChange={onChange}
                variant="standard"
            >
                {options}
            </MuiSelect>
        </FormControl>
    );
}
