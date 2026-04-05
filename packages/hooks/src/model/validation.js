import { useModelContext } from '#model';
import { useModelFor } from './model.js';
import { useMemo } from 'react';
import { useStore } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

export function useAJV() {
    return useStore(
        useModelContext(),
        useShallow((state) => state.ajv)
    );
}

const validators = new WeakMap();
export function useValidatorFor(schema) {
    const ajv = useAJV();
    return useMemo(() => {
        if (validators.has(schema)) {
            return validators.get(schema);
        } else {
            const validator = ajv.compile(schema);
            const validate = (data) => {
                if (validator(data) === false) {
                    return ajv.errorsText(validator.errors);
                } else {
                    return null;
                }
            };
            validators.set(schema, validate);
            return validate;
        }
    }, [schema]);
}

export function useError(key) {
    const { validate, model } = useModelFor(key);
    const error = useMemo(() => validate(model), [validate, model]);
    return error;
}
