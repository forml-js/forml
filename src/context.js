import {createContext, useContext} from 'react';
import {defaultDecorator} from './decorator';
import {defaultLocalizer} from './localizer';

const context = createContext({
    decorator: defaultDecorator(),
    localizer: defaultLocalizer(),
});

export default context;

export function useMapper() {
    const ctx = useContext(context);
    return ctx.mapper;
}

export function useModel(schema) {
    const {getValue, setValue, getError, setError, onChange} = useContext(context);
    return {getValue, setValue, getError, setError, onChange};
}

export function useLocalizer() {
    const {localizer} = useContext(context);
    return localizer;
}

export function useDecorator() {
    const {decorator} = useContext(context);
    return decorator;
}
