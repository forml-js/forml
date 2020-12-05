import SimpleEditor from 'react-simple-code-editor';
import Prism from 'prismjs';

export default function Editor(props) {
    if (!props.value) return null;

    const highlightFunction = (code) => {
        return Prism.highlight(
            code,
            Prism.languages.javascript,
            'javascript'
        );
    };

    return (
        <SimpleEditor
            value={props.value}
            highlight={highlightFunction}
            padding={10}
            style={{ fontFamily: 'Hack, monospace', fontSize: 12 }}
            onValueChange={onValueChange}
        />
    );

    function onValueChange(value) {
        props.onChange({ target: { value } }, value);
    }
}
