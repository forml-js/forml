import React, {
    useMemo,
    useState,
    useRef,
} from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { util } from '@forml/core';

import Editor from './Editor';
import RenderExample from './RenderExample';
import SelectDecorator from './SelectDecorator';
import SelectExample from './SelectExample';

import { getSample } from '../samples';

import useEditable from '../hooks/useEditable';

const useStyles = makeStyles(function() {
    return {
        root: { display: 'flex', flexDirection: 'row' },
        manager: { flex: '0 0 300px' },
        example: { flex: '1 0 600px' },
        exampleContent: { display: 'flex', flexDirection: 'column' },
    };
});

export default function Page() {
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

    return (
        <div className={classes.root}>
            <Card className={classes.example} key="primary-viewport">
                <CardContent key="example" className={classes.exampleContent} ref={pdfRef}>
                    <RenderExample
                        key={`render-${decorator}-${schema.json}-${form.json}`}
                        schema={schema.value}
                        form={form.value}
                        model={model.value}
                        onChange={onModelChange}
                        wrapInDocument={selected != './kitchenSink.js'}
                        mapper={mapper}
                        localizer={localizer}
                        decorator={decorator}
                    />
                </CardContent>
              <CardContent key="model">
                <Typography key="title" variant="h6">Model</Typography>
                <Editor key="editor" value={model.json} />
              </CardContent>
            </Card>
            <Card className={classes.manager} key="secondary-viewport">
                <CardContent key="select-example">
                    <SelectExample selected={selected} onChange={onChange} />
                </CardContent>
                <CardContent key="select-decorator">
                    <SelectDecorator decorator={decorator} onChange={setDecorator} />
                </CardContent>
                <CardContent key="schema">
                    <Typography key="title" variant="h6">Schema</Typography>
                    <Editor key="editor" value={schema.json} onChange={(e) => schema.setJSON(e.target.value)} />
                </CardContent>
                <CardContent key="form">
                    <Typography key="title" variant="h6">Form</Typography>
                    <Editor key="editor" value={form.json} onChange={(e) => form.setJSON(e.target.value)} />
                </CardContent>
            </Card>
        </div>
    );

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

    function onModelChange(event, ...args) {
        model.setValue(args[0]);
    }

}
