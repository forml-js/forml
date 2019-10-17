import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import {createElement as h} from 'react';

/**
 * @component
 */
export default function FieldSet(props) {
    const {title} = props;
    return h(Card, {}, h(CardContent, {}, h(FormControl, {fullWidth: true, component: 'fieldset'}, [
                             h(FormLabel, {key: 'label', component: 'legend'}, title),
                             props.children,
                         ])));
}
