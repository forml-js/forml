import { useRenderingContext } from '#renderer';
import objectPath from 'objectpath';
import { useMemo } from 'react';
import shortid from 'shortid';

import { walkSchema } from '../common';

class _ArrayPlaceholder {
    #parentKey;
    #key;

    constructor(parentKey, key) {
        /* istanbul ignore next */
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

export function buildKeyMaps(schema, model, prefix) {
    const keyMaps = {};
    prefix = prefix ?? [];
    return addNewKeyMaps(keyMaps, prefix, schema, model);
}

export function addNewKeyMaps(keyMaps, prefix, schema, model) {
    walkSchema(schema, model, (key, model, schema) => {
        const isArraySchema =
            schema.type === 'array' ||
            (Array.isArray(schema.type) && schema.type.includes('array'));
        const isModelArray = Array.isArray(model) || (!model && isArraySchema);
        if (isArraySchema && isModelArray) {
            const keyMapPath = objectPath.stringify([...prefix, ...key]);
            let indexToKey = {};
            let keyToIndex = {};

            if (keyMapPath in keyMaps) {
                indexToKey = keyMaps[keyMapPath].indexToKey;
                keyToIndex = keyMaps[keyMapPath].keyToIndex;
            } else {
                keyMaps[keyMapPath] = {
                    indexToKey,
                    keyToIndex,
                };
            }

            for (let index = 0; index < model.length; index++) {
                if (!(index in indexToKey)) {
                    const id = shortid();
                    indexToKey[index] = id;
                    keyToIndex[id] = index;
                }
            }
        }
    });
    return keyMaps;
}

export function mapArrayKeysToIndex(keyMaps, keys) {
    return keys.map((key) => {
        if (key instanceof ArrayPlaceholder) {
            const placeholder = key;
            if (placeholder.parent in keyMaps) {
                const keyMap = keyMaps[placeholder.parent];
                if (placeholder.key in keyMap.keyToIndex) {
                    const index = keyMap.keyToIndex[placeholder.key];
                    return index;
                } else {
                    throw Error('array key not found');
                }
            } else {
                throw Error('array keymaps not found');
            }
        } else {
            return key;
        }
    });
}

export function mappedIndexOfKey(keyMaps, parent, key) {
    parent = objectPath.stringify(parent);
    if (parent in keyMaps) {
        const keyMap = keyMaps[parent];
        const keyToIndex = keyMap.keyToIndex;
        if (key in keyToIndex) {
            return keyToIndex[key];
        } else {
            throw Error('array key not found');
        }
    } else {
        throw Error('array keymaps not found');
    }
}

export function mappedKeyOfIndex(keyMaps, parent, index) {
    parent = objectPath.stringify(parent);
    if (parent in keyMaps) {
        const keyMap = keyMaps[parent];
        const indexToKey = keyMap.indexToKey;

        if (index in indexToKey) {
            return indexToKey[index];
        } else {
            throw Error('array index not found');
        }
    } else {
        throw Error('array keymaps not found');
    }
}

export function dropArrayKeyForIndex(keyMaps, parent, index) {
    parent = objectPath.stringify(parent);

    if (!(parent in keyMaps)) {
        throw Error('array keymaps not found');
    }

    const keyMap = keyMaps[parent];
    if (!(index in keyMap.indexToKey)) {
        throw Error('array key not found');
    }

    const keyToIndex = { ...keyMap.keyToIndex };
    const indexToKey = { ...keyMap.indexToKey };

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

export function moveArrayKeyForIndex(keyMaps, parent, from, to) {
    parent = objectPath.stringify(parent);

    if (!(parent in keyMaps)) {
        throw Error('array keymaps not found');
    }

    if (from === to) {
        return keyMaps;
    }

    const keyMap = { ...keyMaps[parent].keyToIndex };
    const indexMap = { ...keyMaps[parent].indexToKey };

    if (!(from in indexMap)) {
        throw Error('array key not found');
    }

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

export function addArrayKeyForIndex(keyMaps, parent, index) {
    parent = objectPath.stringify(parent);

    if (!(parent in keyMaps)) {
        throw Error('array keymaps not found');
    }

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

export function usePrefix() {
    const { prefix } = useRenderingContext();
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
