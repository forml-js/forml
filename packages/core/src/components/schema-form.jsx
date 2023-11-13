/**
 * @namespace forml.SchemaForm
 */
import ObjectPath from 'objectpath';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';

import { ModelContext, RenderingContext } from '@forml/context';
import { useModelReducer } from '@forml/hooks';
import { merge } from '../forms';
import { defaultLocalizer, getLocalizer } from '../localizer';
import * as Types from '../types';
import * as util from '../util';

import { decoratorShape, defaultDecorator, getDecorator } from '../decorators';
import { defaultMapper, getMapper, mapperShape } from './mapper';
import { SchemaField } from './schema-field';

function useGenerator(generator, props, model, deps = []) {
    return useMemo(() => {
        if (typeof generator === 'function') {
            // The genrator is a hook; use it
            return generator(props, model, deps);
        } else {
            return generator;
        }
    }, [generator, model, ...deps]);
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
    const onChange = useCallback(
        function onChange(event, model) {
            if (props.onChange) {
                props.onChange(event, model);
            }
        },
        [props.onChange]
    );

    const modelContext = useModelReducer(schema, model);
    const renderingContext = useMemo(
        () => ({
            localizer,
            mapper,
            decorator,
        }),
        [decorator, localizer, mapper]
    );

    const shouldFire = useRef(false);
    useEffect(
        function () {
            if (shouldFire.current) {
                const { model } = modelContext.state;
                onChange({ target: { value: model } }, model);
            } else {
                shouldFire.current = true;
            }
        },
        [modelContext.state, onChange]
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

    return (
        <RenderingContext.Provider value={renderingContext}>
            <ModelContext.Provider value={modelContext}>
                {children}
            </ModelContext.Provider>
        </RenderingContext.Provider>
    );
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
