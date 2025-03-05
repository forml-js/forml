import React from 'react';

export default function Help(props) {
    const { form } = props;
    const description = 'description' in form ? form.description : null;
    return <p>{description}</p>;
}
