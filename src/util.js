import Ajv from 'ajv';
import debug from 'debug';
import objectPath from 'objectpath';
import { useMemo } from 'react';

const log = debug('rjsf:util');

/**
 * @namespace rjsf.util
 */

/**
 * @typedef {Function} ValueGetter
 * @param {Array<string|number>} keys - Object path to get
 * @return {*} - The value found at keys
 * @description Searches the enclosed model along the path of keys
 */

/**
 * @typedef {Function} ValueSetter
 * @param {Array<string|number>} keys - Object path to set
 * @param {*} value - Value to set at keys
 * @return {*} - The new model
 * @description Updates the enclosed model with value along the path of keys
 */

/**
 * Returns a default value for schema. If the schema defines a default value,
 * that will be returned. If no default is specified, an "empty" value of the
 * specified type will be returned.
 * @param {object} schema
 * @return {*}
 */
export function defaultForSchema(schema) {
    if (schema.default !== undefined) {
        return schema.default;
    }

    return buildSchema(schema);

    function buildSchema(schema) {
        const type = getPreferredType(schema.type);
        let base = undefined;
        switch (type) {
            case 'array':
                base = [];
                if (Array.isArray(schema.items)) {
                    for (let item of schema.items) {
                        base.push(defaultForSchema(item));
                    }
                }
                break;
            case 'object':
                base = {};
                for (let property in schema.properties) {
                    let item = defaultForSchema(schema.properties[property]);
                    base[property] = item;
                }
                break;
            case 'string':
                base = '';
                break;
            case 'number':
            case 'integer':
                base = 0;
                break;
            case 'boolean':
                base = false;
                break;
            case 'null':
                base = null;
                break;
            default:
                // throw new Error(`Unhandled defaultForSchema type: ${type}`);
                base = undefined;
        }

        return base;
    }
}

/**
 * Return the first type from a type list
 * @arg {string[]} types
 */
export function getPreferredType(types) {
    const ignoredTypes = new Set(['null']);

    let index = 0;

    if (!Array.isArray(types)) return types;

    // Skip ignored types
    while (ignoredTypes.has(types[index])) index++;

    // If we've run past the end, just use the first type
    if (index >= types.length) index = 0;

    return types[index];
}

/**
 * @arg {*} model
 * @arg {object} schema
 * @return {ValueGetter}
 */
export function valueGetter(model, schema) {
    function get(keys) {
        if (!Array.isArray(keys)) {
            keys = [keys];
        }

        if (model === undefined) {
            model = defaultForSchema(schema);
        }

        if (keys.length === 0) return model;

        let current = model;
        let currentSchema = schema;

        for (let i = 0; i < keys.length; ++i) {
            const key = keys[i];
            currentSchema = getNextSchema(currentSchema, key);
            current = getNextValue(currentSchema, current, key);
        }

        return assertType(currentSchema, current);
    }

    return get;
}

export function assertType(schema, value) {
    let preferred = getPreferredType(schema.type);
    let allowed = new Set(
        Array.isArray(schema.type) ? schema.type : [schema.type]
    );
    let type = getTypeOf(schema, value);

    if (allowed.has('null') && !value) return null;
    else if (preferred != type && !value) return defaultForSchema(schema);
    else if (allowed.has(type)) return value;
    else return defaultForSchema(schema);
}

/**
 * @arg {object} errors - Existing errors
 * @arg {Function} setErrors - Method to call when updating errors
 * @return {Function}
 */
export function errorSetter(errors, setErrors) {
    return function (keys, error) {
        const key = objectPath.stringify(keys);
        const newErrors = { ...errors, [key]: error };
        setErrors(newErrors);
        return newErrors;
    };
}

/**
 * @arg {object} errors - Map of object path to error
 * @return {Function}
 */
export function errorGetter(errors) {
    return function (keys) {
        const key = objectPath.stringify(keys);
        return errors[key];
    };
}

/**
 * Walk a key path along a schema tree and model, updating the model according
 * to the schema along the way, until reaching the final key, whereupon we set
 * the supplied value. Returns the updated model or value set.
 * @arg {Array<string|number>} keys - The object path to walk
 * @arg {*} model - The model to update
 * @arg {object} schema - The schema definition for the model
 * @arg {*} value - The final value to write
 * @arg {number} depth - The current depth of recursion
 * @return {*}
 */
