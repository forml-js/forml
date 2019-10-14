import MuiCheckbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import {createElement as h} from 'react';
import {useDecorator, useLocalizer} from '../../context';

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

    // return h(FormGroup, {row: true}, h(FormControlLabel, {
    //              label: form.title,
    //              control: h(MuiCheckbox, {
    //                  checked: value,
    //                  disabled: form.readonly,
    //                  onChange,
    //              }),
    //          }));
}
