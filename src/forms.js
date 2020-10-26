import debug from 'debug';
import ObjectPath from 'objectpath';

import { ARRAY_PLACEHOLDER } from './constants';
import { test } from './rules';
import { findSchema } from './util';

const log = debug('rjsf:forms');

export function getDefaults(schema) {
    const form = [];
    const lookup = {};

    form.push(test(schema, { path: [], lookup }));

    return { form, lookup };
}

export function merge(schema, form = ['*'], options = {}) {
    if (!schema)
        return [];
    if (!form)
        return [];

    const stdForm = getDefaults(schema);

    const idx = form.indexOf('*');
    if (idx !== -1) {
        form = form.slice(0, idx).concat(stdForm.form).concat(form.slice(idx + 1));
    }

    const { lookup } = stdForm;
    form = form.map(obj => {
        if (obj === undefined) {
            return;
        }

        if (typeof obj === 'function') {
            return;
        }

        if (typeof obj === 'string') {
            obj = { key: obj };
        }

        if (typeof obj.key === 'string') {
            obj.key = ObjectPath.parse(obj.key);
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
            obj.items = merge(schema, obj.items, options);
        }

        if (Array.isArray(obj.tabs)) {
            for (let tab of obj.tabs) {
                tab.items = merge(schema, tab.items, options);
            }
        }

        if (obj.titles && !obj.titleMap) {
            const values = obj.schema.enum || obj.schema.items.enum;
            obj.titleMap = obj.titles.map((name, index) => {
                const value = values[index];
                return { name, value };
            });
        }


        return obj;
    });


    return form;
}

export function stdFormObj(schema, options = {}) {
    const f = {};

    f.title = schema.title || name;
    f.key = options.path.slice();

    if (options.lookup) {
        const strid = ObjectPath.stringify(f.key);
        options.lookup[strid] = f;
    }

    if (schema.description) {
        f.description = schema.description;
    }
    if (options.required === true || schema.required === true) {
        f.required = true;
    }
    if (schema.maxLength) {
        f.maxlength = schema.maxLength;
    }
    if (schema.minLength) {
        f.minlength = schema.minLength;
    }
    if (schema.readOnly || schema.readonly) {
        f.readonly = true;
    }
    if (schema.minimum) {
        f.minimum = schema.minimum + (schema.exclusiveMinimum ? 1 : 0);
    }
    if (schema.maximum) {
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
