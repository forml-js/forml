import {createContext, useContext} from 'react';
import {defaultDecorator} from './components/decorator';
import {defaultMapper} from './components/mapper';
import {defaultLocalizer} from './localizer';

const context = createContext({
    mapper: defaultMapper(),
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
