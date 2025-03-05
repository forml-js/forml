import { createContext } from 'react';
const context = createContext(null);
export default context;

export function Provider(props) {
    return (
        <context.Provider value={props.value}>
            {props.children}
        </context.Provider>
    );
}
