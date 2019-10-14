import {createElement as h} from 'react';
import * as Input from './input';

export default function Checkbox({title, description, error, checked, form, onChange}) {
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

