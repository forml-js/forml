import React from 'react';
import t from 'prop-types';
import { useCallback } from 'react';

import { FormType } from '#types';
import { useDecorator, useValue } from '@forml/hooks';

/**
 * @component Checkbox
 */
export default function Checkbox(props) {
    const { form } = props;
    const value = useValue(form.key);

    const Decorator = useDecorator('checkbox');
    const onChange = useCallback(
        function onChange(event) {
            props.onChangeSet(event, event.target.checked);
        },
        [props.onChange]
    );

    return <Decorator form={form} value={value} onChange={onChange} />;
}

Checkbox.propTypes = {
    schema: t.object,
    form: FormType,
    error: t.string,
    value: t.bool,
};
