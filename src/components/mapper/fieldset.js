import t from 'prop-types';
import {createElement as h} from 'react';

import {useDecorator, useLocalizer} from '../../context';
import {FormType} from '../../types';
import {SchemaField} from '../schema-field';

/**
 * @component FieldSet
 */
export default function FieldSet(props) {
    const {form, onChange} = props;
    const localizer        = useLocalizer();
    const title            = localizer.getLocalizedString(form.title);

    const forms = form.items.map(function(form, index) {
        const {schema} = form;
        const key      = index.toString();

        return h(SchemaField, {
            form,
            key,
            onChange,
            schema,
        });
    });

    const deco = useDecorator();

    return h(deco.FieldSet, {form, title}, forms);
}

FieldSet.propTypes = {
    form: FormType,
    onChange: t.func
};
