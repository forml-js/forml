import MomentUtils from '@date-io/moment';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import {MuiPickersUtilsProvider} from '@material-ui/pickers';
import debug from 'debug';
import moment from 'moment';
import Prism from 'prismjs';
import {Component, createElement as h, Fragment, useEffect, useMemo, useState} from 'react';
import {render} from 'react-dom';
import SimpleEditor from 'react-simple-code-editor';
import {decorators, SchemaForm, util} from 'rjsf';

const log = debug('rjsf:example');

// import clike from 'prismjs/components/prism-clike';
// import javascript from 'prismjs/components/prism-javascript';

async function loadPrism() {
    await import('prismjs/components/prism-clike');
    await import('prismjs/components/prism-javascript');
}


function useEditable(defaultValue) {
    const [value, doSetValue] = useState({value: defaultValue});
    const [json, doSetJSON]   = useState({value: JSON.stringify(defaultValue, undefined, 2)});

    function setValue(value) {
        doSetValue({value});
        doSetJSON({value: JSON.stringify(value, undefined, 2)});
    }

    function setJSON(json) {
        doSetJSON({value: json});
        try {
            doSetValue({value: JSON.parse(json)});
        } catch (err) {
            /** noop */
        }
    }

    return {value: value.value, json: json.value, setValue, setJSON};
}

function Editor(props) {
    if (!props.value)
        return null;

    return h(SimpleEditor, {
        value: props.value,
        highlight: (code) => {
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

    return h(SchemaForm, {schema, form, model, onChange, decorator, onModelChange});

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
    const {mapper}              = props;
    const decorator             = decorators.mui;

    const formProps = {
        schema,
        form,
        model,
        decorator,
        localizer,
        onChange,
        mapper,
    };

    return h(ErrorBoundary, {}, h(SchemaForm, formProps));
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
    const classes                   = useStyles();
    const [selected, setSelected]   = useState('');
    const [localizer, setLocalizer] = useState(undefined);
    const [mapper, setMapper]       = useState(undefined);
    const schema                    = useEditable({type: 'null'});
    const form                      = useEditable(['*']);
    const defaultModel              = useMemo(() => {
        return util.defaultForSchema(schema.value);
    }, [schema.value]);
    const model                     = useEditable(defaultModel);

    function onModelChange(event, ...args) {
        model.setValue(args[0]);
    }

    log('model : %o', model.value);
    log('rendering');

    return h('div', {className: classes.root}, [
        h(Card,
            {className: classes.example, key: 'primary-viewport'},
            [
                h(CardContent,
                    {key: 'example'},
                    h(RenderExample, {
                        key: `render-${schema.json}${form.json}`,
                        schema: schema.value,
                        form: form.value,
                        model: model.value,
                        onChange: onModelChange,
                        mapper,
                        localizer,
                    })),
                h(CardContent,
                    {key: 'model'},
                    [
                        h(Typography, {key: 'title', variant: 'h6'}, 'Model'),
                        h('pre', {key: 'body'}, model.json),
                    ])
            ]),
        h(Card,
            {className: classes.manager, key: 'secondary-viewport'},
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
        const sample = getSample(example);
        schema.setValue(sample.schema);
        form.setValue(sample.form);
        model.setValue(util.defaultForSchema(sample.schema));
        setMapper(sample.mapper);
        setLocalizer(sample.localization);
        setSelected(example);
    }
}

async function init() {
    await loadPrism();

    render(h(MuiPickersUtilsProvider, {utils: MomentUtils}, h(Page)),
           document.getElementById('app'));
}

document.addEventListener('DOMContentLoaded', init);
