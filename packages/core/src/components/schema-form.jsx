/**
 * @namespace forml.SchemaForm
 */
import ObjectPath from 'objectpath';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo } from 'react';

import Context from '@forml/context';
import { merge } from '../forms';
import { defaultLocalizer, getLocalizer } from '../localizer';
import * as Types from '../types';
import * as util from '../util';

import { decoratorShape, defaultDecorator, getDecorator } from '../decorators';
import { defaultMapper, getMapper, mapperShape } from './mapper';
import { SchemaField } from './schema-field';

function useGenerator(generator, props, model, deps) {
    return useMemo(() => {
        if (typeof generator === 'function') {
            // The genrator is a hook; use it
            return generator(props, model, deps);
        } else {
            return generator;
        }
    }, [generator, props, model, deps]);
}

/**
 * @component SchemaForm
 * @description Renders a form from the provided schema, using the provided model as a value
 * and the provided forms as a guide.
 */
let versions = 0;

export function SchemaForm({
    model,
    schema: useSchema,
    form: useForm,
    ...props
}) {
    const schema = useGenerator(useSchema, props, model, props.schemaDeps);
    const form = useGenerator(useForm, props, model, props.formDeps);

    const merged = useMemo(() => merge(schema, form), [schema, form]);
    const validate = useCallback(util.useValidator(schema), [schema]);
    const mapper = useMemo(
        () => getMapper(props.mapper, SchemaForm),
        [props.mapper]
    );
    const decorator = useMemo(
        () => getDecorator(props.decorator),
        [props.decorator]
    );
    const localizer = useMemo(
        () => getLocalizer(props.localizer),
        [props.localizer]
    );
    const computeErrors = useCallback(
        function computeErrors() {
            const { valid, errors } = validate(model);
            let errorMap = {};

            if (!valid) {
                for (const error of errors) {
                    const keys = ObjectPath.parse(
                        error.dataPath?.replace(/^\./, '') ?? ''
                    );
                    const normal = ObjectPath.stringify(keys);
                    errorMap = { ...errorMap, [normal]: error.message };
                }
            }

            return errorMap;
        },
        [validate]
    );
    const errors = useMemo(computeErrors, [model, validate, props.errors]);

    const version = useMemo(() => versions++, [model]);
    const getValue = useCallback(util.valueGetter(model, schema), [
        model,
        schema,
    ]);
    const setValue = useCallback(util.valueSetter(model, schema), [
        model,
        schema,
    ]);
    const getError = useCallback(util.errorGetter(errors), [errors]);
    const onChange = useCallback(
        function onChange(event, model) {
            if (props.onChange) {
                props.onChange(event, model);
            }
        },
        [props.onChange]
    );

    const contextValue = useMemo(
        function () {
            return {
                model,
                schema,
                form: merged,
                mapper,
                getValue,
                setValue,
                getError,
                onChange,
                localizer,
                errors: {},
                decorator,
                version,
            };
        },
        [
            model,
            schema,
            merged,
            mapper,
            decorator,
            localizer,
            errors,
            getValue,
            setValue,
            getError,
            version,
            onChange,
        ]
    );

    const children = useMemo(
        () =>
            merged.map((form, index) => {
                if (!form) return;
                const { schema } = form;
                return (
                    <SchemaField
                        key={index}
                        schema={schema}
                        form={form}
                        onChange={onChange}
                    />
                );
            }),
        [merged, onChange]
    );

    return <Context.Provider value={contextValue}>{children}</Context.Provider>;
}

SchemaForm.propTypes = {
    /**
     * The current value of the form
     */
    model: PropTypes.any,
    /**
     * The schema to build against
     */
    schema: PropTypes.oneOfType([PropTypes.object, PropTypes.func]).isRequired,
    /** The forms to render */
    form: PropTypes.oneOfType([PropTypes.func, Types.FormsType]),
    /** A set of localization functions to use */
    localizer: PropTypes.shape({
        getLocalizedDate: PropTypes.func,
        getLocalizedNumber: PropTypes.func,
        getLocalizedString: PropTypes.func,
    }),
    /** The map of control components to be recognized by SchemaField in a form's type */
    mapper: mapperShape,
    /** The tree of decorative components used by control components to build forms */
    decorator: decoratorShape,
};

SchemaForm.defaultProps = {
    model: null,
    schema: { type: 'null' },
    form: ['*'],
    decorator: defaultDecorator(),
    localizer: defaultLocalizer(),
    mapper: defaultMapper(SchemaForm),
};
