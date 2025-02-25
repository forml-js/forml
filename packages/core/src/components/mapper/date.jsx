import t from 'prop-types';
import React, { useCallback, useMemo } from 'react';

import { useDecorator, useLocalizer } from '@forml/hooks';
import { FormType } from '#types';

/**
 * @component Date
 */
export default function DateInput(props) {
    const Decorator = useDecorator('date');

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

    return <Decorator form={props.form} value={value} onChange={onChange} />;
}

Date.propTypes = {
    form: FormType,
    schema: t.object,
    error: t.string,
    value: t.string,
};
