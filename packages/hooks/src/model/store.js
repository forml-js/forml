import { ModelContext } from '@forml/context';
import AJV from 'ajv';
import addFormats from 'ajv-formats';
import { useMemo, useContext as useReactContext } from 'react';
import { createStore } from 'zustand';

import { assertType } from '../common.js';
import { buildKeyMaps, usePrefix } from './keys.js';

/**
 * A hook to pull in the model methods for the closest parent form
 * @return {ModelMethods}
 */
export function useModelContext() {
    return useReactContext(ModelContext);
}

export function useModelStore(schema, model) {
    const prefix = usePrefix();
    return useMemo(() => {
        const ajv = new AJV({ allErrors: true, strict: false });
        addFormats(ajv);
        return createStore()(function () {
            model = assertType(schema, model);
            const keyMaps = buildKeyMaps(schema, model, prefix);
            return {
                schema,
                model,
                keyMaps,
                ajv,
            };
        });
    }, []);
}
