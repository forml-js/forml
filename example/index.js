import debug from 'debug';
import {createElement as h} from 'react';
import {render} from 'react-dom';

import {SchemaForm} from '../src';

const log = debug('rjsf:example');

async function init() {
    const schema = {
        type: 'array',
        title: 'Foo Bars',
        items: {
            type: 'object',
            title: 'Foo Bar',
            properties: {
                'foo': {type: 'string'},
                'bar': {type: 'number'},
            }
        }
    };
    const form   = ['*'];
    const model  = [];
    render(h(SchemaForm, {schema, form, model, onChange}), document.getElementById('app'));

    function onChange(...args) {
        log('onChange(%o)', args);
    }
}

document.addEventListener('DOMContentLoaded', init);
