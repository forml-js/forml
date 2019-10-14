import debug from 'debug';
import {createElement as h} from 'react';

import Text from './text';

const log = debug('rjsf:mapper:text');

/**
 * @component TextArea
 */
export default function TextArea(props) {
    const {form} = props;
    return h(Text, {
        ...props,
        otherProps: {
            multiline: true,
            rows: form.rows,
            rowMax: form.rowMax,
        }
    });
}
