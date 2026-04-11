import { loader } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useComponents } from '../hooks/useComponents.jsx';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
    useSample,
    useSampleModel,
    useSampleModelJSON,
    useSampleSchemaJSON,
    useSampleFormJSON,
    useSampleMapper,
    useSampleLocalizer,
    useSampleDecorator,
} from '../samples.jsx';
import Editor from './Editor.jsx';
import RenderExample from './RenderExample.jsx';
import SelectDecorator from './SelectDecorator.jsx';
import SelectExample from './SelectExample.jsx';

loader.config({ monaco });

export default function Page(props) {
    const {
        Dashboard,
        Divider,
        Panel,
        Canvas,
        useModeSwitcher,
        useMode,
        Toggle,
    } = useComponents();
    const [sample, setSample] = useSample();
    const [decorator, setDecorator] = useSampleDecorator();
    const [modelJSON, setModelJSON] = useSampleModelJSON();
    const [schemaJSON, setSchemaJSON] = useSampleSchemaJSON();
    const [formJSON, setFormJSON] = useSampleFormJSON();
    const mode = useMode();
    const switchMode = useModeSwitcher();

    console.log('Page(mode: %o)', mode);

    const onSampleChange = useCallback(
        (_event, nextValue) => {
            setSample(nextValue);
        },
        [setSample]
    );
    const onModelJSONChange = useCallback(
        (_event, nextValue) => {
            setModelJSON(nextValue);
        },
        [setModelJSON]
    );
    const onSchemaJSONChange = useCallback(
        (_event, nextValue) => {
            setSchemaJSON(nextValue);
        },
        [setSchemaJSON]
    );
    const onFormJSONChange = useCallback(
        (_event, nextValue) => {
            setFormJSON(nextValue);
        },
        [setFormJSON]
    );
    const onDecoratorChange = useCallback(
        (nextValue) => {
            setDecorator(nextValue);
        },
        [setDecorator]
    );
    const onModeChange = useCallback(
        (event, next) => {
            if (event.target.checked) {
                switchMode('light');
            } else {
                switchMode('dark');
            }
        },
        [switchMode]
    );

    return (
        <Dashboard>
            <Panel key="panel">
                <Panel.Section
                    padded
                    key="configure-example"
                    title="Configure Example"
                >
                    <SelectExample
                        key="example"
                        selected={sample}
                        decorator={decorator}
                        onChange={onSampleChange}
                    />
                    <SelectDecorator
                        key="decorator"
                        decorator={decorator}
                        onChange={onDecoratorChange}
                    />
                    <Toggle
                        key="mode"
                        title="Color Mode"
                        value={mode === 'dark' ? false : true}
                        onChange={onModeChange}
                    />
                </Panel.Section>
                <Panel.Collapse key="editors" defaultExpanded="Model">
                    <Editor
                        key="schema"
                        title="Schema"
                        value={schemaJSON}
                        onChange={onSchemaJSONChange}
                    />
                    <Editor
                        key="form"
                        title="Form"
                        value={formJSON}
                        onChange={onFormJSONChange}
                    />
                    <Editor
                        key="model"
                        title="Model"
                        value={modelJSON}
                        onChange={onModelJSONChange}
                    />
                </Panel.Collapse>
            </Panel>
            <Divider key="divider" />
            <Canvas key="canvas" title="Rendered Example">
                <RenderExample key={`render-${decorator}-${sample}`} />
            </Canvas>
        </Dashboard>
    );
}
