import TextField from '@material-ui/core/TextField';
import debug from 'debug';
import {createElement as h} from 'react';

import {useDecorator, useLocalizer} from '../../context';

const log = debug('rjsf:components:mapper:number');

const valueExceptions = ['', '-'];

export function Number(props) {
    const {form, schema, value, error} = props;

    const deco        = useDecorator();
    const localizer   = useLocalizer();

    const placeholder = localizer.getLocalizedString(form.placeholder);
    const label       = localizer.getLocalizedString(form.title || form.key[form.key.length - 1]);
    const description = localizer.getLocalizedString(form.description);

    return h(deco.input.group, {form}, [
        h(deco.label, {form}, label),
        h(deco.input.form, {value, onChange, placeholder, form}),
        (error || description) && h(deco.input.description, {error: !!error}, error || description),
    ]);

    function onChange(e) {
        let value = e.target.value;

        if (valueExceptions.includes(value)) {
            props.onChange(e, value);
            return;
        }

        value = parseFloat(value);

        if (isNaN(value)) {
            e.preventDefault();
            return;
        }

        props.onChange(e, value);
    }
}

export function Integer(props) {
    const {schema, value, form, error} = props;

    const deco      = useDecorator();
    const localizer = useLocalizer();

    const placeholder = localizer.getLocalizedString(form.placeholder);
    const label       = localizer.getLocalizedString(form.title || form.key[form.key.length - 1]);
    const description = localizer.getLocalizedString(form.description);

    return h(deco.input.group, {form}, [
        h(deco.label, {form}, label),
        h(deco.input.form, {value, onChange, placeholder, form}),
        (error || description) && h(deco.input.description, {error: !!error}, error || description),
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
