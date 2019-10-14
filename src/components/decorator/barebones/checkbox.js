import {createElement as h} from 'react';

export default function checkbox({title, description, error, checked, form, onChange}) {
    return h('div', {}, [
        h('label',
          {},
          [
              h('input', {type: 'checkbox', checked, onChange}),
              title,
          ]),
        (error || description) && h(input.description, {}, error || description),
    ]);
}

