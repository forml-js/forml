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
