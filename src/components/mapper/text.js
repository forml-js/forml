import TextField from '@material-ui/core/TextField';
import debug from 'debug';
import {createElement as h} from 'react';

import {useDecorator, useLocalizer} from '../../context';

const log = debug('rjsf:mapper:text');

/**
 * @component Text
 */
export default function Text(props) {
    const {schema, value, form, error} = props;
    const {otherProps}                 = props;
    const localize                     = useLocalizer();
    const deco                         = useDecorator();

    const localizer   = useLocalizer();

    const {title, description, placeholder} = form;

    return h(deco.Input.Group, {form}, [
        title && h(deco.Label, {key: 'label', form, error}, localizer.getLocalizedString(title)),
        h(deco.Input.Form, {
            key: 'form',
            form,
            onChange,
            value,
            error,
            placeholder: localizer.getLocalizedString(placeholder),
        }),
        (error || description) &&
            h(deco.Input.Description,
              {key: 'description', form, error: !!error},
              localizer.getLocalizedString(error || description)),
    ]);

    function onChange(e) {
        props.onChange(e, e.target.value);
    }
}

