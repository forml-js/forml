import Input from '@material-ui/core/Input';
import React from 'react';

import Date from './date';
import DateTime from './datetime';
import File from './file';

/**
 * @component
 */
export default function Form({ error, ...props }) {
    props = { error: !!error, ...props };

    if (props.type === 'file') {
        return <File {...props} />;
    }

    if (props.type === 'date') {
        return <Date {...props} />;
    }

    if (props.type === 'datetime-local') {
        return <DateTime {...props} />;
    }

    return <Input {...props} />;
}
