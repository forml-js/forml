import React from 'react';
/**
 * @component
 */
export default function Panel(props) {
    if (!props.active) return null;

    const { active, children } = props;
    return <div active={active}>{children}</div>;
}
