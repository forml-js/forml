import { createContext, useContext as useReactContext } from 'react';

/**
 * @typedef {Object} ModelMethods
 * @property {function} getValue - Retrieve a value from the model
 * @property {function} setValue - Update a value in the model
 * @property {function} getError - Retrieve a validation error from the model
 * @property {function} onChange - The callback to use when an event triggers
 * a change in the model.
 */

const context = createContext({
    mapper: {},
    decorator: {},
    localizer: {},
    version: 0,
});

export default context;

export function useContext() {
    return useReactContext(context);
}

/**
 * A hook to import the closest parent form's mapper
 * @return {Mapper}
 */
export function useMapper() {
    const ctx = useContext();
    return ctx.mapper;
}


/**
 * A hook to pull in the model methods for the closest parent form
 * @return {ModelMethods}
 */
export function useModel() {
    const { getValue, setValue, getError, setError, onChange, version } = useContext();
    return { getValue, setValue, getError, setError, onChange, version };
}

/**
 * A hook to pull in the closest parent form's localizer
 * @return {Localizer}``
 */
export function useLocalizer() {
    const { localizer } = useContext();
    return localizer;
}

/**
 * A hook to pull in the closest parent form's decorator
 * @return {Decorator}
 */
export function useDecorator() {
    const { decorator } = useContext();
    return decorator;
}
