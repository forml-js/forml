import ObjectPath from 'objectpath';
import { useMemo } from 'react';

import { ARRAY_PLACEHOLDER } from '#constants';
import { useLocalizer } from '#renderer';
import { test } from '#rules';

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
        schema = findNextSchema(schema, key);
    }

    return schema;
}

/**
 * Return the child schema defined by key in this schema
 * @arg {object} schema
 * @arg {string|number} key
 */
export function findNextSchema(schema, key) {
    if (schema.type === 'array') {
        if (Array.isArray(schema.items)) {
            return schema.items[key];
        } else {
            return schema.items;
        }
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

export function getDefaults(schema) {
    const form = [];
    const lookup = {};

    form.push(test(schema, { path: [], lookup }));

    return { form, lookup };
}

export function merge(schema, form = ['*'], options = {}) {
    if (!schema) return [];
    if (!form) return [];

    const stdForm = getDefaults(schema);
    const { localize } = options;

    const idx = form.indexOf('*');
    if (idx !== -1) {
        form = form
            .slice(0, idx)
            .concat(stdForm.form)
            .concat(form.slice(idx + 1));
    }

    const { lookup } = stdForm;
    form = form.reduce((acc, obj) => {
        if (obj === undefined || obj === null || obj === false || obj === 0) {
            return acc;
        }

        if (typeof obj === 'function') {
            acc.push(obj);
            return acc;
        }

        if (typeof obj === 'string') {
            obj = { key: obj };
        }

        if (typeof obj.key === 'string') {
            obj.key = ObjectPath.parse(obj.key);
        }

        if (options.prefix) {
            obj.key = options.prefix.concat(obj.key);
        }

        if (options.readonly) {
            obj.readonly = obj.readonly ?? true;
        }

        if (obj.key) {
            while (obj.key.includes('')) {
                obj.key[obj.key.indexOf('')] = ARRAY_PLACEHOLDER;
            }
        }

        if (obj.key) {
            obj.schema = findSchema(obj.key, schema);

            const strid = ObjectPath.stringify(obj.key);
            if (lookup[strid]) {
                obj = { ...lookup[strid], ...obj };
            }
        }

        if (Array.isArray(obj.items)) {
            const readonly =
                options.readonly ??
                obj.readonly ??
                obj.schema?.readOnly ??
                false;
            obj.items = merge(schema, obj.items, { ...options, readonly });
        }

        if (Array.isArray(obj.tabs)) {
            obj.tabs = merge(schema, obj.tabs, { ...options });
        }

        if (obj.titles && !obj.titleMap) {
            const values = obj.schema.enum || obj.schema.items.enum;
            obj.titleMap = obj.titles.map((name, index) => {
                const value = values[index];
                name = localize ? localize(name) : name;
                return { name, value };
            });
        }

        if (localize) {
            if (obj.title) obj.title = localize(obj.title);
            if (obj.description) obj.description = localize(obj.description);
            if (obj.placeholder) obj.placeholder = localize(obj.placeholder);
            if (obj.titleFun && !options.localize?.skipTitleFun) {
                const originalTitleFun = obj.titleFun;
                obj.titleFun = (value) => localize(originalTitleFun(value));
            }
            if (obj.type === 'array' && !obj.addText) {
                if (obj.title) {
                    obj.addText = `${localize('Add')} ${obj.title}`;
                } else {
                    obj.addText = localize('Add');
                }
            } else if (obj.addText) {
                obj.addText = localize(obj.addText);
            }
        } else {
            if (obj.type === 'array' && !obj.addText) {
                if (obj.title) {
                    obj.addText = `Add ${obj.title}`;
                } else {
                    obj.addText = 'Add';
                }
            }
        }

        acc.push(obj);
        return acc;
    }, []);

    return form;
}

export function standardForm(schema, options) {
    const f = {};

    f.key = Array.from(options.path);

    if ('title' in schema) {
        f.title = schema.title;
    }

    if (options.lookup) {
        const strid = ObjectPath.stringify(f.key);
        options.lookup[strid] = f;
    }

    if (schema.description) {
        f.description = schema.description;
    }

    if ('required' in schema) {
        f.required = options.required = schema.required;
    } else if ('required' in options) {
        f.required = options.required;
    }

    if (schema.maxLength) {
        f.maxLength = schema.maxLength;
    }
    if (schema.minLength) {
        f.minLength = schema.minLength;
    }

    if ('readOnly' in schema) {
        f.readonly = schema.readOnly;
    } else if ('readonly' in schema) {
        f.readonly = schema.readonly;
    } else if ('readonly' in options) {
        f.readonly = options.readonly;
    }

    if ('minimum' in schema) {
        f.minimum = schema.minimum + (schema.exclusiveMinimum ? 1 : 0);
    }
    if ('maximum' in schema) {
        f.maximum = schema.maximum - (schema.exclusiveMaximum ? 1 : 0);
    }

    // Non standard attributes (DONT USE DEPRECATED)
    // If you must set stuff like this in the schema use the x-schema-form attribute
    if (schema.validationMessage) {
        f.validationMessage = schema.validationMessage;
    }

    f.schema = schema;

    return f;
}

export function useMerged(schema, form, options) {
    options = useMemo(() => options ?? {}, [options]);
    const localize = useLocalizer();
    return useMemo(() => {
        return merge(schema, form, { ...options, localize });
    }, [form, schema, options, localize]);
}
