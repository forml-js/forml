import { loader } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useComponents } from '../hooks/useComponents';
import {
    useSample,
    useSampleModel,
    useSampleModelJSON,
    useSampleSchemaJSON,
    useSampleFormJSON,
    useSampleMapper,
    useSampleLocalizer,
    useSampleDecorator,
} from '../samples';
import Editor from './Editor';
import RenderExample from './RenderExample';
import SelectDecorator from './SelectDecorator';
import SelectExample from './SelectExample';

loader.config({ monaco });

export default function Page(props) {
    const { Dashboard, Divider, Panel, Canvas } = useComponents();
    const [sample, setSample] = useSample();
    const [decorator, setDecorator] = useSampleDecorator();
    const [modelJSON, setModelJSON] = useSampleModelJSON();
    const [schemaJSON, setSchemaJSON] = useSampleSchemaJSON();
    const [formJSON, setFormJSON] = useSampleFormJSON();

    const onSampleChange = useCallback((_event, nextValue) => {
        setSample(nextValue);
    });
    const onModelJSONChange = useCallback((_event, nextValue) => {
        setModelJSON(nextValue);
    });
    const onSchemaJSONChange = useCallback((_event, nextValue) => {
        setSchemaJSON(nextValue);
    });
    const onFormJSONChange = useCallback((_event, nextValue) => {
        setFormJSON(nextValue);
    });
    const onDecoratorChange = useCallback((nextValue) => {
        setDecorator(nextValue);
    });

    return (
        <Dashboard>
            <Panel key="panel">
                <Panel.Section
                    padded
                    key="configure-example"
                    title="Configure Example"
                >
                    <SelectExample
                        selected={sample}
                        decorator={decorator}
                        onChange={onSampleChange}
                    />
                    <SelectDecorator
                        decorator={decorator}
                        onChange={onDecoratorChange}
                    />
                </Panel.Section>
                <Panel.Collapse defaultExpanded="Model">
                    <Editor
                        key="editor"
                        title="Schema"
                        value={schemaJSON}
                        onChange={onSchemaJSONChange}
                    />
                    <Editor
                        key="editor"
                        title="Form"
                        value={formJSON}
                        onChange={onFormJSONChange}
                    />
                    <Editor
                        key="editor"
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
