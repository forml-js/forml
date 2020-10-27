import { createElement as h } from 'react';
import * as Input from './input';

/**
 * @component
 */
export default function Checkbox({ title, description, error, checked, onChange }) {
    return h('div', {}, [
        h('label',
            { key: 'label' },
            [
                h('input', { key: 'input', type: 'checkbox', checked, onChange }),
                title,
            ]),
        (error || description) && h(Input.Description, { key: 'description' }, error || description),
    ]);
}

