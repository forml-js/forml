import { useModelContext } from '#model';
import objectPath from 'objectpath';
import { useCallback, useMemo } from 'react';
import { useStore } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import { seek } from '../common.js';
import { mapArrayKeysToIndex, usePrefixed } from './keys.js';

export function useArrayLength(key) {
    key = usePrefixed(key);
    const path = useMemo(() => objectPath.stringify(key), [key]);
    const keySelector = useCallback(
        function ({ model, schema, keyMaps }) {
            const mappedKey = mapArrayKeysToIndex(keyMaps, key);
            const [_currentKey, currentModel, _currentSchema] = seek(
                schema,
                mappedKey,
                model,
                []
            );

            return currentModel.length;
        },
        [path]
    );

    const length = useStore(useModelContext(), keySelector);
    return length;
}

export function useArrayKeys(key) {
    key = usePrefixed(key);
    const path = useMemo(() => objectPath.stringify(key), [key]);
    const selector = useCallback(
        function ({ keyMaps }) {
            return keyMaps[path];
        },
        [path]
    );
    return useStore(useModelContext(), useShallow(selector));
}

export function useArrayKeyRange(key, start, end) {
    key = usePrefixed(key);
    const path = useMemo(() => objectPath.stringify(key), [key]);
    const selector = useCallback(
        function ({ keyMaps }) {
            const result = [];
            const indexMap = keyMaps[path].indexToKey;
            for (
                let index = 0;
                index < end - start && start + index in indexMap;
                index++
            ) {
                result[index] = indexMap[start + index];
            }
            return result;
        },
        [path, start, end]
    );
    return useStore(useModelContext(), useShallow(selector));
}

export function useArrayKeyFor(key, index) {
    key = usePrefixed(key);
    const path = useMemo(() => objectPath.stringify(key), [key]);
    const selector = useCallback(
        function ({ keyMaps }) {
            return keyMaps[path].indexToKey[index];
        },
        [path, index]
    );
    return useStore(useModelContext(), useShallow(selector));
}

export function useArrayIndexFor(parentKey, key) {
    parentKey = usePrefixed(parentKey);
    const path = useMemo(() => objectPath.stringify(parentKey), [parentKey]);
    const selector = useCallback(
        function ({ keyMaps }) {
            return keyMaps[path].keyToIndex[key];
        },
        [path, key]
    );
    return useStore(useModelContext(), useShallow(selector));
}

export function useIsFirstArrayItem(key, id) {
    key = usePrefixed(key);
    const keySelector = useCallback(
        function ({ keyMaps }) {
            const mappedKey = mapArrayKeysToIndex(keyMaps, key);
            const path = objectPath.stringify(mappedKey);
            const firstKey = keyMaps[path].indexToKey[0];
            return firstKey === id;
        },
        [key, id]
    );
    return useStore(useModelContext(), keySelector);
}

export function useIsLastArrayItem(key, id) {
    key = usePrefixed(key);
    const keySelector = useCallback(
        function ({ keyMaps }) {
            const mappedKey = mapArrayKeysToIndex(keyMaps, key);
            const path = objectPath.stringify(mappedKey);
            const index = keyMaps[path].keyToIndex[id];
            const lastIndex = Object.keys(keyMaps[path].keyToIndex).length - 1;
            return index === lastIndex;
        },
        [key, id]
    );
    return useStore(useModelContext(), keySelector);
}
