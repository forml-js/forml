import React, { useCallback, useMemo } from 'react';
import SimpleEditor from 'react-simple-code-editor';
import Prism from 'prismjs';

export default function Editor(props) {
    const highlightFunction = useCallback((code) => {
        return Prism.highlight(code, Prism.languages.javascript, 'javascript');
    }, []);
    const onValueChange = useCallback(
        function onValueChange(value) {
            props.onChange({ target: { value } }, value);
        },
        [props.onChange]
    );
    const style = useMemo(
        () => ({ fontFamily: 'Hack, monospace', fontSize: 12 }),
        []
    );

    if (!props.value) return null;

    return (
        <SimpleEditor
            value={props.value}
            highlight={highlightFunction}
            padding={10}
            style={style}
            onValueChange={onValueChange}
        />
    );
}
