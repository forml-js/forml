import { useMemo } from 'react';

import {
    assertType,
    getNextSchema,
    modelDrop,
    seek,
    unwind,
} from '../common.js';
import {
    addArrayKeyForIndex,
    addNewKeyMaps,
    dropArrayKeyForIndex,
    mapArrayKeysToIndex,
    mappedIndexOfKey,
    moveArrayKeyForIndex,
    usePrefix,
} from './keys.js';
import { useModelContext } from './store.js';

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
                    const parentModel = currentModel;
                    stack.push([currentKey, parentModel, currentSchema]);

                    const itemIndex = parentModel.length;
                    const itemSchema = getNextSchema(currentSchema, itemIndex);
                    const itemModel = assertType(itemSchema, value);

                    final = unwind(itemSchema, itemIndex, itemModel, stack);

                    const updatedKeyMaps = addNewKeyMaps(
                        state.keyMaps,
                        [...mappedKey, itemIndex],
                        itemSchema,
                        itemModel
                    );
                    const finalKeyMaps = addArrayKeyForIndex(
                        updatedKeyMaps,
                        mappedKey,
                        itemIndex
                    );

                    return {
                        ...state,
                        model: final,
                        keyMaps: finalKeyMaps,
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
                    const updatedKeyMaps = dropArrayKeyForIndex(
                        state.keyMaps,
                        mappedKey,
                        index
                    );
                    //const finalKeyMaps = dropUnusedKeymaps();
                    return {
                        ...state,
                        keyMaps: updatedKeyMaps,
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
                    const nextModel = Array.from(currentModel);
                    const [removed] = nextModel.splice(index, 1);
                    nextModel.splice(index + delta, 0, removed);
                    final = unwind(currentSchema, currentKey, nextModel, stack);
                    const keyMaps = moveArrayKeyForIndex(
                        state.keyMaps,
                        mappedKey,
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
            moveArray(key, fromKey, to) {
                let final;
                store.setState((state) => {
                    const stack = [];
                    const mappedKey = mapArrayKeysToIndex(state.keyMaps, [
                        ...prefix,
                        ...key,
                    ]);
                    const from = mappedIndexOfKey(
                        state.keyMaps,
                        mappedKey,
                        fromKey
                    );
                    const [currentKey, currentModel, currentSchema] = seek(
                        state.schema,
                        mappedKey,
                        state.model,
                        stack
                    );
                    const nextModel = Array.from(currentModel);
                    const [removed] = nextModel.splice(from, 1);
                    nextModel.splice(to, 0, removed);
                    final = unwind(currentSchema, currentKey, nextModel, stack);
                    const keyMaps = moveArrayKeyForIndex(
                        state.keyMaps,
                        mappedKey,
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

export function useActionsFor(key) {
    const actions = useActions();
    return useMemo(
        function () {
            return {
                ...actions,
                setValue: (value) => actions.setValue(key, value),
                removeValue: () => actions.removeValue(key),
                appendArray: (value) => actions.appendArray(key, value),
                removeArray: (index) => actions.removeArray(key, index),
                moveArrayRelative: (key, id, delta) =>
                    actions.moveArrayRelative(key, id, delta),
                moveArray: (from, to) => actions.moveArray(key, from, to),
            };
        },
        [actions, key]
    );
}
