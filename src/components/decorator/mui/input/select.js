import MuiSelect from '@material-ui/core/Select';
import {createElement as h} from 'react';

/**
 * @component
 */
export default function Select({error, ...props}) {
    error = !!error;
    props = {error, ...props};
    return h(MuiSelect, props);
}
