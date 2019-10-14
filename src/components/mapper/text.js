import TextField from '@material-ui/core/TextField';
import debug from 'debug';
import {createElement as h} from 'react';

import {useDecorator, useLocalizer} from '../../context';

const log = debug('rjsf:mapper:text');

export default function Text(props) {
    const {schema, value, form, error} = props;
    const {otherProps}                 = props;
    const localize                     = useLocalizer();
    const deco                         = useDecorator();

    const localizer   = useLocalizer();

    const {title, description, placeholder} = form;

    return h(deco.input.group, {form}, [
        title && h(deco.label, {key: 'label', form, error}, localizer.getLocalizedString(title)),
        h(deco.input.form, {
            key: 'form',
            form,
            onChange,
            value,
            error,
            placeholder: localizer.getLocalizedString(placeholder),
        }),
        (error || description) &&
            h(deco.input.description,
              {key: 'description', form, error: !!error},
              localizer.getLocalizedString(error || description)),
    ]);

    function onChange(e) {
        props.onChange(e, e.target.value);
    }
}

