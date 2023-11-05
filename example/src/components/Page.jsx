import { util } from '@forml/core';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import React, { useMemo, useRef, useState } from 'react';
import useEditable from '../hooks/useEditable';
import { getSample } from '../samples';
import Editor from './Editor';
import RenderExample from './RenderExample';
import SelectDecorator from './SelectDecorator';
import SelectExample from './SelectExample';

const Root = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1,
    overflow: 'hidden',
    maxHeight: 'fill-available',
}));
const ExampleCard = styled(Card)(({ theme }) => ({
    display: 'flex',
    flex: '1 0 auto',
    flexDirection: 'column',
    maxHeight: 'fill-available',
}));
const ExampleCardContent = styled(CardContent)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    flex: '1 0 0',
    maxHeight: 'fill-available',
    overflow: 'auto',
    borderBottom: `1px solid ${theme.palette?.divider}`,
}));
const ExampleCardFooter = styled(CardContent)(({ theme }) => ({
    flex: '0 0 fit-content',
    maxHeight: '30%',
}));
const ManagerCard = styled(Card)({ flex: '0 0 300px' });

export default function Page() {
    const pdfRef = useRef();
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
        <Root>
            <ExampleCard key="primary-viewport">
                <ExampleCardContent key="example" ref={pdfRef}>
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
                </ExampleCardContent>
                <ExampleCardFooter key="model">
                    <Typography key="title" variant="h6">
                        Model
                    </Typography>
                    <Editor key="editor" value={model.json} />
                </ExampleCardFooter>
            </ExampleCard>
            <ManagerCard key="secondary-viewport">
                <CardContent key="select-example">
                    <SelectExample selected={selected} onChange={onChange} />
                </CardContent>
                <CardContent key="select-decorator">
                    <SelectDecorator
                        decorator={decorator}
                        onChange={setDecorator}
                    />
                </CardContent>
                <CardContent key="schema">
                    <Typography key="title" variant="h6">
                        Schema
                    </Typography>
                    <Editor
                        key="editor"
                        value={schema.json}
                        onChange={(e) => schema.setJSON(e.target.value)}
                    />
                </CardContent>
                <CardContent key="form">
                    <Typography key="title" variant="h6">
                        Form
                    </Typography>
                    <Editor
                        key="editor"
                        value={form.json}
                        onChange={(e) => form.setJSON(e.target.value)}
                    />
                </CardContent>
            </ManagerCard>
        </Root>
    );

    async function onChange(event, example) {
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
