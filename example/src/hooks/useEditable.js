import { useCallback, useMemo, useState } from 'react';

export default function useEditable(defaultValue) {
    const [value, doSetValue] = useState({ value: defaultValue });
    const [json, doSetJSON] = useState({
        value: JSON.stringify(defaultValue, undefined, 2),
    });

    const setValue = useCallback(
        function setValue(value) {
            doSetValue({ value });
            doSetJSON({ value: JSON.stringify(value, undefined, 2) });
        },
        [doSetValue, doSetJSON]
    );

    const setJSON = useCallback(
        function setJSON(json) {
            doSetJSON({ value: json });
            try {
                doSetValue({ value: JSON.parse(json) });
            } catch (err) {
                /** noop */
            }
        },
        [doSetJSON, doSetValue]
    );

    return useMemo(
        () => ({ value: value.value, json: json.value, setValue, setJSON }),
        [value.value, json.value, setValue, setJSON]
    );
}