function updateAndClone(keys, model, schema, value, depth = 0) {
    if (keys.length === 0) {
        log('updateAndClone() %s> %O', '-'.repeat(depth), model);
        log('updateAndClone() <%s %O', '-'.repeat(depth), value);
        return value;
    }

    log('updateAndClone() %s> %o', '-'.repeat(depth), model);

    const [next, ...rest] = keys;
    const nextSchema = getNextSchema(schema, next);
    const nextModel = updateAndClone(
        rest,
        getNextValue(nextSchema, model, next),
        nextSchema,
        value,
        depth + 1
    );

    if (getPreferredType(schema.type) === 'array') {
        const firstSlice = model.slice(0, next);
        const lastSlice = model.slice(next + 1);

        while (firstSlice.length < next) {
            firstSlice.push(
                defaultForSchema(getNextSchema(schema, firstSlice.length))
            );
        }

        const result = [...firstSlice, nextModel, ...lastSlice];
        log('updateAndClone() <%s %o', '-'.repeat(depth), result);
        return result;
    }

    if (getPreferredType(schema.type) === 'object') {
        const result = { ...model, [next]: nextModel };
        log('updateAndClone() <%s %o', '-'.repeat(depth), result);
        return result;
    }

    throw new Error('Bad ObjectPath');
}

/**
 * Set a value using a hook setter
 * @arg {*} model
 * @arg {object} schema
 * @arg {Function} setModel
 */
export function valueSetter(model, schema) {
    function set(keys, value) {
        if (!Array.isArray(keys)) {
            keys = [keys];
        }

        if (model === undefined) {
            model = defaultForSchema(schema);
        }

        const newModel = updateAndClone(keys, model, schema, value);
        return assertType(schema, newModel);
    }

    return set;
}

/**
 * Walk the schema along the path of keys and return the last entry visited
 * @arg {Array<string|number>} keys
 * @arg {object} schema
 * @return {object}
 */
export function findSchema(keys, schema) {
    if (keys.length === 0) return schema;

    for (let i = 0; i < keys.length; ++i) {
        const key = keys[i];
        schema = getNextSchema(schema, key);
    }

    return schema;
}

/**
 * Return the child schema defined by key in this schema
 * @arg {object} schema
 * @arg {string|number} key
 */
export function getNextSchema(schema, key) {
    if (schema.type === 'array') {
        if (Array.isArray(schema.items)) {
            return schema.items[key];
        }
        return schema.items;
    }

    if (schema.type === 'object') {
        if (key in schema.properties) {
            return schema.properties[key];
        }

        if (schema.additionalProperties) {
            return schema.additionalProperties;
        }
    }
}

/**
 * Return the child model defined by key in this model, or if it is undefined
 * the default value for the schema.
 * @arg {object} schema
 * @arg {*} value
 * @arg {string|number} key
 */
export function getNextValue(schema, value, key) {
    if (!value) return defaultForSchema(schema);

    if (value[key] === undefined) {
        return defaultForSchema(schema);
    }

    return assertType(schema, value[key]);
}

export function getTypeOf(schema, value) {
    if (value === undefined) return getPreferredType(schema.type);
    else if (value === null) return 'null';
    else if (Array.isArray(value)) return 'array';
    else return typeof value;
}

/**
 * Invoke a function for every form in forms
 * @arg {object[]} forms - The forms tree to visit
 * @arg {Function} visitor - The visitor function to invoke
 */
export function traverseForm(forms, visit) {
    if (!Array.isArray(forms)) forms = [forms];

    for (let form of forms) {
        visit(form);

        if (form.items) traverseForm(form.items, visit);
    }
}

/**
 * A hook that uses a memoized Ajv instance and a compiled version of the schema
 * to produce a validate function.
 * @arg object schema - The schema to compile for validation
 */
const ajv = new Ajv({ allErrors: true });
export function useValidator(schema) {
    const compiled = useMemo(() => {
        try {
            const validator = ajv.compile(schema);
            return validator;
        } catch (err) {
            const validator = () => false;
            validator.errors = [{ dataPath: '.', message: 'invalid schema' }];
            return validator;
        }
    }, [schema]);

    function validate(model) {
        const valid = compiled(model);
        const { errors } = compiled;
        return { valid, errors };
    }

    return validate;
}

/**
 * A copy of clone that works on ES6 modules. Does not actually clone
 * primitives.
 * @arg * value - The value to clone
 */
export function clone(value) {
    switch (typeof value) {
        case 'string':
        case 'number':
        case 'boolean':
        case 'undefined': {
            return value;
        }

        case 'object': {
            if (Array.isArray(value)) {
                return value.map((item) => clone(item));
            }

            let result = {};
            for (let key in value) {
                result[key] = clone(value[key]);
            }
            return result;
        }

        default: {
            return value;
        }
    }
}
