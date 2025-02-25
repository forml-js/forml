import debug from 'debug';
import React, { useCallback, useState } from 'react';

import { useDecorator, useLocalizer } from '@forml/hooks';

const log = debug('forml:core:mapper:file');

/**
 * @component File
 */
export default function File(props) {
    const { value, form } = props;

    const Decorator = useDecorator('file');
    const onChange = useCallback(
        (event, value) => props.onChangeSet(event, value),
        [props.onChangeSet]
    );

    return <Decorator form={form} value={value} onChange={onChange} />;
}
