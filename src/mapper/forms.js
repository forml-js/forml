export function stdFormObj(name, schema, options = {}) {
    const f = {};

    f.title = schema.title || name;

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
