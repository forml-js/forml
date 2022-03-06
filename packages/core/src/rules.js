import * as constants from './constants';
import { standardForm } from './forms';
import { getPreferredType } from './util';

/**
 * @param {Array<*>} enm - The enumeration values to produce titles for
 * @return {Array<string>}
 */
export function enumToTitles(enm) {
    const titles = [];
    enm.forEach((value) => {
        titles.push(getNameFromValue(value));
    });
    return titles;
}

/**
 * @param {*} value - The value to convert to represent as a string
 * @return {string}
 */
export function getNameFromValue(value) {
    switch (typeof value) {
        case 'string':
        case 'number':
            return '' + value;
        case 'object':
            return JSON.stringify(value);
        case 'undefined':
            return 'undefined';
        default:
            return value.toString();
    }
}

/**
 * @typedef FormDefinition
 * @param {string} type - The type of field to be rendered for this form
 * @param {(string|Array<string>)} key - The key path this form renders relative
 * to the schema
 */
export const definitions = {
    /**
     * Catch any date-formatted strings
     * @return {FormDefinition}
     */
    date(schema, options) {
        if (
            getPreferredType(schema.type) === 'string' &&
            schema.format === 'date'
        ) {
            const f = standardForm(schema, options);
            f.type = 'date';
            return f;
        }
    },
    /**
     * Catch any date-time formatted strings
     * @return {FormDefiniton}
     */
    datetime(schema, options) {
        if (
            getPreferredType(schema.type) === 'string' &&
            schema.format === 'date-time'
        ) {
            const f = standardForm(schema, options);
            f.type = 'datetime';
            return f;
        }
    },
    /**
     * Catch any enumerations in the schema
     * @return {FormDefinition}
     */
    select(schema, options) {
        if (schema.enum) {
            const f = standardForm(schema, options);
            f.type = 'select';

            if (schema.enumNames) {
                f.titles = schema.enumNames;
            }

            if (!f.titles) {
                f.titles = enumToTitles(schema.enum);
            }

            return f;
        }

        return undefined;
    },
    /**
     * Defines boolean forms
     * @return {FormDefinition}
     */
    checkbox(schema, options) {
        if (getPreferredType(schema.type) === 'boolean') {
            const f = standardForm(schema, options);
            f.type = 'checkbox';
            return f;
        }

        return undefined;
    },
    /**
     * Defines basic string forms
     * @return {FormDefinition}
     */
    text(schema, options) {
        if (getPreferredType(schema.type) === 'string') {
            const f = standardForm(schema, options);
            f.type = 'text';
            return f;
        }

        return undefined;
    },

    /**
     * Defines basic integer forms
     * @return {FormDefinition}
     */
    integer(schema, options) {
        if (getPreferredType(schema.type) === 'integer') {
            const f = standardForm(schema, options);
            f.type = 'integer';
            return f;
        }

        return undefined;
    },
    /**
     * Defines complex mutliselect forms
     */
    multiselect(schema, options) {
        if (getPreferredType(schema.type) === 'array') {
            if (typeof schema.items === 'object' && schema.items.enum) {
                if (schema.uniqueItems === true) {
                    const f = standardForm(schema, options);
                    f.type = 'multiselect';

                    if (schema.items.enumNames) {
                        f.titles = schema.items.enumNames;
                    }

                    if (!f.titles) {
                        f.titles = enumToTitles(schema.items.enum);
                    }

                    return f;
                }
            }
        }

        return undefined;
    },
    /**
     * Defines basic number forms
     * @return {FormDefinition}
     */
    number(schema, options) {
        if (getPreferredType(schema.type) === 'number') {
            const f = standardForm(schema, options);
            f.type = 'number';
            return f;
        }

        return undefined;
    },
    /**
     * Defines forms for schemas that describe tuples
     * @return {FormDefinition}
     */
    tuple(schema, options) {
        if (
            getPreferredType(schema.type) === 'array' &&
            Array.isArray(schema.items)
        ) {
            const f = standardForm(schema, options);
            f.type = 'tuple';

            f.items = [];
            schema.items.forEach(function (item, index) {
                const arrPath = options.path.slice();
                arrPath.push(index);

                const def = test(item, { ...options, path: arrPath });

                if (def) f.items.push(def);
            });

            return f;
        }
    },
    /**
     * Defines forms for schemas that describe lists
     * @return {FormDefinition}
     */
    array(schema, options) {
        if (
            getPreferredType(schema.type) === 'array' &&
            !Array.isArray(schema.items)
        ) {
            const f = standardForm(schema, options);
            f.type = 'array';

            if (schema.items !== undefined) {
                const arrPath = options.path.slice();
                arrPath.push(constants.ARRAY_PLACEHOLDER);
                const def = test(schema.items, { ...options, path: arrPath });

                if (def) {
                    f.items = [def];
                }
            }

            return f;
        }
    },
    /**
     * Define forms for object types
     * @return {FormDefinition}
     */
    fieldset(schema, options) {
        if (getPreferredType(schema.type) === 'object') {
            const f = standardForm(schema, options);
            f.type = 'fieldset';

            if (schema.properties) {
                f.items = [];

                for (const key in schema.properties) {
                    const propertySchema = schema.properties[key];
                    const path = options.path.slice();
                    path.push(key);
                    const def = test(propertySchema, { ...options, path });

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
    /**
     * Define forms for the null type
     * @return {FormDefinition}
     */
    null(schema, options) {
        if (getPreferredType(schema.type) === 'null') {
            const f = standardForm(schema, options);
            f.type = 'null';
            return f;
        }

        return undefined;
    },
};

export const rules = [
    // Detect enumerations
    definitions.multiselect,
    definitions.select,

    // Handle basic strings and other primitives
    definitions.null,
    definitions.date,
    definitions.datetime,
    definitions.text,
    definitions.number,
    definitions.integer,
    definitions.checkbox,

    // Handle complex types
    definitions.tuple,
    definitions.array,
    definitions.fieldset,
];

// export const rules = {
//     string: [definitions.date, definitions.select, definitions.text],
//     object: [definitions.select, definitions.fieldset],
//     number: [definitions.select, definitions.number],
//     integer: [definitions.select, definitions.integer],
//     boolean: [definitions.select, definitions.checkbox],
//     array: [definitions.select, definitions.tuple, definitions.array],
//     null: [definitions.select, definitions.null],
// };

/**
 * Test definitions against the schema and produce a representative form object
 * @param {object} schema - The schema to test
 * @param {object} options - Settings and lookup table for the test logic
 * @return {FormDefinition}
 */
export function test(schema, options) {
    for (const rule of rules) {
        const form = rule(schema, options);
        if (form) return form;
    }
    // const ruleSet = rules[getPreferredType(schema.type)];

    // if (ruleSet) {
    //     for (let rule of ruleSet) {
    //         const result = rule(schema, options);

    //         if (result !== undefined) {
    //             return result;
    //         }
    //     }
    // }

    // return undefined;
}
