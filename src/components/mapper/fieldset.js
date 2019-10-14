import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import {makeStyles} from '@material-ui/core/styles';
import clsx from 'classnames';
import debug from 'debug';
import ObjectPath from 'objectpath';
import {createElement as h, useEffect, useState} from 'react';

import {useDecorator} from '../../context';
import {defaultForSchema} from '../../util';
import {SchemaField} from '../schema-field';

const log = debug('rjsf:mapper:fieldset');


export function FieldSet(props) {
    const {form, onChange} = props;
    const {title}          = form;

    const forms = form.items.map(function(form, index) {
        const {schema} = form;
        const key      = index.toString();

        return h(SchemaField, {
            key,
            schema,
            form,
            onChange,
        });
    });

    const deco = useDecorator();

    return h(deco.fieldset, {form}, forms);
}