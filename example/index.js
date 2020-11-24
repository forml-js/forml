import shortid from 'shortid';
import Button from '@material-ui/core/Button';
import MomentUtils from '@date-io/moment';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import debug from 'debug';
import moment from 'moment';
import Prism from 'prismjs';
import {
    Component,
    createElement as h,
    Fragment,
    useEffect,
    useMemo,
    useState,
    useRef,
} from 'react';
import jsPDF from 'jspdf';
import { render } from 'react-dom';
import SimpleEditor from 'react-simple-code-editor';
import { SchemaForm, util } from '@forml/core';
import * as mui from '@forml/decorator-mui';
import * as barebones from '@forml/decorator-barebones';
//import * as pdf from '@forml/decorator-pdf';
import ReactPDF from '@react-pdf/renderer';

import MaterialIcons from 'material-icons/iconfont/MaterialIcons-Regular.ttf';
import Roboto from 'fontsource-roboto/files/roboto-all-400-normal.woff';
import RobotoBold from 'fontsource-roboto/files/roboto-all-700-normal.woff';
import RobotoLight from 'fontsource-roboto/files/roboto-all-300-normal.woff';

const decorators = { mui: util.clone(mui), barebones: util.clone(barebones) };
console.error('decorators : %O', Object.keys(decorators));

ReactPDF.Font.register({
    family: 'Material Icons',
    src: MaterialIcons,
    fontStyle: 'normal',
});
ReactPDF.Font.register({
    family: 'Roboto',
    fonts: [
        {
            src: Roboto,
            fontWeight: 'normal',
            fontStyle: 'normal',
        },
        {
            src: RobotoBold,
            fontWeight: 'bold',
            fontStyle: 'normal',
        },
        {
            src: RobotoLight,
            fontWeight: 'light',
            fontStyle: 'normal',
        },
    ],
});

const log = debug('rjsf:example');

log('Roboto : %o', Roboto);

// import clike from 'prismjs/components/prism-clike';
// import javascript from 'prismjs/components/prism-javascript';

async function loadPrism() {
    await import('prismjs/components/prism-clike');
    await import('prismjs/components/prism-javascript');
}

function useEditable(defaultValue) {
    const [value, doSetValue] = useState({ value: defaultValue });
    const [json, doSetJSON] = useState({
        value: JSON.stringify(defaultValue, undefined, 2),
    });

    function setValue(value) {
        doSetValue({ value });
        doSetJSON({ value: JSON.stringify(value, undefined, 2) });
    }

    function setJSON(json) {
        doSetJSON({ value: json });
        try {
            doSetValue({ value: JSON.parse(json) });
        } catch (err) {
            /** noop */
        }
    }

    return { value: value.value, json: json.value, setValue, setJSON };
}

function Editor(props) {
    if (!props.value) return null;

    return h(SimpleEditor, {
        value: props.value,
        highlight: (code) => {
            return Prism.highlight(
                code,
                Prism.languages.javascript,
                'javascript'
            );
        },
        padding: 10,
        style: { fontFamily: 'Hack, monospace', fontSize: 12 },
        onValueChange,
    });

    function onValueChange(value) {
        props.onChange({ target: { value } }, value);
    }
}

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    componentDidCatch(error, info) {
        this.setState({ hasError: true, error, info });
    }

    render() {
        if (this.state.hasError) {
            return h(Fragment, {}, [
                h(Typography, { variant: 'h6' }, 'Something went wrong'),
                h(Typography, { variant: 'body1' }, this.state.error.stack),
                h(
                    Typography,
                    { variant: 'caption' },
                    JSON.stringify(this.state.info)
                ),
            ]);
        }

        return this.props.children;
    }
}

function importAll(context) {
    const keys = context.keys();
    const result = {};

    for (let key of keys) {
        result[key] = context(key);

        if (result[key].default) result[key] = result[key].default;

        if (!result[key].schema) Reflect.deleteProperty(result, key);
    }

    return result;
}

const samples = importAll(require.context('./data/', true, /\.js(on)?$/));

