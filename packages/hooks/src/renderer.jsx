import debug from 'debug';
import { RenderingContext } from '@forml/context';
import {
    useCallback,
    useContext as useReactContext,
    useMemo,
    useState,
} from 'react';
import { useModelFor } from '#model';

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

export function useSelect(form) {
    const { titleMap } = form;
    const indexOf = useCallback(
        (value) => {
            const index = titleMap.findIndex(
                (option) => option.value === value
            );
            if (index === -1) return '';
            return index;
        },
        [titleMap]
    );
    const valueOf = useCallback(
        (index) => {
            const titleMap = form.titleMap[index];
            const value = titleMap.value;
            return value;
        },
        [form.titleMap]
    );
    return useMemo(() => ({ indexOf, valueOf }), [indexOf, valueOf]);
}

export function useFileField(form) {
    const [display, setDisplay] = useState('');
    const allowMultiple = 'allowMultiple' in form ? form.allowMultiple : false;
    const format = 'format' in form ? form.format : 'data_url';
    const onChange = useMemo(
        function () {
            if (allowMultiple) {
                return multipleFileProcessor(format, setDisplay);
            } else {
                return singleFileProcessor(format, setDisplay);
            }
        },
        [format, setDisplay]
    );

    return useMemo(() => ({ onChange, display }), [onChange, display]);
}

function singleFileProcessor(format, setDisplay) {
    return async function onChange(event) {
        if (event.target.files.length === 0) {
            setDisplay('');
            return null;
        } else {
            const [file] = event.target.files;
            const result = await getFileFormat(format, file);
            setDisplay(file.name);
            return result;
        }
    };
}

function multipleFileProcessor(format, setDisplay) {
    return async function onChange(event) {
        if (event.target.files.length === 0) {
            setDisplay('');
            return null;
        } else {
            const files = Array.from(event.target.files);
            const results = await Promise.all(
                files.map((file) => getFileFormat(format, file))
            );
            setDisplay(files.map((file) => file.name).join(', '));
            return results;
        }
    };
}

function readAsDataURL(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            resolve(reader.result);
        });
        reader.readAsDataURL(file);
    });
}

/**
 * @function
 * @name getFileFormat
 * @description
 * @param {string} format
 * @param {File} file
 * Return the file in the requested format
 * @returns {Promise}
 */
function getFileFormat(format, file) {
    switch (format) {
        case 'data_url':
            return readAsDataURL(file);
        case 'array_buffer':
            return file.arrayBuffer();
        case 'name':
        default:
            return file.name;
    }
}
