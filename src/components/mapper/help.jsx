import React from 'react';

import { useDecorator, useLocalizer } from '../../context';
import { FormType } from '../../types';

/**
 * @component Help
 */
export default function Help(props) {
    const { form } = props;
    const { description } = form;

    const localize = useLocalizer();
    const deco = useDecorator();
    const title = localize.getLocalizedString(form.title);

    return (
        <deco.Text form={form} title={title}>
            {localize.getLocalizedString(description)}
        </deco.Text>
    );
}

Help.propTypes = {
    form: FormType,
};
