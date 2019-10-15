import MuiCheckbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import t from 'prop-types';
import {createElement as h} from 'react';

import {useDecorator, useLocalizer} from '../../context';
import {FormType} from '../../types';

/**
 * @component Checkbox
 */
export default function Checkbox(props) {
    const {schema, form}           = props;
    const {error, value}           = props;
    const {title, description}     = form;

    const deco                     = useDecorator();
    const localize                 = useLocalizer();

    return h(deco.Checkbox, {
        form,
        checked: value,
        title: localize.getLocalizedString(title),
        description: localize.getLocalizedString(description),
        onChange,
    });

    function onChange(event, value) {
        console.error('Checkbox() : event : %o', event);
        props.onChange(event, event.target.checked);
    }
}

Checkbox.propTypes = {
    schema: t.object,
    form: FormType,
    error: t.string,
    value: t.boolean,
};
