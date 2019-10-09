import debug from 'debug';

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

        if (!model) {
            return undefined;
        }

        log('valueGetter(%s)::get(%o) : %s', schema.title, keys, new Error().stack);

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

function updateAndClone(keys, model, schema, value) {
    log('updateAndClone(%o) : %o', keys, model);
    if (keys.length === 0) {
        log('updateAndClone(%o) <- %o', keys, value);
        return value;
    }

    const [next, ...rest] = keys;
    const nextSchema      = getNextSchema(schema, next);
    const nextModel       = updateAndClone(
        rest, model[next] || defaultForSchema(nextSchema), nextSchema, value);

    if (schema.type === 'array') {
        const firstSlice = model.slice(0, next);
        const lastSlice  = model.slice(next + 1);
        return [...firstSlice, nextModel, ...lastSlice];
    }

    if (schema.type === 'object') {
        return {...model, [next]: nextModel};
    }

    throw new Error('Bad ObjectPath')
}

export function valueSetter(model, schema, setModel) {
    function set(keys, value) {
        if (!Array.isArray(keys)) {
            keys = [keys];
        }

        log('valueSetter::set(%o) <- %o', keys, value);
        const newModel = updateAndClone(keys, model, schema, value);
        return setModel(newModel)
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
    log('getNextSchema(%s) : %o', key, schema);
    if (schema.type === 'array') {
        log('getNextSchema(%s) : array', key);
        if (Array.isArray(schema.items)) {
            log('getNextSchema(%s) : tuple', key);
            return schema.items[key];
        }
        return schema.items;
    }

    if (schema.type === 'object') {
        log('getNextSchema(%s) : object', key);
        if (key in schema.properties) {
            log('getNextSchema(%s) : defined', key);
            return schema.properties[key];
        }

        if (schema.additionalProperties) {
            log('getNextSchema(%s) : additionalProperties')
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
