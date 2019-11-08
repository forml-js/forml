import Input from '@material-ui/core/Input';
import {createElement as h} from 'react';
import File from './file';

/**
 * @component
 */
export default function Form(props) {
    if (props.type === 'file') {
        return h(File, props);
    }

    return h(Input, props);
}
