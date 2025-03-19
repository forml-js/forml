import { ModelContext, RenderingContext } from '@forml/context';
import objectPath from 'objectpath';
import shortid from 'shortid';
import {
    useCallback,
    useMemo,
    useContext as useReactContext,
    useRef,
} from 'react';
import { createStore, useStore } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

import {
    assertType,
    defaultForSchema,
    getNextSchema,
    modelDrop,
    seek,
    walk,
    unwind,
} from './common';

// validation temporarily disabled
import AJV from 'ajv';
import addFormats from 'ajv-formats';

class _ArrayPlaceholder {
    #parentKey;
    #key;

    constructor(parentKey, key) {
        if (!new.target) {
            return new _ArrayPlaceholder(parentKey, key);
        }
        if (Array.isArray(parentKey)) {
            parentKey = objectPath.stringify(parentKey);
        }
        this.#parentKey = parentKey;
        this.#key = key;
    }

    get key() {
        return this.#key;
    }

    get parent() {
        return this.#parentKey;
    }

    toString() {
        return `["${this.#key}"]`;
    }
}

export function ArrayPlaceholder(parentKey, key) {
    return new _ArrayPlaceholder(parentKey, key);
}

ArrayPlaceholder.prototype = _ArrayPlaceholder.prototype;

export function usePrefix() {
    const { prefix } = useReactContext(RenderingContext);
    return useMemo(() => {
        if (prefix) {
            if (Array.isArray(prefix)) {
                return prefix;
            } else {
                return objectPath.parse(prefix);
            }
        } else {
            return [];
        }
    }, [prefix]);
}

export function usePrefixed(key) {
    const prefix = usePrefix();
    return useMemo(() => {
        if (key) {
            if (Array.isArray(key)) {
                return prefix.concat(key);
            } else {
                return prefix.concat(objectPath.parse(key));
            }
        } else {
            return prefix;
        }
    }, [prefix, key]);
}

export function useModelStore(schema, model) {
    return useMemo(() => {
        const ajv = new AJV({ allErrors: true, strict: false });
        addFormats(ajv);
        return createStore()(function () {
            model = assertType(schema, model);
            const keyMaps = buildKeyMaps(schema, model);
            return {
                schema,
                model,
                keyMaps,
                ajv,
            };
        });
    }, []);
}

function buildKeyMaps(schema, model) {
    const keyMaps = {};
    walk(schema, model, (key, model, schema) => {
        if (schema.type === 'array' && Array.isArray(model)) {
            const indexToKey = {};
            const keyToIndex = {};
            keyMaps[objectPath.stringify(key)] = { indexToKey, keyToIndex };
            for (let index = 0; index < model.length; index++) {
                const id = shortid();
                indexToKey[index] = id;
                keyToIndex[id] = index;
            }
        }
    });
    return keyMaps;
}

export function useAJV() {
    return useStore(
        useModelContext(),
        useShallow((state) => state.ajv)
    );
}

