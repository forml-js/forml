import React, { useCallback, useMemo } from 'react';
import ReactPDF from '@react-pdf/renderer';
import { SchemaForm, util } from '@forml/core';
import shortid from 'shortid';

import {
    useSample,
    useSampleModel,
    useSampleSchema,
    useSampleForm,
    useSampleMapper,
    useSampleLocalizer,
    useSampleDecorator,
} from '../samples.jsx';
import ErrorBoundary from './ErrorBoundary.jsx';

import decorators from '../decorators.js';

export default function RenderExample(props) {
    const [model, setModel] = useSampleModel();
    const [decorator] = useSampleDecorator();
    const sample = useSample();
    const schema = useSampleSchema();
    const form = useSampleForm();
    const mapper = useSampleMapper();
    const localizer = useSampleLocalizer();
    const wrapInDocument = sample != './kitchenSink.js';

    const onChange = useCallback(
        (event, nextModel) => {
            setModel(nextModel);
        },
        [setModel]
    );

    const key = useMemo(() => shortid(), [decorator]);

    let child = (
        <SchemaForm
            schema={schema}
            form={form}
            model={model}
            decorator={decorators[decorator]}
            localizer={localizer}
            onChange={onChange}
            mapper={mapper}
        />
    );
    if (decorator === 'pdf') {
        if (wrapInDocument) {
            child = (
                <ReactPDF.Document>
                    <ReactPDF.Page size="A4">{child}</ReactPDF.Page>
                </ReactPDF.Document>
            );
        }
        child = (
            <ReactPDF.PDFViewer
                key={key}
                style={{ width: '100vw', height: '100vh' }}
            >
                {child}
            </ReactPDF.PDFViewer>
        );
    }

    return <ErrorBoundary>{child}</ErrorBoundary>;
}
