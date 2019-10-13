import {createElement as h} from 'react';

import {Text} from './text';

export function Date(props) {
    const {form} = props;
    return h(Text, {
        ...props,
        otherProps: {
            InputLabelProps: {shrink: true},
        },
        ...form.otherProps
    });
}
