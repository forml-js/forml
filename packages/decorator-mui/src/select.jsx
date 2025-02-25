import { useError, useLocalizer } from '@forml/hooks';
import {
    FormControl,
    InputLabel,
    MenuItem,
    Select as MuiSelect,
} from '@mui/material';
import React, { useCallback, useMemo, useRef } from 'react';
import ObjectPath from 'objectpath';

/**
 * @component
 */
export default function Select(props) {
    const { form } = props;
    const ref = useRef(null);

    const value = useMemo(() => {
        const index = form.titleMap.findIndex(
            (titleMap) => titleMap.value === props.value
        );
        if (index === -1) return '';
        return index;
    }, [form.titleMap, props.value]);
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
            <InputLabel variant="standard">{title}</InputLabel>
            <MuiSelect
                inputRef={ref}
                error={!!error}
                label={title}
                value={value ?? ''}
                placeholder={form.placeholder}
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
