import { SampleContext } from '../samples.jsx';
import { useCallback, useContext } from 'react';

export function useMode() {
    const context = useContext(SampleContext);
    return context.mode;
}

export function useModeSwitcher() {
    const context = useContext(SampleContext);
    return useCallback((mode) => context.setMode(mode), [context]);
}
