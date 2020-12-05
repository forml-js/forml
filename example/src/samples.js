function importAll(context) {
    const keys = context.keys();
    const result = {};

    for (let key of keys) {
        result[key] = context(key);

        if (result[key].default) result[key] = result[key].default;

        if (!result[key].schema) Reflect.deleteProperty(result, key);
    }

    return result;
}

export const samples = importAll(require.context('../data/', true, /\.js(on)?$/));

export function getSample(selected) {
    if (selected in samples) return samples[selected];

    return { schema: { type: 'null' }, form: ['*'] };
}
