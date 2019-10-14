import * as MUI from '@material-ui/core';
import {createElement as h, useState} from 'react';

export default function text(props) {
    const {form}                  = props;
    const {variant, align, color} = form;
    const {noWrap, paragraph}     = form;

    return h(MUI.Typography,
             {variant, align, color, noWrap, paragraph, ...form.otherProps},
             props.children);
}
