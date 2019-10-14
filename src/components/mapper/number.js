import TextField from '@material-ui/core/TextField';
import debug from 'debug';
import {createElement as h} from 'react';

import {useDecorator, useLocalizer} from '../../context';

const log = debug('rjsf:components:mapper:number');

const valueExceptions = ['', '-'];

/**
 * @component Number
 */
export default function Number(props) {
    const {form, schema, value, error} = props;

    const deco        = useDecorator();
    const localizer   = useLocalizer();

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

        value = parseFloat(value);

        if (isNaN(value)) {
            e.preventDefault();
            return;
        }

        props.onChange(e, value);
    }
}

