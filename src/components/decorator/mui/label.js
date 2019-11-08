import InputLabel from '@material-ui/core/InputLabel';
import {createElement as h} from 'react';

/**
 * @component
 */
export default function Label(props) {
    const shrink = props.shrink === undefined ? !!props.value : props.shrink;
    return h(InputLabel, {...props, shrink});
}
