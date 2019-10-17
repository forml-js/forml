import FormGroup from '@material-ui/core/FormGroup';
import {createElement as h} from 'react';

/**
 * @component
 */
export default function Group(props) {
    const {form}             = props;
    const {fullWidth = true} = form;
    return h(FormGroup, {fullWidth, ...form.otherProps}, props.children);
}
