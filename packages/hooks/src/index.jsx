import context from '@forml/context';
import {useContext as useReactContext} from 'react';

/**
 * Hook to use the entire forml context
 * @return {Context}
 */
export function useContext() {
  return useReactContext(context);
}

/**
 * A hook to import the closest parent form's mapper
 * @return {Mapper}
 */
export function useMapper() {
  const ctx = useContext();
  return ctx.mapper;
}

/**
 * A hook to pull in the model methods for the closest parent form
 * @return {ModelMethods}
 */
export function useModel() {
  const {
    getValue,
    setValue,
    getError,
    setError,
    onChange,
    version,
  } = useContext();
  return {getValue, setValue, getError, setError, onChange, version};
}

/**
 * A hook to pull in the closest parent form's localizer
 * @return {Localizer}``
 */
export function useLocalizer() {
  const {localizer} = useContext();
  return localizer;
}

/**
 * A hook to pull in the closest parent form's decorator
 * @return {Decorator}
 */
export function useDecorator() {
  const {decorator} = useContext();
  return decorator;
}
