import { createElement as h } from 'react';

/**
 * @component
 */
export default function Form(props) {
    const { form } = props;
    //const type = form.type;
    const value = props.value;
    const onChange = props.onChange;
    const disabled = props.disabled;
    return h('input', { type: 'text', value, onChange, disabled });
}
