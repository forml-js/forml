import { getPreferredType } from '@forml/hooks/rules';
import { useCallback } from 'react';

/**
 * @namespace forml.util
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
                    for (const item of schema.items) {
                        base.push(defaultForSchema(item));
                    }
                }
                break;
            case 'object':
                const required = schema.required || [];
                base = {};
                for (const property of required) {
                    const item = defaultForSchema(schema.properties[property]);
                    base[property] = item;
                }
                break;
            case 'string':
                base = '';
                break;
            case 'number':
                base = 0.0;
                break;
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

        return assertType(schema, base);
    }
}

export function assertType(schema, value) {
    const preferred = getPreferredType(schema.type);
    const allowed = new Set(
        Array.isArray(schema.type) ? schema.type : [schema.type]
    );
    const type = getTypeOf(schema, value);

    if (allowed.has('null') && !value) {
        return null;
    } else if (preferred === 'integer') {
        if (allowed.has(type)) {
            return value;
        } else {
            if (type === 'number' && Number.isInteger(value)) return value;
            else if (type === 'number') return Math.floor(value);
            else if (value === '') return value;
            else if (value === '-') return value;
            else if (type === 'string') return parseInt(value);
            else return defaultForSchema(schema);
        }
    } else if (preferred === 'number') {
        if (allowed.has(type)) {
            return value;
        } else if (type === 'string') {
            if (value === '') return value;
            else if (value === '-') return value;
            else if (/\.$/.test(value) && !/^[^.]+\.[^.]+\.$/.test(value)) {
                return value;
            } else return parseFloat(value);
        } else {
            return defaultForSchema(schema);
        }
    } else if (preferred === 'string' && type === 'number') {
        return value.toString();
    } else if (preferred != type && value === undefined) {
        return defaultForSchema(schema);
    } else if (allowed.has(type)) {
        return value;
    } else {
        return defaultForSchema(schema);
    }
}

export function isRequired(schema, key) {
    if (schema.required) {
        return schema.required.includes(key);
    } else {
        return false;
    }
}

export function isSaturated(value) {
    if (Array.isArray(value)) {
        return value.length > 0;
    } else if (typeof value === 'object') {
        if (value === null) {
            return false;
        } else {
            return Object.keys(value).length > 0;
        }
    } else {
        return value !== undefined;
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

    for (const form of forms) {
        visit(form);

        if (form.items) traverseForm(form.items, visit);
    }
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
                return value.map(clone);
            }

            const result = Object.create(Object.getPrototypeOf(value));
            for (const key of Object.getOwnPropertyNames(value)) {
                result[key] = clone(value[key]);
            }
            for (const key of Object.getOwnPropertySymbols(value)) {
                result[key] = clone(value[key]);
            }
            return result;
        }

        default: {
            return value;
        }
    }
}

function assignRef(ref, value) {
    if (typeof ref === 'function') {
        ref(value);
    } else if (ref != null) {
        ref.current = value;
    }
    return ref;
}

export function useMergedRef(...refs) {
    return useCallback((value) => {
        refs.map((ref) => assignRef(ref, value));
    }, refs);
}

export function compose(form, key = []) {
    return {
        type: 'dynamic',
        key,
        generate: form,
    };
}
