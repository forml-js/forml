import { useDecorator, useValue } from '@forml/hooks';
import { AsYouType } from 'libphonenumber-js';
import React, { useCallback } from 'react';

export default function PhoneNumber(props) {
    const { form } = props;
    const value = useValue(form.key);
    const Text = useDecorator('text');
    const onChange = useCallback((event) => {
        const newValue = new AsYouType('US').input(event.target.value);
        props.onChangeSet(event, newValue);
    }, []);
    return <Text form={form} value={value} onChange={onChange} />;
}
