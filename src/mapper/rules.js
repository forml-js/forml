import debug from 'debug';

import * as constants from '../constants';
import {stdFormObj} from '../forms';
import {getPreferredType} from '../util';

const log = debug('rjsf:mapper:rules');

export function enumToTitles(enm) {
    const titles = [];
    enm.forEach(value => {
        titles.push(getNameFromValue(value));
    });
    return titles;
}

export function getNameFromValue(value) {
    switch (typeof value) {
        case 'string':
        case 'number':
            return '' + value;
        case 'object':
            return JSON.stringify(value);
        case 'undefined':
            return 'undefined';
    }
}

export const definitions = {
    select(name, schema, options) {
        if (schema.enum) {
            const f = stdFormObj(name, schema, options);
            f.type  = 'select';


            if (!f.titles) {
                f.titles = enumToTitles(schema.enum);
            }

            return f;
        }

        return undefined;
    },
    checkbox(name, schema, options) {
        if (getPreferredType(schema.type) === 'boolean') {
            const f = stdFormObj(name, schema, options);
            f.type  = 'checkbox';
            return f;
        }

        return undefined;
    },
    text(name, schema, options) {
        if (schema.type === 'string') {
            const f = stdFormObj(name, schema, options);
            f.type  = 'text';
            return f;
        }

        return undefined;
    },
    integer(name, schema, options) {
        if (schema.type === 'integer') {
            const f = stdFormObj(name, schema, options);
            f.type  = 'integer';
            return f;
        }

        return undefined;
    },
    number(name, schema, options) {
        if (schema.type === 'number') {
            const f = stdFormObj(name, schema, options);
            f.type  = 'number';
            return f;
        }

        return undefined;
    },
    tuple(name, schema, options) {
        if (getPreferredType(schema.type) === 'array' && Array.isArray(schema.items)) {
            const f = stdFormObj(name, schema, options);
            f.type  = 'tuple';

            f.items = [];
            schema.items.forEach(function(item, index) {
                const arrPath = options.path.slice();
                arrPath.push(index);

                const name = `${schema.title} #${index + 1}`;
                const def = test(name, item, {...options, path: arrPath});

                if (def)
                    f.items.push(def);
            });

            return f;
        }
    },
    array(name, schema, options) {
        if (getPreferredType(schema.type) === 'array') {
            const f = stdFormObj(name, schema, options);
            f.type  = 'array';

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
    },
    null(name, schema, options) {
        if (getPreferredType(schema.type) === 'null') {
            const f = stdFormObj(name, schema, options);
            f.type  = 'null';
            return f;
        }
    }
};

export const rules = {
    string: [definitions.select, definitions.text],
    object: [definitions.fieldset],
    number: [definitions.number],
    integer: [definitions.integer],
    boolean: [definitions.checkbox],
    array: [definitions.tuple, definitions.array],
    null: [definitions.null],
};

export function test(name, schema, options) {
    const ruleSet = rules[getPreferredType(schema.type)];

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
