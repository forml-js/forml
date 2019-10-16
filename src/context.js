import {createContext, useContext} from 'react';
import {defaultDecorator} from './components/decorator';
import {defaultMapper} from './components/mapper';
import {defaultLocalizer} from './localizer';

/**
 * @typedef {Object} ModelMethods
 * @property {function} getValue - Retrieve a value from the model
 * @property {function} setValue - Update a value in the model
 * @property {function} getError - Retrieve a validation error from the model
 * @property {function} onChange - The callback to use when an event triggers
 * a change in the model.
 */

const context = createContext({
    mapper: defaultMapper(),
    decorator: defaultDecorator(),
    localizer: defaultLocalizer(),
});

export default context;

/**
 * A hook to import the closest parent form's mapper
 * @return {Mapper}
 */
export function useMapper() {
    const ctx = useContext(context);
    return ctx.mapper;
}


/**
 * A hook to pull in the model methods for the closest parent form
 * @return {ModelMethods}
 */
export function useModel() {
    const {getValue, setValue, getError, setError, onChange} = useContext(context);
    return {getValue, setValue, getError, setError, onChange};
}

/**
 * A hook to pull in the closest parent form's localizer
 * @return {Localizer}``
 */
export function useLocalizer() {
    const {localizer} = useContext(context);
    return localizer;
}

/**
 * A hook to pull in the closest parent form's decorator
 * @return {Decorator}
 */
export function useDecorator() {
    const {decorator} = useContext(context);
    return decorator;
}
