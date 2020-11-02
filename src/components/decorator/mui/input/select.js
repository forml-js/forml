import MuiSelect from '@material-ui/core/Select';
import { createElement as h } from 'react';

/**
 * @component
 */
export default function Select({
    error,
    onChange,
    value,
    placeholder,
    disabled,
    form,
    children,
    multiple,
    ...props
}) {
    const selectProps = {
        error: !!error,
        onChange,
        value,
        placeholder,
        disabled,
        multiple,
    };
    return h(MuiSelect, selectProps, children);
}
