import React, { createContext, useContext, useRef } from 'react';
import debug from 'debug';
import { createStore, useStore } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
const log = debug('forml:example:samples');

const DEFAULT_SAMPLE = '../data/pages.js';
const DEFAULT_DECORATOR = 'Mantine (Filled)';

export const samples = import.meta.glob('../data/*', { eager: true });

const defaultSample = { schema: { type: 'null' }, form: ['*'] };
export function getSample(name) {
    const sample = samples[name] ?? defaultSample;
    log('getSample() -> %o', sample);
    return sample;
}

export const SampleContext = createContext(null);
export function useSampleStore() {
    return useContext(SampleContext);
}

const createSampleStore = createStore(function (set) {
    const sample = getSample(DEFAULT_SAMPLE);
    const schema = sample.schema ?? { type: 'null' };
    const form = sample.form ?? ['*'];
    const model = sample.model ?? null;
    const localizer = sample.localizer ?? null;
    return {
        sample: DEFAULT_SAMPLE,
        decorator: DEFAULT_DECORATOR,
        mapper: null,
        localizer,
        schema: {
            setJSON(json) {
                set((state) => ({
                    ...state,
                    schema: {
                        ...state.schema,
                        value: JSON.parse(json),
                        json: json,
                    },
                }));
            },
            setValue(value) {
                set((state) => ({
                    ...state,
                    schema: {
                        ...state.schema,
                        value,
                        json: JSON.stringify(value, undefined, 2),
                    },
                }));
            },
            value: schema,
            json: JSON.stringify(schema, undefined, 2),
        },
        form: {
            setJSON(json) {
                set((state) => ({
                    ...state,
                    form: {
                        ...state.form,
                        value: JSON.parse(json),
                        json: json,
                    },
                }));
            },
            setValue(value) {
                set((state) => ({
                    ...state,
                    form: {
                        ...state.form,
                        value,
                        json: JSON.stringify(value, undefined, 2),
                    },
                }));
            },
            value: form,
            json: JSON.stringify(form, undefined, 2),
        },
        mode: 'dark',
        setMode(mode) {
            set((state) => ({ ...state, mode }));
        },
        model: {
            setJSON(json) {
                set((state) => ({
                    ...state,
                    model: {
                        ...state.model,
                        value: JSON.parse(json),
                        json: json,
                    },
                }));
            },
            setValue(value) {
                set((state) => ({
                    ...state,
                    model: {
                        ...state.model,
                        value,
                        json: JSON.stringify(value, undefined, 2),
                    },
                }));
            },
            value: model,
            json: JSON.stringify(model, undefined, 2),
        },
        setSample(sample) {
            const { schema, form, model, localizer } = getSample(sample);
            set((state) => ({
                ...state,
                sample,
                localizer: localizer ?? null,
                schema: {
                    ...state.schema,
                    value: schema,
                    json: JSON.stringify(schema, undefined, 2),
                },
                form: {
                    ...state.form,
                    value: form,
                    json: JSON.stringify(form, undefined, 2),
                },
                model: {
                    ...state.model,
                    value: model,
                    json: JSON.stringify(model, undefined, 2),
                },
            }));
        },
        setDecorator: (decorator) => set({ decorator }),
    };
});

export function SampleProvider(props) {
    const store = useRef(createSampleStore).current;
    return (
        <SampleContext.Provider value={store}>
            {props.children}
        </SampleContext.Provider>
    );
}

export function useSample() {
    return useStore(
        useSampleStore(),
        useShallow((store) => [store.sample, store.setSample])
    );
}

export function useSampleModel() {
    return useStore(
        useSampleStore(),
        useShallow((store) => [store.model.value, store.model.setValue])
    );
}

export function useSampleModelJSON() {
    return useStore(
        useSampleStore(),
        useShallow((store) => [store.model.json, store.model.setJSON])
    );
}

export function useSampleSchemaJSON() {
    return useStore(
        useSampleStore(),
        useShallow((store) => [store.schema.json, store.schema.setJSON])
    );
}

export function useSampleFormJSON() {
    return useStore(
        useSampleStore(),
        useShallow((store) => [store.form.json, store.form.setJSON])
    );
}

export function useSampleDecorator() {
    return useStore(
        useSampleStore(),
        useShallow((store) => [store.decorator, store.setDecorator])
    );
}

export function useSampleMapper() {
    return useStore(
        useSampleStore(),
        useShallow((store) => store.mapper)
    );
}

export function useSampleLocalizer() {
    return useStore(
        useSampleStore(),
        useShallow((store) => store.localizer)
    );
}

export function useSampleSchema() {
    return useStore(
        useSampleStore(),
        useShallow((store) => store.schema.value)
    );
}

export function useSampleForm() {
    return useStore(
        useSampleStore(),
        useShallow((store) => store.form.value)
    );
}
