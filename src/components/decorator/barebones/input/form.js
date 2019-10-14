import {createElement as h} from 'react';

export default function form(props) {
    const {form}   = props;
    const type     = form.type;
    const value    = props.value;
    const onChange = props.onChange;
    return h('input', {type, value, onChange})
}

