import { createElement as h } from 'react';

import { useContext } from '../../context';
import { SchemaForm } from '../schema-form';

export default function Dynamic(props) {
    const { form: parent, value } = props;
    const form = parent.generate;
    const ctx = useContext();
    const { decorator, mapper, localizer } = ctx;

    return h(SchemaForm, {
        ...props,
        decorator,
        mapper,
        localizer,
        form,
        model: value,
    });
}
