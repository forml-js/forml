import debug from 'debug';
import cloneDeep from 'lodash.clonedeep';
import ObjectPath from 'objectpath';
import t from 'prop-types';
import {
    createElement as h,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { DndProvider, useDrag, useDragLayer, useDrop } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import shortid from 'shortid';

import { ARRAY_PLACEHOLDER } from '../../constants';
import { useDecorator, useLocalizer, useModel } from '../../context';
import { FormType } from '../../types';
import { defaultForSchema, getNextSchema, traverseForm } from '../../util';
import { SchemaField } from '../schema-field';

const log = debug('rjsf:mapper:array');

export function useArrayItems(form, disabled = false) {
    const [items, setItems] = useState([]);
    const model = useModel();

    useEffect(function () {
        log('useArrayItems(%O)', form);
        const value = model.getValue(form.key);
        const items = [];

        for (let i = 0; i < value.length; ++i) {
            items.push(create(i));
        }

        log('useArrayItems() : initialItems : %o', items);

        setItems(items);
    }, []);

    function create() {
        const forms = form.items.map((form) => {
            const key = shortid();
            return { form, key };
        });

        const key = shortid();
        return { forms, key };
    }

    function add(event) {
        const current = model.getValue(form.key);
        const nextSchema = getNextSchema(form.schema, current.length);
        const nextModel = model.setValue(
            [...form.key, current.length],
            defaultForSchema(nextSchema)
        );
        model.onChange(event, nextModel);
        setItems([...items, create(current.length)]);
    }

    function destroyer(index) {
        function destroy(event) {
            const value = model.getValue(form.key);
            const nextModel = model.setValue(form.key, [
                ...value.slice(0, index),
                ...value.slice(index + 1),
            ]);
            model.onChange(event, nextModel);
            setItems([...items.slice(0, index), ...items.slice(index + 1)]);
        }

        return destroy;
    }

    function upwardMover(index) {
        function mover(event) {
            if (index > 0) {
                const value = model.getValue(form.key);

                let tempValue = value[index];
                let tempForm = items[index];

                items[index] = items[index - 1];
                items[index - 1] = tempForm;
                value[index] = value[index - 1];
                value[index - 1] = tempValue;

                const nextModel = model.setValue(form.key, [...value]);
                model.onChange(event, nextModel);
                setItems([...items]);
            }
        }

        return mover;
    }

    function downwardMover(index) {
        function mover(event) {
            if (index < items.length - 1) {
                const value = model.getValue(form.key);

                let tempValue = value[index];
                let tempForm = items[index];

                items[index] = items[index + 1];
                items[index + 1] = tempForm;
                value[index] = value[index + 1];
                value[index + 1] = tempValue;

                const nextModel = model.setValue(form.key, [...value]);
                model.onChange(event, nextModel);
                setItems([...items]);
            }
        }

        return mover;
    }

    function move(startIndex, newIndex) {
        const dragItem = items[startIndex];
        items.splice(startIndex, 1);
        items.splice(newIndex, 0, dragItem);
        setItems([...items]);
    }

    let result = { items };
    if (!disabled) {
        result = {
            ...result,
            add,
            destroyer,
            upwardMover,
            downwardMover,
            move,
        };
    }

    return result;
}

function ArrayItem(props) {
    const { form, index, items } = props;
    const { type } = props;
    const model = useModel();
    const deco = useDecorator();
    const localizer = useLocalizer();
    const value = model.getValue([...form.key, index]);

    let title = form.title;
    if (form.titleFun) {
        title = form.titleFun(value);
    }

    const [dragProps, dragRef, preview] = useDrag({
        item: { index, type, value, title, form },
        begin,
        collect,
    });
    const [dropProps, dropRef] = useDrop({ accept: type, drop, hover });

    title = localizer.getLocalizedString(title);

    const destroy = useMemo(() => items.destroyer(index), [items, index]);
    const moveUp = useMemo(() => items.upwardMover(index), [items, index]);
    const moveDown = useMemo(() => items.downwardMover(index), [items, index]);

    const ref = dragRef(dropRef(useRef()));

    useEffect(function () {
        preview(getEmptyImage(), { captureDragginState: true });
    });

    return h(
        deco.Arrays.Item,
        {
            key: 'header',
            title,
            destroy,
            moveUp,
            moveDown,
            index,
            ref,
            ...dragProps,
            ...dropProps,
        },
        props.children
    );

    function begin(monitor) {
        log('ArrayItem() : begin() : %O', monitor);
    }

    function drop(item, monitor) {
        log('ArrayComponent() : drop() : item : %O', item);
    }

    function collect(monitor) {
        return {
            isDragging: monitor.isDragging(),
        };
    }

    function hover(item, monitor) {
        if (!ref.current) return;

        const dragIndex = item.index;
        const hoverIndex = index;

        log('hover(%o, %o) : ref : %O', dragIndex, hoverIndex, ref);
        if (dragIndex === hoverIndex) return;

        log('hover(%o) : dragIndex : %o', index, dragIndex);
        log('hover(%o) : hoverIndex : %o', index, hoverIndex);

        const hoverBoundingRect = ref.current.getBoundingClientRect();
        const hoverMiddleY =
            (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

        const clientOffset = monitor.getClientOffset();
        const hoverClientY = clientOffset.y - hoverBoundingRect.top;

        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
            return;
        }

        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
            return;
        }

        log('items.move(%o, %o)', dragIndex, hoverIndex);
        items.move(dragIndex, hoverIndex);

        item.index = hoverIndex;
    }
}

