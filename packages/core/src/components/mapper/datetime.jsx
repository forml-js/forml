import t from 'prop-types';
import React, { useCallback, useMemo } from 'react';

import { FormType } from '#types';
import { useDecorator } from '@forml/hooks';

/**
 * @component DateTime
 */
export default function DateTime(props) {
    const { form } = props;
    const Decorator = useDecorator('datetime');

    const value = useMemo(
        () => props.value || new Date().toISOString(),
        [props.value]
    );
    const onChange = useCallback(
        function onChange(e) {
            props.onChangeSet(e, e.target.value);
        },
        [props.onChange]
    );

    return <Decorator form={form} value={value} onChange={onChange} />;
}

DateTime.propTypes = {
    form: FormType,
    schema: t.object,
    error: t.string,
    value: t.string,
};
