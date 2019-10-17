import FormControl from '@material-ui/core/FormControl';
import {createElement as h} from 'react';

/**
 * @component
 */
export default function Group(props) {
    const fullWidth = true;
    return h(FormControl, {...props, fullWidth}, props.children);
}
