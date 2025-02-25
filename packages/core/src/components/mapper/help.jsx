import React from 'react';

import { useDecorator, useLocalizer } from '@forml/hooks';
import { FormType } from '../../types';

/**
 * @component Help
 */
export default function Help(props) {
    const { form } = props;
    const Decorator = useDecorator('help');
    return <Decorator form={form} />;
}

Help.propTypes = {
    form: FormType,
};
