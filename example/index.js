import debug from 'debug';
import {createElement as h, useState} from 'react';
import {render} from 'react-dom';

import {SchemaForm} from 'rjsf';

const log = debug('rjsf:example');

function importAll(context) {
    const keys   = context.keys();
    const result = {};

    for (let key of keys) {
        result[key] = context(key);
    }

    return result;
}

const samples = importAll(require.context('./data/', false, /\.json$/));

function Page(props) {
    const enm    = Object.keys(samples);
    const titles = enm.map(k => samples[k].schema.title);

    const [model, setModel] = useState('');
    const form   = [{key: [], title: 'Sample', titles}];
    const schema = {type: 'string', enum: enm};

    return h(SchemaForm, {schema, form, model, onChange});

    function onChange(event, value) {
        setModel(value);
    }
}

async function init() {
    render(h(Page), document.getElementById('app'));
}

document.addEventListener('DOMContentLoaded', init);
