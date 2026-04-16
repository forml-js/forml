import { renderHook } from '@testing-library/react';
import {
    useArrayKeyRange,
    useIsFirstArrayItem,
    useIsLastArrayItem,
    useArrayKeyFor,
} from '../../src/model/array.js';
import { ModelContext, RenderingContext } from '@forml/context';
import { buildKeyMaps } from '../../src/model/keys.js';
import { useModelStore } from '#model';

const { expect } = chai;

function makeWrapper({ modelStore }) {
    return ({ children }) => (
        <RenderingContext value={{}}>
            <ModelContext.Provider value={modelStore}>
                {children}
            </ModelContext.Provider>
        </RenderingContext>
    );
}

describe('Array Hooks', function () {
    const mockSchema = {
        type: 'array',
        items: { type: 'string' },
    };
    const mockModel = ['item1', 'item2', 'item3'];

    let modelStore;
    let wrapper;

    beforeEach(function () {
        modelStore = renderHook(() => useModelStore(mockSchema, mockModel))
            .result.current;
        wrapper = makeWrapper({ modelStore });
    });

    describe('useArrayKeyRange', function () {
        it('returns array of keys for specified range', function () {
            const { result } = renderHook(() => useArrayKeyRange('', 0, 2), {
                wrapper,
            });

            expect(result.current).to.be.an('array');
            expect(result.current.length).to.equal(2);
        });

        it('handles empty range', function () {
            const { result } = renderHook(() => useArrayKeyRange('', 1, 1), {
                wrapper,
            });

            expect(result.current).to.be.an('array');
            expect(result.current.length).to.equal(0);
        });
    });

    describe('useArrayKeyFor', function () {
        it('returns key for specific index', function () {
            const { result } = renderHook(() => useArrayKeyFor('', 0), {
                wrapper,
            });

            expect(result.current).to.be.a('string');
        });
    });

    describe('useIsFirstArrayItem', function () {
        it('returns true for first item', function () {
            const { keyMaps } = modelStore.getState();
            const firstKey = keyMaps[''].indexToKey[0];

            const { result } = renderHook(
                () => useIsFirstArrayItem('', firstKey),
                { wrapper }
            );

            expect(result.current).to.be.true;
        });

        it('returns false for non-first item', function () {
            const keyMaps = buildKeyMaps(mockSchema, mockModel);
            const secondKey = keyMaps[''].indexToKey[1];

            const { result } = renderHook(
                () => useIsFirstArrayItem('', secondKey),
                { wrapper }
            );

            expect(result.current).to.be.false;
        });
    });

    describe('useIsLastArrayItem', function () {
        it('returns true for last item', function () {
            const { keyMaps, model } = modelStore.getState();
            const lastIndex = model.length - 1;
            const lastKey = keyMaps[''].indexToKey[lastIndex];

            const { result } = renderHook(
                () => useIsLastArrayItem('', lastKey),
                { wrapper }
            );

            expect(result.current).to.be.true;
        });

        it('returns false for non-last item', function () {
            const keyMaps = buildKeyMaps(mockSchema, mockModel);
            const firstKey = keyMaps[''].indexToKey[0];

            const { result } = renderHook(
                () => useIsLastArrayItem('', firstKey),
                { wrapper }
            );

            expect(result.current).to.be.false;
        });
    });
});
