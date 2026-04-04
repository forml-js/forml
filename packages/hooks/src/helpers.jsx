import { useCallback, useMemo, useState } from 'react';

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

export function using(form) {
    const props = {};
    const _self = {
        add(componentKey, value = undefined) {
            if (value === undefined) {
                return {
                    from(formKey, defaultValue = undefined) {
                        if (formKey in form) {
                            props[componentKey] = form[formKey];
                        } else if (defaultValue !== undefined) {
                            props[componentKey] = defaultValue;
                        }
                        return _self;
                    },
                    with(builder) {
                        props[componentKey] = builder(form);
                        return _self;
                    },
                };
            } else {
                props[componentKey] = value;
            }
        },
        get value() {
            return props;
        },
    };
    return _self;
}
