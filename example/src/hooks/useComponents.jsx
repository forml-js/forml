import Components from '../components/ComponentProvider';
import { useContext } from 'react';

export function useComponents() {
    return useContext(Components);
}

export function useComponent(component) {
    const components = useComponents();
    return components[component];
}
