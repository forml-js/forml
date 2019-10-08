import {createContext, useContext} from 'react';
const context = createContext({});

export default context;

export function useMapper() {
    const ctx = useContext(context);
    return ctx.mapper;
}

export function useModel(schema) {
    const {getValue, setValue} = useContext(context);
    return {getValue, setValue};
}
