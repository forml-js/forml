import { RenderingContext } from '@forml/context';
import debug from 'debug';
import { useMemo, useContext as useReactContext } from 'react';

const log = debug('forml:hooks:renderer');

export function useRenderingContext() {
    return useReactContext(RenderingContext);
}

export function useMappedField(type) {
    const mapper = useMapper();
    return mapper[type];
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
 * A hook to pull in the closest parent form's decorator
 * @return {Decorator}
 */
export function useDecorator(type) {
    const { decorator } = useRenderingContext();
    if (type && type in decorator) {
        return decorator[type];
    } else if (type !== undefined) {
        return null;
    } else {
        return decorator;
    }
}

/**
 * A hook to pull in the closest parent form's localizer
 * @return {Localizer}``
 */
export function useLocalizer() {
    const { localizer } = useRenderingContext();
    return localizer;
}

export function useLocalizedString(string) {
    const { localizer } = useRenderingContext();
    return useMemo(
        () => localizer.getLocalizedString(string),
        [localizer, string]
    );
}

export function useTitleFor(form, value) {
    return useMemo(() => {
        if ('titleFun' in form) {
            return form.titleFun(value);
        } else {
            return form.title;
        }
    }, [form.titleFun && value, form.title]);
}
