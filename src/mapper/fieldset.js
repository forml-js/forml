import FormGroup from '@material-ui/core/FormGroup';
import debug from 'debug';
import {createElement as h, useEffect, useState} from 'react';

import {useModel} from '../context';
import {SchemaField} from '../schema-field';
import {defaultForSchema} from '../util';

const log = debug('rjsf:mapper:fieldset');

export function FieldSet(props) {
    const {form} = props;
    const model  = useModel();
    const forms  = form.items.map(function(form) {
        const {key, schema} = form;
        return h(SchemaField, {
            schema,
            form,
        });
    });

    return h(FormGroup, {}, forms);
}
