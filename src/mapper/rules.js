import debug from 'debug';

import * as constants from '../constants';
import {getPreferredType} from '../util';

import {stdFormObj} from './forms';

const log = debug('rjsf:mapper:rules');

export const definitions = {
    text(name, schema, options) {
        if (schema.type === 'string') {
            const f = stdFormObj(name, schema, options);
            f.type  = 'text';
            f.key   = options.path;
            return f;
        }

        return undefined;
    },
    number(name, schema, options) {
        if (schema.type === 'number') {
            const f = stdFormObj(name, schema, options);
            f.type  = 'number';
            f.key   = options.path;
            return f;
        }

        return undefined;
    },
    array(name, schema, options) {
        if (getPreferredType(schema.type) === 'array') {
            const f = stdFormObj(name, schema, options);
            f.type  = 'array';
            f.key   = options.path;

            if (schema.items !== undefined) {
                const arrPath = options.path.slice();
                arrPath.push(constants.ARRAY_PLACEHOLDER);
                const def = test(name, schema.items, {...options, path: arrPath});

                if (def) {
                    f.items = [def];
                }
            }

            return f;
        }
    },
    fieldset(name, schema, options) {
        if (getPreferredType(schema.type) === 'object') {
            const f = stdFormObj(name, schema, options);
            f.type  = 'fieldset';
            f.key   = options.path;

            if (schema.properties) {
                f.items = [];

                for (let key in schema.properties) {
                    const propertySchema = schema.properties[key];
                    const path           = options.path.slice();
                    path.push(key);
                    const def = test(null, propertySchema, {...options, path});

                    if (def) {
                        def.schema = propertySchema;
                        f.items.push(def);
                    }
                }
            }

            return f;
        }

        return undefined;
    }
};

export const rules = {
    string: [definitions.text],
    object: [definitions.fieldset],
    number: [definitions.number],
    array: [definitions.array],
};

export function test(name, schema, options) {
    const ruleSet = rules[schema.type];

    if (ruleSet) {
        for (let rule of ruleSet) {
            const result = rule(name, schema, options);

            if (result !== undefined) {
                return result;
            }
        }
    }

    return undefined;
}
