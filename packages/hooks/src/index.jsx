import { ModelContext, RenderingContext } from '@forml/context';
import { useContext as useReactContext, useMemo } from 'react';

export * from './renderer.jsx';
export * from './reducer.js';
export * from './model.jsx';
export * from './array.jsx';
export * from './forms.js';
export * from './constants.jsx';

export function useGenerator(generator) {
    if (typeof generator === 'function') {
        // The generator is a hook; use it
        return generator();
    } else {
        return generator;
    }
}
