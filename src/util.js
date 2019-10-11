import Ajv from 'ajv';
import debug from 'debug';
import objectHash from 'object-hash';
import objectPath from 'objectpath';

const log = debug('rjsf:util');

export function defaultForSchema(schema) {
    if (schema.default !== undefined) {
        return schema.default;
    }

    const type = getPreferredType(schema.type);
    switch (type) {
        case 'array':
            return [];
        case 'object':
            return {};
        case 'string':
            return '';
        case 'number':
        case 'integer':
            return 0;
        case 'boolean':
            return false;
        case 'null':
            return null;
        default:
            // throw new Error(`Unhandled defaultForSchema type: ${type}`);
            return undefined;
    }
}

export function getPreferredType(types) {
    if (!Array.isArray(types))
        return types;

    return types[0];
}

export function valueGetter(model, schema) {
    function get(keys) {
        if (!Array.isArray(keys)) {
            keys = [keys];
        }

        if (keys.length === 0)
            return model;

        if (model === undefined) {
            model = defaultForSchema(schema);
        }

        let current       = model;
        let currentSchema = schema;

        for (let i = 0; i < keys.length; ++i) {
            const key      = keys[i];
            currentSchema  = getNextSchema(currentSchema, key);
            current        = current[key] || defaultForSchema(currentSchema);
        }

        return current;
    }

    return get;
}

export function errorSetter(errors, setErrors) {
    return function(keys, error) {
        const key = objectPath.stringify(keys);
        const newErrors = {...errors, [key]: error};
        setErrors(newErrors);
        return newErrors;
    }
}

export function errorGetter(errors) {
    return function(keys) {
        const key = objectPath.stringify(keys);
        return errors[key];
    }
}

function updateAndClone(keys, model, schema, value, depth = 0) {
    if (keys.length === 0) {
        return value;
    }

    const [next, ...rest] = keys;
    const nextSchema      = getNextSchema(schema, next);
    const nextModel       = updateAndClone(
        rest, model[next] || defaultForSchema(nextSchema), nextSchema, value, depth + 1);

    if (schema.type === 'array') {
        const firstSlice = model.slice(0, next);
        const lastSlice  = model.slice(next + 1);

        while (firstSlice.length < next) {
            firstSlice.push(undefined);
        }

        const result     = [...firstSlice, nextModel, ...lastSlice];
        log('updateAndClone() <%s %o', '-'.repeat(depth), result);
        return result;
    }

    if (schema.type === 'object') {
        const result = {...model, [next]: nextModel};
        log('updateAndClone() <%s %o', '-'.repeat(depth), result);
        return result;
    }

    throw new Error('Bad ObjectPath')
}

export function valueSetter(model, schema, setModel) {
    function set(keys, value) {
        if (!Array.isArray(keys)) {
            keys = [keys];
        }

        if (model === undefined) {
            model = defaultForSchema(schema);
        }

        const newModel = updateAndClone(keys, model, schema, value);
        setModel(newModel)
        return newModel;
    }

    return set;
}

export function findSchema(keys, schema) {
    if (keys.length === 0)
        return schema;

    for (let i = 0; i < keys.length; ++i) {
        const key = keys[i];
        schema    = getNextSchema(schema, key);
    }

    return schema;
}

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

export function traverseForm(forms, visit) {
    if (!Array.isArray(forms))
        forms = [forms];

    for (let form of forms) {
        visit(form);

        if (form.items)
            traverseForm(form.items, visit);
    }
}

export function useKeyGenerator(disambiguator) {
    const disambiguate = useDisambiguate();
    function generateKey(form, value) {
        if (form.title) {
            return disambiguate(hash(form.title), value);
        }
        return disambiguate(hash(form), value);
    }
    return generateKey;
}

export function defaultLocalizer() {
    function noop(id) {
        return id;
    }

    return {
        getLocalizedString: noop,
        getLocalizedNumber: noop,
        getLocalizedDate: noop,
    };
}

export function hash(object) {
    if (object === null) {
        return 'null';
    }
    if (object === undefined) {
        return 'undefined';
    }
    if (typeof object !== 'object') {
        return '' + object;
    }
    return objectHash(object);
}

export function useDisambiguate() {
    const keys = {};

    function disambiguate(key, disambiguator) {
        if (key in keys) {
            if (disambiguator) {
                return key + disambiguate(hash(disambiguator));
            }

            const count = keys[key]++;
            return key + count;
        }

        keys[key] = 0;
        return key;
    }

    return disambiguate;
}

export function validator(schema) {
    const ajv      = new Ajv({allErrors: true});
    const compiled = ajv.compile(schema);

    function validate(model) {
        const valid    = compiled(model);
        const {errors} = compiled;
        return {valid, errors};
    }
    return validate;
}

export function frequencyCap(fun) {
    let timer = null;

    return function cappedInvocation(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => invoke(...args), 100);
    };

    function invoke(...args) {
        fun(...args)
        timer = null;
    }
}
