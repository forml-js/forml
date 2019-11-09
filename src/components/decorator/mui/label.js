import InputLabel from '@material-ui/core/InputLabel';
import {createElement as h} from 'react';

/**
 * @component
 */
export default function Label(props) {
    const shrink = !!props.value;
    return h(InputLabel, {shrink, ...props});
}
