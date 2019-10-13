import * as MUI from '@material-ui/core';
import {createElement as h, useState} from 'react';

import * as arrays from './arrays';
import * as input  from './input';
import * as tabs   from './tabs';

export function fieldset(props) {
    const {form} = props;
    return h(MUI.Card,
             {},
             h(MUI.CardContent, {}, h(MUI.FormControl, {fullWidth: true, component: 'fieldset'}, [
                   h(MUI.FormLabel, {key: 'label', component: 'legend'}, form.title),
                   props.children,
               ])));
}

export function label(props) {
    return h(MUI.InputLabel, props);
}

export function text(props) {
    const {form} = props;
    const {variant, align, color} = form;
    const {noWrap, paragraph}     = form;

    return h(MUI.Typography,
             {variant, align, color, noWrap, paragraph, ...form.otherProps},
             props.children);
}

export function group(props) {
    const {form}             = props;
    const {fullWidth = true} = form;
    return h(MUI.FormGroup, {fullWidth, ...form.otherProps}, props.children);
}

export function checkbox({title, description, error, form, checked, onChange}) {
    return h(MUI.FormGroup, {row: true}, [
        h(MUI.FormControlLabel, {label: title, control: h(MUI.Checkbox, {checked, onChange})}),
        (error || description) && h(MUI.FormHelperText, {error}, (error || description)),
    ])
}

export {arrays, input, tabs};

