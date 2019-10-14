import * as MUI from '@material-ui/core';
import {createElement as h, useState} from 'react';

export default function fieldset(props) {
    const {form} = props;
    return h(MUI.Card,
             {},
             h(MUI.CardContent, {}, h(MUI.FormControl, {fullWidth: true, component: 'fieldset'}, [
                   h(MUI.FormLabel, {key: 'label', component: 'legend'}, form.title),
                   props.children,
               ])));
}
