import { useState } from 'react';

export default function useEditable(defaultValue) {
    const [value, doSetValue] = useState({ value: defaultValue });
    const [json, doSetJSON] = useState({
        value: JSON.stringify(defaultValue, undefined, 2),
    });

    function setValue(value) {
        doSetValue({ value });
        doSetJSON({ value: JSON.stringify(value, undefined, 2) });
    }

    function setJSON(json) {
        doSetJSON({ value: json });
        try {
            doSetValue({ value: JSON.parse(json) });
        } catch (err) {
            /** noop */
        }
    }

    return { value: value.value, json: json.value, setValue, setJSON };
}