export function useActions() {
    const prefix = usePrefix();
    const store = useModelContext();
    return useMemo(() => {
        return {
            setValue(key, value) {
                let final;
                store.setState((state) => {
                    const stack = [];
                    const mappedKey = mapArrayKeysToIndex(state.keyMaps, [
                        ...prefix,
                        ...key,
                    ]);
                    const [currentKey, currentModel, currentSchema] = seek(
                        state.schema,
                        mappedKey,
                        state.model,
                        stack
                    );
                    final = unwind(currentSchema, currentKey, value, stack);
                    return {
                        ...state,
                        model: final,
                    };
                });
                return final;
            },
            removeValue(key) {
                let final;
                store.setState((state) => {
                    const stack = [];
                    const [currentKey, currentModel, currentSchema] = seek(
                        state.schema,
                        mapArrayKeysToIndex(state.keyMaps, [...prefix, ...key]),
                        state.model,
                        stack
                    );
                    final = unwind(
                        currentSchema,
                        currentKey,
                        currentModel,
                        stack,
                        1
                    );
                    return {
                        ...state,
                        model: final,
                    };
                });
                return final;
            },
            appendArray(key, value) {
                let final;
                store.setState((state) => {
                    const stack = [];
                    const mappedKey = mapArrayKeysToIndex(state.keyMaps, [
                        ...prefix,
                        ...key,
                    ]);
                    const [currentKey, currentModel, currentSchema] = seek(
                        state.schema,
                        mappedKey,
                        state.model,
                        stack
                    );
                    const parentModel =
                        currentModel ?? defaultForSchema(currentSchema);
                    stack.push([currentKey, parentModel, currentSchema]);

                    const itemIndex = parentModel.length;
                    const itemSchema = getNextSchema(currentSchema, itemIndex);
                    const itemModel = assertType(itemSchema, value);

                    final = unwind(itemSchema, itemIndex, itemModel, stack);
                    const nextKeyMaps = addArrayKeyForIndex(
                        state.keyMaps,
                        key,
                        itemIndex
                    );

                    return {
                        ...state,
                        model: final,
                        keyMaps: nextKeyMaps,
                    };
                });
                return final;
            },
            removeArray(key, id) {
                let final;
                key = [...prefix, ...key];
                store.setState((state) => {
                    const stack = [];
                    const mappedKey = mapArrayKeysToIndex(state.keyMaps, key);
                    const index = mappedIndexOfKey(
                        state.keyMaps,
                        mappedKey,
                        id
                    );
                    const [currentKey, currentModel, currentSchema] = seek(
                        state.schema,
                        mappedKey,
                        state.model,
                        stack
                    );
                    final = unwind(
                        currentSchema,
                        currentKey,
                        modelDrop(currentSchema, currentModel, index),
                        stack
                    );
                    const keyMaps = dropArrayKeyForIndex(
                        state.keyMaps,
                        mappedKey,
                        index
                    );
                    return {
                        ...state,
                        keyMaps,
                        model: final,
                    };
                });
                return final;
            },
            moveArrayRelative(key, id, delta) {
                let final;
                store.setState((state) => {
                    const stack = [];
                    const mappedKey = mapArrayKeysToIndex(state.keyMaps, [
                        ...prefix,
                        ...key,
                    ]);
                    const [currentKey, currentModel, currentSchema] = seek(
                        state.schema,
                        mappedKey,
                        state.model,
                        stack
                    );
                    const index = mappedIndexOfKey(
                        state.keyMaps,
                        mappedKey,
                        id
                    );
                    const nextModel = currentModel
                        ? Array.from(currentModel)
                        : defaultForSchema(currentSchema);
                    const [removed] = nextModel.splice(index, 1);
                    nextModel.splice(index + delta, 0, removed);
                    final = unwind(currentSchema, currentKey, nextModel, stack);
                    const keyMaps = moveArrayKeyForIndex(
                        state.keyMaps,
                        key,
                        index,
                        index + delta
                    );
                    return {
                        ...state,
                        keyMaps,
                        model: final,
                    };
                });
                return final;
            },
            moveArray(key, from, to) {
                let final;
                store.setState((state) => {
                    const stack = [];
                    const [currentKey, currentModel, currentSchema] = seek(
                        state.schema,
                        mapArrayKeysToIndex(state.keyMaps, [...prefix, ...key]),
                        state.model,
                        stack
                    );
                    const nextModel = currentModel
                        ? Array.from(currentModel)
                        : defaultForSchema(currentSchema);
                    const [removed] = nextModel.splice(from, 1);
                    nextModel.splice(to, 0, removed);
                    final = unwind(currentSchema, currentKey, nextModel, stack);
                    const keyMaps = moveArrayKeyForIndex(
                        state.keyMaps,
                        key,
                        from,
                        to
                    );
                    return {
                        ...state,
                        keyMaps,
                        model: final,
                    };
                });
                return final;
            },
        };
    }, [prefix, store]);
}

function mapArrayKeysToIndex(keyMaps, keys) {
    return keys.map((key) => {
        if (key instanceof ArrayPlaceholder) {
            const placeholder = key;
            const keyMap = keyMaps[placeholder.parent];
            const index = keyMap.keyToIndex[placeholder.key];
            return index;
        } else {
            return key;
        }
    });
}

function mappedIndexOfKey(keyMaps, parent, key) {
    parent = objectPath.stringify(parent);
    const keyMap = keyMaps[parent].keyToIndex;
    return keyMap[key];
}

