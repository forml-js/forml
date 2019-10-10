import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import {makeStyles} from '@material-ui/core/styles';
import clsx from 'classnames';
import debug from 'debug';
import ObjectPath from 'objectpath';
import {createElement as h, useEffect, useState} from 'react';

import {SchemaField} from '../schema-field';
import {defaultForSchema, useKeyGenerator} from '../util';

const log = debug('rjsf:mapper:fieldset');

export const useStyles = makeStyles(function(theme) {
    return {root: {flex: '1'}};
});

export function FieldSet(props) {
    const {form, onChange} = props;
    const {title}          = form;
    const classes          = useStyles();
    const generateKey      = useKeyGenerator();

    const forms = form.items.map(function(form, index) {
        const {schema} = form;
        const key      = generateKey(form);

        log('FieldSet(%s) : form.items.map(%d) : key : %o', title, index, key)

        return h(SchemaField, {
            key,
            schema,
            form,
            onChange,
        });
    });

    return h(
        FormControl,
        {
            component: 'fieldset',
            className: clsx(classes.root, form.htmlClass),
            style: form.style,
            ...form.otherProps,
        },
        [
            h(FormLabel, {key: 'label', component: 'legend', required: form.required}, form.title),
            forms,
        ]);
}
