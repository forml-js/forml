import { useDecorator } from '@forml/hooks';
import { AsYouType } from 'libphonenumber-js';
import React, { useCallback } from 'react';

export default function PhoneNumber(props) {
    const Text = useDecorator('text');
    const onChange = useCallback((event) => {
        const newValue = new AsYouType('US').input(event.target.value);
        props.onChangeSet(event, newValue);
    }, []);
    return <Text {...props} onChange={onChange} />;
}
