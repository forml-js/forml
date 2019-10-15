import TextField from '@material-ui/core/TextField';
import debug from 'debug';
import t from 'prop-types';
import {createElement as h} from 'react';

import {useDecorator, useLocalizer} from '../../context';
import {FormType} from '../../types';

const valueExceptions = ['', '-'];

/**
 * @component Integer
 */
export default function Integer(props) {
    const {schema, value, form, error} = props;

    const deco      = useDecorator();
    const localizer = useLocalizer();

    const placeholder = localizer.getLocalizedString(form.placeholder);
    const label       = localizer.getLocalizedString(form.title || form.key[form.key.length - 1]);
    const description = localizer.getLocalizedString(form.description);

    return h(deco.Input.Group, {form}, [
        h(deco.Label, {form}, label),
        h(deco.Input.Form, {value, onChange, placeholder, form}),
        (error || description) && h(deco.Input.Description, {error: !!error}, error || description),
    ]);

    function onChange(e) {
        let value = e.target.value;

        if (valueExceptions.includes(value)) {
            props.onChange(e, value);
            return;
        }

        value = parseInt(value);

        if (isNaN(value)) {
            e.preventDefault();
            return;
        }

        props.onChange(e, value);
    }
}

Integer.propTypes = {
    form: FormType,
    schema: t.object,
    error: t.string,
    value: t.number,
};