function dropArrayKeyForIndex(keyMaps, parent, index) {
    parent = objectPath.stringify(parent);

    let counter = 0;
    const keyToIndex = { ...keyMaps[parent].keyToIndex };
    const indexToKey = { ...keyMaps[parent].indexToKey };

    const key = indexToKey[index];
    const keys = Object.keys(keyToIndex);
    for (let i = index + 1; i < keys.length; i++) {
        const key = indexToKey[i];
        keyToIndex[key] = i - 1;
        indexToKey[i - 1] = key;
        delete indexToKey[i];
    }

    delete keyToIndex[key];
    delete indexToKey[keys.length - 1];

    const nextKeyMap = {
        keyToIndex,
        indexToKey,
    };

    const nextKeyMaps = {
        ...keyMaps,
        [parent]: nextKeyMap,
    };

    return nextKeyMaps;
}

function moveArrayKeyForIndex(keyMaps, parent, from, to) {
    parent = objectPath.stringify(parent);

    if (from === to) {
        return keyMaps;
    }

    const keyMap = { ...keyMaps[parent].keyToIndex };
    const indexMap = { ...keyMaps[parent].indexToKey };
    const fromKey = indexMap[from];

    if (from > to) {
        for (let index = from - 1; index >= to; index--) {
            const key = indexMap[index];
            keyMap[key] = index + 1;
            indexMap[index + 1] = key;
        }
        indexMap[to] = fromKey;
        keyMap[fromKey] = to;
    } else if (from < to) {
        for (let index = from + 1; index <= to; index++) {
            const key = indexMap[index];
            keyMap[key] = index - 1;
            indexMap[index - 1] = indexMap[index];
        }
        indexMap[to] = fromKey;
        keyMap[fromKey] = to;
    }

    const nextKeyMaps = {
        ...keyMaps,
        [parent]: { indexToKey: indexMap, keyToIndex: keyMap },
    };

    return nextKeyMaps;
}

function addArrayKeyForIndex(keyMaps, parent, index) {
    parent = objectPath.stringify(parent);
    const keyMap = { ...keyMaps[parent].keyToIndex };
    const indexMap = { ...keyMaps[parent].indexToKey };
    const key = shortid();
    keyMap[key] = index;
    indexMap[index] = key;
    const nextKeyMaps = {
        ...keyMaps,
        [parent]: { indexToKey: indexMap, keyToIndex: keyMap },
    };
    return nextKeyMaps;
}

const defaultMergeActions = {};
export function useActionsFor(key, mergeActions = defaultMergeActions) {
    const actions = useActions();
    return useMemo(
        function () {
            const setValue = mergeAction(
                actions.setValue,
                mergeActions.setValue
            );
            const removeValue = mergeAction(
                actions.removeValue,
                mergeActions.removeValue
            );
            const appendArray = mergeAction(
                actions.appendArray,
                mergeActions.appendArray
            );
            const removeArray = mergeAction(
                actions.removeArray,
                mergeActions.removeArray
            );
            const moveArray = mergeAction(
                actions.moveArray,
                mergeActions.moveArray
            );
            return {
                ...actions,
                setValue: (value) => setValue(key, value),
                removeValue: () => removeValue(key),
                appendArray: (value) => appendArray(key, value),
                removeArray: (index) => removeArray(key, index),
                moveArray: (from, to) => moveArray(key, from, to),
            };
        },
        [actions, key]
    );
}

function mergeAction(action, mergeAction) {
    if (mergeAction) {
        return function mergedAction(...args) {
            mergeAction(...args);
            return action(...args);
        };
    } else {
        return action;
    }
}

/**
 * A hook to pull in the model methods for the closest parent form
 * @return {ModelMethods}
 */
export function useModelContext() {
    return useReactContext(ModelContext);
}

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

const validators = new WeakMap();
export function useValidatorFor(schema) {
    const ajv = useAJV();
    return useMemo(() => {
        if (validators.has(schema)) {
            return validators.get(schema);
        } else {
            const validator = ajv.compile(schema);
            const validate = (data) => {
                if (validator(data) === false) {
                    return ajv.errorsText(validator.errors);
                } else {
                    return null;
                }
            };
            validators.set(schema, validate);
            return validate;
        }
    }, [schema]);
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
            return keyMaps[path][index];
        },
        [path, index]
    );
    return useStore(useModelContext(), useShallow(selector));
}

export function useError(key) {
    const { validate, model } = useModelFor(key);
    const error = useMemo(() => validate(model), [validate, model]);
    return error;
}

export const useKey = useModelFor;

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
