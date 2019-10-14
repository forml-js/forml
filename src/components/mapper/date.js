import {createElement as h} from 'react';

import Text from './text';

/**
 * @component Date
 */
export default function Date(props) {
    const {form} = props;
    return h(Text, {
        ...props,
        otherProps: {
            InputLabelProps: {shrink: true},
        },
        ...form.otherProps
    });
}
