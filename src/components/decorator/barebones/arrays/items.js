import { createElement as h, forwardRef } from 'react';
import { useLocalizer } from '../../../../context';

/**
 * @component
 */
function Items(props, ref) {
    const { getLocalizedString } = useLocalizer();
    const { disabled } = props;
    return h('div', { className: 'array', ref }, [
        h(
            'button',
            { key: 'add', className: 'add', disabled, onClick: props.add },
            getLocalizedString('Add Item')
        ),
        h('ul', { key: 'items' }, props.children),
    ]);
}

export default forwardRef(Items);
