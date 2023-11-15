import { ModelContext } from '@forml/context';
import AJV from 'ajv';
import debug from 'debug';
import objectPath from 'objectpath';
import { useMemo, useContext as useReactContext, useReducer } from 'react';
import { createSelector } from 'reselect';

import {
    assertType,
    defaultForSchema,
    getNextSchema,
    modelDrop,
    seek,
    unwind,
} from './common';
import { createAction, createReducer } from './reducer';

const log = debug('forml:hooks:model');

/**
 * Hook to use the entire forml context
 * @return {Context}
 */
export function useContext() {
    return useReactContext(ModelContext);
}

/**
 * A hook to pull in the model methods for the closest parent form
 * @return {ModelMethods}
 */
export function useModel() {
    return useContext();
}

export const setValue = createAction('value/set', (key, value) => ({
    key,
    value,
}));
export const removeValue = createAction('value/remove', (key) => ({ key }));
export const appendArray = createAction('value/array/append', (key) => ({
    key,
}));
export const removeArray = createAction('value/array/remove', (key, index) => ({
    key,
    index,
}));
export const moveArray = createAction('value/array/move', (key, from, to) => ({
    key,
    from,
    to,
}));
export const moveArrayUp = (key, index) => moveArray(key, index, index - 1);
export const moveArrayDown = (key, index) => moveArray(key, index, index + 1);

const reducer = createReducer((builder) => {
    builder.addCase(setValue, (state, action) => {
        const { key, value } = action.payload;
        const stack = [];
        const [currentKey, currentModel, currentSchema] = seek(
            state.schema,
            key,
            state.model,
            stack
        );
        const final = unwind(currentSchema, currentKey, value, stack);
        return {
            ...state,
            model: final,
        };
    });
    builder.addCase(removeValue, (state, action) => {
        const { key } = action.payload;
        const stack = [];
        const [currentKey, currentModel, currentSchema] = seek(
            state.schema,
            key,
            state.model,
            stack
        );
        return {
            ...state,
            model: unwind(currentSchema, currentKey, currentModel, stack, 1),
        };
    });
    builder.addCase(appendArray, (state, action) => {
        const { key, value } = action.payload;
        const stack = [];
        const [currentKey, currentModel, currentSchema] = seek(
            state.schema,
            key,
            state.model,
            stack
        );
        const parentModel = currentModel ?? defaultForSchema(currentSchema);
        stack.push([currentKey, parentModel, currentSchema]);

        const itemKey = parentModel.length;
        const itemSchema = getNextSchema(currentSchema, itemKey);
        const itemModel = assertType(itemSchema, value);

        return {
            ...state,
            model: unwind(itemSchema, itemKey, itemModel, stack),
        };
    });
    builder.addCase(removeArray, (state, action) => {
        const { key, index } = action.payload;
        const stack = [];
        const [currentKey, currentModel, currentSchema] = seek(
            state.schema,
            key,
            state.model,
            stack
        );
        return {
            ...state,
            model: unwind(
                currentSchema,
                currentKey,
                modelDrop(currentSchema, currentModel, index),
                stack
            ),
        };
    });
    builder.addCase(moveArray, (state, action) => {
        const { key, from, to } = action.payload;
        const stack = [];
        const [currentKey, currentModel, currentSchema] = seek(
            state.schema,
            key,
            state.model,
            stack
        );
        const nextModel = currentModel
            ? Array.from(currentModel)
            : defaultForSchema(currentSchema);
        const [removed] = nextModel.splice(from, 1);
        nextModel.splice(to, 0, removed);
        return {
            ...state,
            model: unwind(currentSchema, currentKey, nextModel, stack),
        };
    });
    builder.addDefaultCase((state, action) => {
        return state;
    });
});
export function useModelReducer(schema, model = undefined) {
    const initialState = useMemo(
        () => ({ schema, model: assertType(schema, model) }),
        [schema, model]
    );
    const [state, dispatch] = useReducer(reducer, initialState);

    const actions = useMemo(
        () => ({
            setValue: (key, value) => dispatch(setValue(key, value)),
            removeValue: (key) => dispatch(removeValue(key)),
            appendArray: (key, value) => dispatch(appendArray(key, value)),
            removeArray: (key, index) => dispatch(removeArray(key, index)),
            moveArray: (key, from, to) => dispatch(moveArray(key, from, to)),
            moveArrayUp: (key, index) => dispatch(moveArrayUp(key, index)),
            moveArrayDown: (key, index) => dispatch(moveArrayDown(key, index)),
        }),
        [dispatch]
    );

    const ajv = useMemo(() => new AJV({ allErrors: true, strict: false }), []);

    return useMemo(() => ({ state, actions, ajv }), [state, actions]);
}

function selectModel(state) {
    return state.model;
}

function selectSchema(state) {
    return state.schema;
}

export function useSelector(selector) {
    const context = useContext();
    return selector(context.state);
}
export function useValue(key) {
    const path = useMemo(() => objectPath.stringify(key), [key]);
    const modelSelector = useMemo(
        () =>
            createSelector(selectModel, selectSchema, (model, schema) => {
                const [_currentKey, currentModel] = seek(
                    schema,
                    key,
                    model,
                    []
                );
                return currentModel;
            }),
        [path]
    );

    return useSelector(modelSelector);
}
export function useKey(key) {
    const path = useMemo(() => objectPath.stringify(key), [key]);
    const keySelector = useMemo(
        () =>
            createSelector(selectModel, selectSchema, (model, schema) => {
                const [_currentKey, currentModel, currentSchema] = seek(
                    schema,
                    key,
                    model,
                    []
                );

                return {
                    model: currentModel,
                    schema: currentSchema,
                };
            }),
        [path]
    );

    const model = useModel();
    const attributes = useSelector(keySelector);
    //const validate = useMemo(
    //    () => model.ajv.compile(attributes.schema),
    //    [attributes.schema]
    //);

    const actions = useMemo(() => {
        const keyActions = {};
        for (let actionKey in model.actions) {
            const action = model.actions[actionKey];
            keyActions[actionKey] = (...args) => action(key, ...args);
        }
        return keyActions;
    }, [model.actions, path]);

    return useMemo(
        () => ({ ...attributes, actions, path /*, validate*/ }),
        [attributes, actions, path /*validate*/]
    );
}
