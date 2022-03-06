import debug from 'debug';
import React, { useState } from 'react';

import { useDecorator, useLocalizer } from '@forml/hooks';

const log = debug('forml:core:mapper:file');

/**
 * @component File
 */
export default function File(props) {
    const { value, form } = props;
    const [display, setDisplay] = useState(value);
    let { error } = props;

    const localizer = useLocalizer();
    const deco = useDecorator();

    let { title, description, placeholder } = form;
    const { readonly: disabled } = form;

    title = localizer.getLocalizedString(title);
    description = localizer.getLocalizedString(description);
    placeholder = localizer.getLocalizedString(placeholder);
    error = localizer.getLocalizedString(error);

    return (
        <deco.Input.Group form={form} value={display} error={error}>
            {title && (
                <deco.Label
                    key="label"
                    form={form}
                    value={display}
                    error={error}
                >
                    {title}
                </deco.Label>
            )}
            <deco.Input.Form
                key="form"
                type="file"
                form={form}
                onChange={onChange}
                value={display}
                error={error}
                placeholder={placeholder}
                disabled={disabled}
            />
            {(error || description) && (
                <deco.Input.Description
                    key="description"
                    form={form}
                    value={display}
                    error={!!error}
                >
                    {error || description}
                </deco.Input.Description>
            )}
        </deco.Input.Group>
    );

    async function onChange(event) {
        const [file] = event.target.files;
        let result = '';

        if (file) {
            result = await getFileFormat(form.format, file);
            setDisplay(file.name);
        } else {
            setDisplay('');
        }

        log('result : %o', result);

        return props.onChange(event, result);
    }
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

function getFileFormat(format, file) {
    switch (format) {
        case 'data_url':
            return readAsDataURL(file);
        case 'name':
        default:
            return file.name;
    }
}
