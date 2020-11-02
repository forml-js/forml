import Input from '@material-ui/core/Input';
import { createElement as h } from 'react';

import Date from './date';
import DateTime from './datetime';
import File from './file';

/**
 * @component
 */
export default function Form({ error, ...props }) {
    props = { error: !!error, ...props };

    if (props.type === 'file') {
        return h(File, props);
    }

    if (props.type === 'date') {
        return h(Date, props);
    }

    if (props.type === 'datetime-local') {
        return h(DateTime, props);
    }

    return h(Input, props);
}
