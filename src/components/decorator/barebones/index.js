import {createElement as h} from 'react';

import * as arrays from './arrays';
import * as input  from './input';
import * as tabs   from './tabs';

export {arrays, input, tabs};

export const fieldset = 'fieldset';
export const label    = 'label';
export const text     = 'p';

export function checkbox({title, description, error, checked, form, onChange}) {
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

export function group(props) {
    return h('div', props);
}
