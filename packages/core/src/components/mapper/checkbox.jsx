import t from 'prop-types';
import React, { useCallback } from 'react';

import { useDecorator, useLocalizer } from '@forml/hooks';
import { FormType } from '#types';

/**
 * @component Checkbox
 */
export default function Checkbox(props) {
    const { form, value } = props;

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
