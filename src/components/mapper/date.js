import t from 'prop-types';
import {createElement as h} from 'react';

import {FormType} from '../../types';

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

Date.propTypes = {
    form: FormType,
    schema: t.object,
    error: t.string,
    value: t.string
};
