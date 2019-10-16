/**
 * @namespace rjsf.SchemaForm
 */
import ObjectPath from 'objectpath';
import PropTypes from 'prop-types';
import {createElement as h, useCallback, useMemo} from 'react';

import Context from '../context';
import {merge} from '../forms';
import {defaultLocalizer, getLocalizer} from '../localizer';
import * as Types from '../types';
import * as util  from '../util';

import {decoratorShape, defaultDecorator, getDecorator} from './decorator';
import {defaultMapper, getMapper, mapperShape} from './mapper';
import {SchemaField} from './schema-field';

/**
 * @component SchemaForm
 * @description Renders a form from the provided schema, using the provided model as a value
 * and the provided forms as a guide.
 */
export function SchemaForm({model, schema, form, ...props}) {
    const merged            = useMemo(() => merge(schema, form), [schema, form])
    const validate          = useCallback(util.useValidator(schema), [schema]);
    const mapper            = useMemo(() => getMapper(props.mapper), [props.mapper]);
    const decorator         = useMemo(() => getDecorator(props.decorator), [props.decorator]);
    const localizer         = useMemo(() => getLocalizer(props.localizer), [props.localizer]);
    const errors            = useMemo(() => computeErrors(model), [model, validate]);

    const getValue = util.valueGetter(model, schema);
    const setValue = util.valueSetter(model, schema);
    const getError = util.errorGetter(errors);

    return h(Context.Provider,
             {
                 value: {
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
                 }
             },
             merged.map((form, index) => {
                 const {schema} = form;
                 return h(SchemaField, {
                     key: index.toString(),
                     schema,
                     form,
                     onChange,
                 })
             }));

    function onChange(event, value) {
        /**
         * This value could be coming from any of our root forms; we're mostly
         * just intercepting the event so we can trigger our parent!
         */
        if (props.onChange) {
            props.onChange(event, value);
        }
    }

    function computeErrors() {
        const {valid, errors} = validate(model);
        let errorMap          = {};

        if (!valid) {
            for (let error of errors) {
                const keys = ObjectPath.parse(error.dataPath.replace(/^\./, ''));
                const normal = ObjectPath.stringify(keys);
                errorMap     = {...errorMap, [normal]: error.message};
            }
        }

        return errorMap;
    }
}

SchemaForm.propTypes = {
    /**
     * The current value of the form
     */
    model: PropTypes.any,
    /**
     * The schema to build against
     */
    schema: PropTypes.object.isRequired,
    /** The forms to render */
    form: Types.FormsType,
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
    schema: {type: 'null'},
    form: ['*'],
    decorator: defaultDecorator(),
    localizer: defaultLocalizer(),
    mapper: defaultMapper(),
};
