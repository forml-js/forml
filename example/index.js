import * as MUI from '@material-ui/core';
import debug from 'debug';
import {Component, createElement as h, Fragment, useEffect, useState} from 'react';
import {render} from 'react-dom';
import {SchemaForm, util} from 'rjsf';
import shortid from 'shortid';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {hasError: false};
    }

    componentDidCatch(error, info) {
        this.setState({hasError: true, error, info});
    }

    render() {
        if (this.state.hasError) {
            return h(Fragment, {}, [
                h(MUI.Typography, {variant: 'h6'}, 'Something went wrong'),
                h(MUI.Typography, {variant: 'body1'}, this.state.error.stack),
                h(MUI.Typography, {variant: 'caption'}, JSON.stringify(this.state.info)),
            ]);
        }

        return this.props.children;
    }
}

const log = debug('rjsf:example');

function importAll(context) {
    const keys   = context.keys();
    const result = {};

    for (let key of keys) {
        result[key] = context(key);

        if (!result[key].schema)
            delete result[key];
    }

    return result;
}

const samples = importAll(require.context('./data/', false, /\.json$/));

function SelectExample(props) {
    const enm    = Object.keys(samples);
    const titles = enm.map(k => samples[k].schema.title);

    const form              = [{key: [], title: 'Sample', titles}];
    const schema            = {type: 'string', enum: enm};
    const model             = props.selected;

    try {
        return h(SchemaForm, {schema, form, model, onChange});
    } catch (err) {
        return null;
    }

    function onChange(event, value) {
        props.onChange(event, value);
    }
}
const ids = new WeakMap();
function idFor(object) {
    if (object === null)
        return 'null';
    if (object === undefined)
        return 'undefined';
    if (typeof object !== 'object')
        return object;

    if (ids.has(object))
        return ids.get(object);
    const id = shortid();
    ids.set(object, id);
    return id;
}

function RenderExample(props) {
    const {schema, form} = props;
    const [model, setModel] = useState(util.defaultForSchema(schema));

    log('RenderExample() : model : %o', model);
    schema.title = 'RenderExample';
    useEffect(function() {
        setModel(util.defaultForSchema(schema));
    }, [schema]);

    return h(ErrorBoundary, {key: getKey()}, h(SchemaForm, {schema, form, model, onChange}))

    function onChange(event, model) {
        setModel(model);
    }

    function getKey() {
        return idFor(schema) + idFor(model);
    }
}

function getSample(selected) {
    if (selected in samples)
        return samples[selected];

    return {schema: {type: 'null'}, form: ['*']};
}

function Page(props) {
    const [selected, setSelected] = useState('');
    const [schema, setSchema]     = useState({type: 'null'});
    const [form, setForm]         = useState(['*']);

    useEffect(function() {
        const {schema, form} = getSample(selected);
        setSchema(schema);
        setForm(form);
    }, [selected]);

    return h(Fragment, {}, [
        h(MUI.Card,
          {},
          h(MUI.CardContent, {}, h(SelectExample, {key: 'select', selected, onChange}))),
        h(RenderExample, {key: 'render', schema, form}),
    ]);

    function onChange(event, example) {
        setSelected(example);
    }
}

async function init() {
    render(h(Page), document.getElementById('app'));
}

document.addEventListener('DOMContentLoaded', init);
