import { useModelContext } from '#model';
import objectPath from 'objectpath';
import { useCallback, useMemo } from 'react';
import { useStore } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import { seek } from '../common';
import { mapArrayKeysToIndex, usePrefixed, usePrefix } from './keys';
import { useValidatorFor } from './validation';

export function useSchema() {
    const prefix = usePrefix();
    return useSchemaFor(prefix);
}

export function useSchemaFor(key) {
    key = usePrefixed(key);
    const path = useMemo(() => objectPath.stringify(key), [key]);
    const schemaSelector = useCallback(
        function ({ model, schema, keyMaps }) {
            const [_currentKey, _currentModel, currentSchema] = seek(
                schema,
                mapArrayKeysToIndex(keyMaps, key),
                model,
                []
            );
            return currentSchema;
        },
        [path]
    );

    return useStore(useModelContext(), useShallow(schemaSelector));
}

export function useModel() {
    const prefix = usePrefix();
    return useModelFor(prefix);
}

export function useValue(key = []) {
    key = usePrefixed(key);
    const path = useMemo(() => objectPath.stringify(key), [key]);
    const modelSelector = useCallback(
        function ({ model, schema, keyMaps }) {
            const mappedKey = mapArrayKeysToIndex(keyMaps, key);
            const [_currentKey, currentModel] = seek(
                schema,
                mappedKey,
                model,
                []
            );
            return currentModel;
        },
        [path]
    );

    return useStore(useModelContext(), useShallow(modelSelector));
}

export function useModelFor(key) {
    key = usePrefixed(key);
    const path = useMemo(() => objectPath.stringify(key), [key]);
    const keySelector = useCallback(
        function ({ model, schema, keyMaps }) {
            const mappedKey = mapArrayKeysToIndex(keyMaps, key);
            const [_currentKey, currentModel, currentSchema] = seek(
                schema,
                mappedKey,
                model,
                []
            );

            return {
                model: currentModel,
                schema: currentSchema,
            };
        },
        [path]
    );

    const { model, schema } = useStore(
        useModelContext(),
        useShallow(keySelector)
    );
    const validate = useValidatorFor(schema);

    return useMemo(
        () => ({
            model,
            schema,
            validate,
        }),
        [model, schema, validate]
    );
}

export const useKey = useModelFor;
