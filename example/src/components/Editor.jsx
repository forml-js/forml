import React, { useCallback, useMemo } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { useMediaQuery } from '@mui/material';

export default function Editor(props) {
    const onChange = useCallback(
        function onChange(value) {
            if (props.onChange) {
                props.onChange({ target: { value } }, value);
            }
        },
        [props.onChange]
    );

    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const theme = useMemo(
        () => (prefersDarkMode ? 'vs-dark' : 'vs'),
        [prefersDarkMode]
    );
    const options = useMemo(
        () => ({
            minimap: { enabled: false },
        }),
        []
    );

    if (!props.value) return null;

    return (
        <MonacoEditor
            height="100%"
            theme={theme}
            language="json"
            value={props.value}
            options={options}
            onChange={onChange}
        />
    );
}
