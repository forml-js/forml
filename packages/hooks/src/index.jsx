import { ModelContext, RenderingContext } from '@forml/context';
import { useContext as useReactContext } from 'react';

/**
 * Hook to use the entire forml context
 * @return {Context}
 */
export function useContext() {
    return useReactContext(ModelContext);
}

export function useRenderingContext() {
    return useReactContext(RenderingContext);
}

/**
 * A hook to import the closest parent form's mapper
 * @return {Mapper}
 */
export function useMapper() {
    const { mapper } = useRenderingContext();
    return mapper;
}

/**
 * A hook to pull in the model methods for the closest parent form
 * @return {ModelMethods}
 */
export function useModel() {
    return useContext();
}

/**
 * A hook to pull in the closest parent form's localizer
 * @return {Localizer}``
 */
export function useLocalizer() {
    const { localizer } = useRenderingContext();
    return localizer;
}

/**
 * A hook to pull in the closest parent form's decorator
 * @return {Decorator}
 */
export function useDecorator() {
    const { decorator } = useRenderingContext();
    return decorator;
}
