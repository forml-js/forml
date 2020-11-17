import { createElement as h } from 'react';

/**
 * @component
 */
export default function Group(props) {
    const { form } = props;
    return <div className={form.htmlClass}>{props.children}</div>;
}
