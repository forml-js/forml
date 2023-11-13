import { ModelContext, RenderingContext } from '@forml/context';
import { useContext as useReactContext, useMemo } from 'react';
import { createSelector } from 'reselect';
import objectPath from 'objectpath';

import { seek } from './common';
export * from './model';

/**
 * Hook to use the entire forml context
 * @return {Context}
 */
export function useContext() {
    return useReactContext(ModelContext);
}

export function useRenderingContext() {
    return useReactContext(RenderingContext);
}

/**
 * A hook to import the closest parent form's mapper
 * @return {Mapper}
 */
export function useMapper() {
    const { mapper } = useRenderingContext();
    return mapper;
}

export function useMappedField(type) {
    const mapper = useMapper();
    return mapper[type];
}

/**
 * A hook to pull in the model methods for the closest parent form
 * @return {ModelMethods}
 */
export function useModel() {
    return useContext();
}

/**
 * A hook to pull in the closest parent form's localizer
 * @return {Localizer}``
 */
export function useLocalizer() {
    const { localizer } = useRenderingContext();
    return localizer;
}

export function useLocalizedString(string) {
    const { localizer } = useRenderingContext();
    return useMemo(
        () => localizer.getLocalizedString(string),
        [localizer, string]
    );
}

/**
 * A hook to pull in the closest parent form's decorator
 * @return {Decorator}
 */
export function useDecorator() {
    const { decorator } = useRenderingContext();
    return decorator;
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
    const validate = useMemo(
        () => model.ajv.compile(attributes.schema),
        [attributes.schema]
    );

    const actions = useMemo(() => {
        const keyActions = {};
        for (let actionKey in model.actions) {
            const action = model.actions[actionKey];
            keyActions[actionKey] = (...args) => action(key, ...args);
        }
        return keyActions;
    }, [model.actions, path]);

    return useMemo(
        () => ({ ...attributes, ...actions, validate }),
        [attributes, actions, validate]
    );
}
