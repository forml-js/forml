import React from 'react';

import { useDecorator, useLocalizer } from '@forml/hooks';
import { FormType } from '../../types';

/**
 * @component Notice
 */
export default function Notice(props) {
    const { form } = props;
    const Decorator = useDecorator('notice');
    return <Decorator form={form} />;
}

Help.propTypes = {
    form: FormType,
};
