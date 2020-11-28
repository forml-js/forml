import React from 'react';
/**
 * @component
 */
export default function Panel(props) {
    const { active, children } = props;
    return <div active={active}>{children}</div>;
}
