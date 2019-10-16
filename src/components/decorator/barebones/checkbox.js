import {createElement as h} from 'react';
import * as Input from './input';

/**
 * @component
 */
export default function Checkbox({title, description, error, checked, onChange}) {
    return h('div', {}, [
        h('label',
          {},
          [
              h('input', {type: 'checkbox', checked, onChange}),
              title,
          ]),
        (error || description) && h(Input.Description, {}, error || description),
    ]);
}

