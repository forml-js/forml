import React from 'react';
/**
 * @component
 */
export default function Tab(props) {
    const { form } = props;
    const { title } = form;
    return <button onClick={props.activate}>{title}</button>;
}
