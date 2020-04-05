import FormControl from '@material-ui/core/FormControl';
import {createElement as h} from 'react';

/**
 * @component
 */
export default function Group({error, ...props}) {
    error = !!error;
    props = {error, ...props};

    const fullWidth = true;
    return h(FormControl, {...props, fullWidth}, props.children);
}