/**
 * @component ArrayComponent
 */
export default function ArrayComponent(props) {
    const { form } = props;
    const { error } = props;
    const arrays = [];

    const { readonly: disabled } = form;

    const type = useMemo(() => ObjectPath.stringify(form.key));
    const items = useArrayItems(form, disabled);
    const deco = useDecorator();
    const localizer = useLocalizer();

    for (let i = 0; i < items.items.length; ++i) {
        const item = items.items[i];
        const forms = item.forms.map(function ({ form, key }) {
            const formCopy = copyWithIndex(form, i);
            return h(SchemaField, {
                key,
                form: formCopy,
                schema: formCopy.schema,
            });
        });
        arrays.push(
            h(
                ArrayItem,
                { key: item.key, form, index: i, items, item, type },
                forms
            )
        );
    }

    const label = localizer.getLocalizedString(form.title);
    const description = localizer.getLocalizedString(form.description);

    return h(deco.Arrays.Items, { add: items.add, label, description, error }, [
        h(DragLayer, { renderItem: deco.preview }),
        arrays,
    ]);
}

function getItemStyles(initialOffset, currentOffset) {
    if (!initialOffset || !currentOffset) {
        return { display: 'none' };
    }

    let { x, y } = currentOffset;

    const transform = `translate(${x}px, ${y}px)`;
    return { transform, WebkitTransform: transform };
}

function DragLayer(props) {
    const { item, isDragging, initialOffset, currentOffset } = useDragLayer(
        (monitor) => ({
            item: monitor.getItem(),
            initialOffset: monitor.getInitialSourceClientOffset(),
            currentOffset: monitor.getClientOffset(),
            isDragging: monitor.isDragging(),
        })
    );
    const deco = useDecorator();

    if (!isDragging) return null;

    return h(
        'div',
        {
            style: {
                position: 'fixed',
                pointerEvents: 'none',
                zIndex: 100,
                left: 0,
                top: 0,
                width: '100%',
                height: '100%',
            },
        },
        h(
            'div',
            { style: getItemStyles(initialOffset, currentOffset) },
            h(deco.Preview, item)
        )
    );
}

ArrayComponent.propTypes = {
    /** The configuration object for this section of the form */
    form: FormType,
    /** The schema for the array */
    schema: t.object,
    /** Any errors associated with the form's key */
    error: t.string,
    /** The current value of the array */
    value: t.array,
};

ArrayComponent.defaultProps = {
    value: [],
};

function copyWithIndex(form, index) {
    const copy = cloneDeep(form);
    copy.arrayIndex = index;
    traverseForm(copy, setIndex(index));
    return copy;
}

function setIndex(index) {
    return function (form) {
        if (form.key) {
            form.key[form.key.indexOf(ARRAY_PLACEHOLDER)] = index;
        }
    };
}
