import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import debug from 'debug';
import Prism from 'prismjs';
import {Component, createElement as h, Fragment, useEffect, useMemo, useState} from 'react';
import {render} from 'react-dom';
import SimpleEditor from 'react-simple-code-editor';
import {decorators, SchemaForm, util} from 'rjsf';

// import clike from 'prismjs/components/prism-clike';
// import javascript from 'prismjs/components/prism-javascript';

async function loadPrism() {
    await import('prismjs/components/prism-clike');
    await import('prismjs/components/prism-javascript');
}


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
            /** noop */
        }
    }

    return {value, json, setValue, setJSON};
}

function Editor(props) {
    console.error('Editor() : props.value : %o', props.value);
    return h(SimpleEditor, {
        value: props.value,
        highlight: (code) => {
            console.error('Editor() : Prism.highlight() : code : %o', code);
            return Prism.highlight(code, Prism.languages.javascript, 'javascript')
        },
        padding: 10,
        style: {fontFamily: 'Hack, monospace', fontSize: 12},
        onValueChange,
    });

    function onValueChange(value) {
        props.onChange({target: {value}}, value);
    }
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
                h(Typography, {variant: 'h6'}, 'Something went wrong'),
                h(Typography, {variant: 'body1'}, this.state.error.stack),
                h(Typography, {variant: 'caption'}, JSON.stringify(this.state.info)),
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
            Reflect.deleteProperty(result, key);
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
    const {onChange}            = props;
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

const useStyles = makeStyles(function() {
    return {
        root: {display: 'flex', flexDirection: 'row'},
        manager: {flex: '0 0 300px'},
        example: {flex: '1 0 600px'},
    };
});

function Page() {
    const classes                 = useStyles();
    const [selected, setSelected] = useState('');
    const [localizer, setLocalizer] = useState(undefined);
    const schema                  = useEditable({type: 'null'});
    const form                    = useEditable(['*']);
    const defaultModel              = useMemo(() => util.defaultForSchema(schema), [schema]);
    const model                     = useEditable(defaultModel);

    function onModelChange(event, ...args) {
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
        h(Card,
            {className: classes.example},
            [
                h(CardContent,
                    {},
                    h(RenderExample, {
                        key: `render-${schema.json}${form.json}`,
                        schema: schema.value,
                        form: form.value,
                        model: model.value,
                        onChange: onModelChange,
                        localizer,
                    })),
                h(CardContent,
                    {},
                    [
                        h(Typography, {key: 'title', variant: 'h6'}, 'Model'),
                        h('pre', {key: 'body'}, model.json),
                    ])
            ]),
        h(Card,
            {className: classes.manager},
            [
                h(CardContent, {key: 'select-example'}, h(SelectExample, {key: 'select', selected, onChange})),
                h(CardContent,
                    {key: 'schema'},
                    [
                        h(Typography, {key: 'title', variant: 'h6'}, 'Schema'),
                        h(Editor, {key: 'editor', value: schema.json, onChange: (e) => schema.setJSON(e.target.value)}),
                    ]),
                h(CardContent,
                    {key: 'form'},
                    [
                        h(Typography, {key: 'title', variant: 'h6'}, 'Form'),
                        h(Editor, {key: 'editor', value: form.json, onChange: (e) => form.setJSON(e.target.value)}),
                    ]),
            ]),
    ]);

    function onChange(event, example) {
        // event.preventDefault();
        setSelected(example);
    }
}

async function init() {
    await loadPrism();
    render(h(Page), document.getElementById('app'));
}

document.addEventListener('DOMContentLoaded', init);
