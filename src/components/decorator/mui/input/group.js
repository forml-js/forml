import FormControl from '@material-ui/core/FormControl';
import { createElement as h } from 'react';

/**
 * @component
 */
export default function Group({ error, ...props }) {
    return h(FormControl, { error: !!error }, props.children);
}
