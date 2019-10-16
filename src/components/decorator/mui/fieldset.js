import * as MUI from '@material-ui/core';
import {createElement as h} from 'react';

/**
 * @component
 */
export default function FieldSet(props) {
    const {title} = props;
    return h(MUI.Card,
             {},
             h(MUI.CardContent, {}, h(MUI.FormControl, {fullWidth: true, component: 'fieldset'}, [
                   h(MUI.FormLabel, {key: 'label', component: 'legend'}, title),
                   props.children,
               ])));
}
