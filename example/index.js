import * as MUI from '@material-ui/core';
import clsx from 'classnames';
import debug from 'debug';
import _ from 'lodash';
import {Component, createElement as h, Fragment, useEffect, useMemo, useRef, useState} from 'react';
import AceEditor from 'react-ace';
import {render} from 'react-dom';
import {decorators, SchemaForm, util} from 'rjsf';
import shortid from 'shortid';

function useEditable(defaultValue) {
    const [value, doSetValue] = useState(defaultValue);
    const [json, doSetJSON]   = useState('null');

    function setValue(value) {
        doSetValue(value);
        doSetJSON(JSON.stringify(value, undefined, 2));
    }

    function setJSON(json) {
        doSetJSON(json);
        try {
            doSetValue(JSON.parse(json));
        } catch (err) {
        }
    }

    return {value, json, setValue, setJSON};
}

function Editor(props) {
    return h(AceEditor, {
        ...props,
        mode: 'json',
        theme: 'github',
        height: '300px',
        width: 'auto',
        editorProps: {$blockScrolling: true}
    });
}

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

        if (result[key].default)
            result[key] = result[key].default;

        if (!result[key].schema)
            delete result[key];
    }

    return result;
}

const samples = importAll(require.context('./data/', true, /\.js(on)?$/));

function SelectExample(props) {
    const enm    = Object.keys(samples);
    const titles = enm.map(k => samples[k].schema.title);

    const form              = [{key: [], title: 'Sample', titles}];
    const schema            = {type: 'string', enum: enm};
    const model             = props.selected;
    const decorator         = decorators.mui;

    try {
        return h(SchemaForm, {schema, form, model, onChange, decorator, onModelChange});
    } catch (err) {
        return null;
    }

    function onModelChange(model) {
        log('onModelChange() : %o', model);
        if (props.onModelChange) {
            props.onModelChange(model);
        }
    }

    function onChange(event, value) {
        log('onChange() : %o', value);
        props.onChange(event, value);
    }
}
function RenderExample(props) {
    const {schema, form, model} = props;
    const {onChange, className} = props;
    const {localizer}           = props;
    const decorator             = decorators.mui;

    return h(ErrorBoundary, {}, h(SchemaForm, {
                 schema,
                 form,
                 model,
                 decorator,
                 localizer,
                 onChange,
             }));
}

function getSample(selected) {
    if (selected in samples)
        return samples[selected];

    return {schema: {type: 'null'}, form: ['*']};
}

const useStyles = MUI.makeStyles(function(theme) {
    return {
        root: {display: 'flex', flexDirection: 'row'},
        manager: {flex: '0 0 300px'},
        example: {flex: '1 0 600px'},
    };
});

function Page(props) {
    const classes                 = useStyles();
    const [selected, setSelected] = useState('');
    const [localizer, setLocalizer] = useState(undefined);
    const schema                  = useEditable({type: 'null'});
    const form                    = useEditable(['*']);
    const defaultModel              = useMemo(() => util.defaultForSchema(schema), [schema]);
    const model                     = useEditable(defaultModel);

    function onModelChange(...args) {
        model.setValue(args[0]);
    }

    useEffect(function() {
        const sample = getSample(selected);
        schema.setValue(sample.schema);
        form.setValue(sample.form);
        model.setValue(defaultModel);
        setLocalizer(sample.localization);
    }, [selected]);

    return h('div', {className: classes.root}, [
        h(MUI.Card,
            {className: classes.example},
            [
                h(MUI.CardContent,
                    {},
                    h(RenderExample, {
                        key: `render-${selected}`,
                        schema: schema.value,
                        form: form.value,
                        model: model.value,
                        onChange: onModelChange,
                        localizer,
                    })),
                h(MUI.CardContent,
                    {},
                    [
                        h(MUI.Typography, {key: 'title', variant: 'h6'}, 'Model'),
                        h('pre', {key: 'body'}, model.json),
                    ])
            ]),
        h(MUI.Card,
            {className: classes.manager},
            [
                h(MUI.CardContent, {key: 'select-example'}, h(SelectExample, {key: 'select', selected, onChange})),
                h(MUI.CardContent,
                    {key: 'schema'},
                    [
                        h(MUI.Typography, {key: 'title', variant: 'h6'}, 'Schema'),
                        h(Editor, {key: 'editor', value: schema.json, onChange: schema.setJSON}),
                    ]),
                h(MUI.CardContent,
                    {key: 'form'},
                    [
                        h(MUI.Typography, {key: 'title',variant: 'h6'}, 'Form'),
                        h(Editor, {key: 'editor', value: form.json, onChange: form.setJSON}),
                    ]),
            ]),
    ]);

    function onChange(event, example) {
        // event.preventDefault();
        setSelected(example);
    }

    function onModelChange(event, value) {
        // event.preventDefault();
        model.setValue(value);
    }
}

async function init() {
    render(h(Page), document.getElementById('app'));
}

document.addEventListener('DOMContentLoaded', init);