function SelectExample(props) {
    const enm = Object.keys(samples);
    const titles = enm.map((k) => samples[k].schema.title);

    const form = [{ key: [], title: 'Sample', titles }];
    const schema = { type: 'string', enum: enm };
    const model = props.selected;
    const decorator = decorators.mui;

    return h(SchemaForm, {
        schema,
        form,
        model,
        onChange,
        decorator,
        onModelChange,
    });

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

function SelectDecorator(props) {
    return h(SchemaForm, {
        schema: {
            type: 'string',
            enum: Object.keys(decorators),
            enumNames: Object.keys(decorators),
        },
        form: [{ key: [] }],
        model: props.decorator,
        onChange,
        decorator: mui,
    });
    function onChange(event, nextModel) {
        props.onChange(nextModel);
    }
}
function RenderExample(props) {
    const { schema, form, model } = props;
    const { onChange } = props;
    const { localizer } = props;
    const { mapper } = props;
    const { decorator } = props;
    const { wrapInDocument } = props;

    const key = useMemo(() => shortid(), [decorator]);

    const formProps = {
        schema,
        form,
        model,
        decorator: decorators[decorator],
        localizer,
        onChange,
        mapper,
    };

    let child = h(SchemaForm, formProps);
    if (decorator === 'pdf') {
        if (wrapInDocument) {
            child = h(
                ReactPDF.Document,
                {},
                h(ReactPDF.Page, { size: 'A4' }, child)
            );
        }
        child = h(
            ReactPDF.PDFViewer,
            { key, style: { width: '100vw', height: '100vh' } },
            child
        );
    }

    return h(ErrorBoundary, {}, child);
}

function getSample(selected) {
    if (selected in samples) return samples[selected];

    return { schema: { type: 'null' }, form: ['*'] };
}

const useStyles = makeStyles(function () {
    return {
        root: { display: 'flex', flexDirection: 'row' },
        manager: { flex: '0 0 300px' },
        example: { flex: '1 0 600px' },
        exampleContent: { display: 'flex', flexDirection: 'column' },
    };
});

function Page() {
    const pdfRef = useRef();
    const classes = useStyles();
    const [selected, setSelected] = useState('');
    const [localizer, setLocalizer] = useState(undefined);
    const [decorator, setDecorator] = useState('mui');
    const [mapper, setMapper] = useState(undefined);
    const schema = useEditable({ type: 'null' });
    const form = useEditable(['*']);
    const defaultModel = useMemo(() => {
        return util.defaultForSchema(schema.value);
    }, [schema.value]);
    const model = useEditable(defaultModel);

    function onModelChange(event, ...args) {
        model.setValue(args[0]);
    }

    log('selected : %o', selected);

    return h('div', { className: classes.root }, [
        h(Card, { className: classes.example, key: 'primary-viewport' }, [
            h(
                CardContent,
                {
                    key: 'example',
                    className: classes.exampleContent,
                    ref: pdfRef,
                },
                h(RenderExample, {
                    key: `render-${decorator}-${schema.json}-${form.json}`,
                    schema: schema.value,
                    form: form.value,
                    model: model.value,
                    onChange: onModelChange,
                    wrapInDocument: selected != './kitchenSink.js',
                    mapper,
                    localizer,
                    decorator,
                })
            ),
            h(CardContent, { key: 'model' }, [
                h(Typography, { key: 'title', variant: 'h6' }, 'Model'),
                h('pre', { key: 'body' }, model.json),
            ]),
        ]),
        h(Card, { className: classes.manager, key: 'secondary-viewport' }, [
            h(
                CardContent,
                { key: 'select-example' },
                h(SelectExample, { key: 'select', selected, onChange })
            ),
            h(
                CardContent,
                { key: 'select-decorator' },
                h(SelectDecorator, { decorator, onChange: setDecorator })
            ),
            h(CardContent, {}, h(Button, { onClick: savePDF }, 'Save PDF')),
            h(CardContent, { key: 'schema' }, [
                h(Typography, { key: 'title', variant: 'h6' }, 'Schema'),
                h(Editor, {
                    key: 'editor',
                    value: schema.json,
                    onChange: (e) => schema.setJSON(e.target.value),
                }),
            ]),
            h(CardContent, { key: 'form' }, [
                h(Typography, { key: 'title', variant: 'h6' }, 'Form'),
                h(Editor, {
                    key: 'editor',
                    value: form.json,
                    onChange: (e) => form.setJSON(e.target.value),
                }),
            ]),
        ]),
    ]);

    function savePDF() {
        if (pdfRef.current) {
            const doc = new jsPDF();
            doc.html(pdfRef.current, {
                callback: function (doc) {
                    doc.save();
                },
            });
        }
    }

    function onChange(event, example) {
        // event.preventDefault();
        const sample = getSample(example);
        schema.setValue(sample.schema);
        form.setValue(sample.form);
        model.setValue(sample.model || util.defaultForSchema(sample.schema));
        setMapper(sample.mapper);
        setLocalizer(sample.localization);
        setSelected(example);
    }
}

async function init() {
    await loadPrism();

    render(
        h(MuiPickersUtilsProvider, { utils: MomentUtils }, h(Page)),
        document.getElementById('app')
    );
}

document.addEventListener('DOMContentLoaded', init);
