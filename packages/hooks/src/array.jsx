import { useReducer, useEffect, useMemo } from 'react';
import { createAction, createReducer } from './reducer';
import { useKey } from './model';
import shortid from 'shortid';

const reset = createAction('reset');
const appendArray = createAction('append', (item) => ({ item }));
const removeArray = createAction('remove', (index) => ({ index }));
const moveArray = createAction('move', (from, to) => ({ from, to }));

const initialState = [];
const reduceItems = createReducer((builder) => {
    builder.addCase(reset, (_state, _action) => {
        return [];
    });
    builder.addCase(appendArray, (state, action) => {
        const { item } = action.payload;
        return [...state, item];
    });
    builder.addCase(removeArray, (state, action) => {
        const { index } = action.payload;
        return [...state.slice(0, index), ...state.slice(index + 1)];
    });
    builder.addCase(moveArray, (state, action) => {
        const { from, to } = action.payload;
        const nextModel = [...state];
        const [removed] = nextModel.splice(from, 1);
        nextModel.splice(to, 0, removed);
        return nextModel;
    });
});

function useArrayForms(array) {
    const initialState = useMemo(() => {
        if (array.model) {
            return array.model.map(shortid);
        } else {
            return [];
        }
    }, []);
    const [keys, dispatch] = useReducer(reduceItems, initialState);
    const actions = useMemo(
        () => ({
            appendArray: () => dispatch(appendArray(shortid())),
            removeArray: (index) => dispatch(removeArray(index)),
            moveArray: (from, to) => dispatch(moveArray(from, to)),
            moveArrayUp: (index) => dispatch(moveArray(index, index - 1)),
            moveArrayDown: (index) => dispatch(moveArray(index, index + 1)),
        }),
        [dispatch]
    );
    return useMemo(() => ({ keys, actions }), [keys, dispatch]);
}

export function useArrayKey(key) {
    const array = useKey(key);
    const reducer = useArrayForms(array);

    const actions = useMemo(() => {
        const mergedActions = {};
        for (let key in array.actions) {
            const formAction = reducer.actions[key];
            const modelAction = array.actions[key];

            if (formAction) {
                mergedActions[key] = (...args) => {
                    formAction(...args);
                    modelAction(...args);
                };
            } else {
                mergedActions[key] = array.actions[key];
            }
        }
        return mergedActions;
    }, [array.actions, reducer.actions]);

    return useMemo(
        () => ({ ...array, keys: reducer.keys, actions }),
        [array, reducer.keys, actions]
    );
}
