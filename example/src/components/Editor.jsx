import React, { useCallback, useMemo } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { useComponents } from '../hooks/useComponents';

export default function Editor(props) {
    const { useMode } = useComponents();
    const mode = useMode();
    const onChange = useCallback(
        function onChange(value) {
            if (props.onChange) {
                props.onChange({ target: { value } }, value);
            }
        },
        [props.onChange]
    );

    const theme = useMemo(() => (mode === 'dark' ? 'vs-dark' : 'vs'), [mode]);
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
