import debug from 'debug';
import ObjectPath from 'objectpath';
import t from 'prop-types';
import {
    createElement as h,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    forwardRef,
} from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import shortid from 'shortid';

import { ARRAY_PLACEHOLDER } from '../../constants';
import { useDecorator, useLocalizer, useModel } from '../../context';
import { FormType } from '../../types';
import {
    clone,
    defaultForSchema,
    getNextSchema,
    traverseForm,
} from '../../util';
import { SchemaField } from '../schema-field';

const log = debug('rjsf:mapper:array');

export function useArrayItems(form, disabled = false) {
    const [items, setItems] = useState([]);
    const model = useModel();

    useEffect(function () {
        const value = model.getValue(form.key);
        const items = [];

        for (let i = 0; i < value.length; ++i) {
            items.push(create(i));
        }

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
        const value = model.getValue(form.key);

        const dragItem = items[startIndex];
        const dragValue = value[startIndex];

        items.splice(startIndex, 1);
        items.splice(newIndex, 0, dragItem);
        value.splice(startIndex, 1);
        value.splice(newIndex, 0, dragValue);

        const nextModel = model.setValue(form.key, [...value]);
        model.onChange(event, nextModel);
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

function BaseArrayItem(props, ref) {
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

    title = localizer.getLocalizedString(title);

    const destroy = useMemo(() => items.destroyer(index), [items, index]);
    const moveUp = useMemo(() => items.upwardMover(index), [items, index]);
    const moveDown = useMemo(() => items.downwardMover(index), [items, index]);

    return h(Draggable, { draggableId: props.id, index }, (provided) =>
        h(
            deco.Arrays.Item,
            {
                key: 'header',
                title,
                destroy,
                moveUp,
                moveDown,
                index,
                ref: (e) => {
                    provided.innerRef(e);
                    if (ref) ref(e);
                },
                otherProps: {
                    draggableProps: provided.draggableProps,
                    dragHandleProps: provided.dragHandleProps,
                },
            },
            props.children
        )
    );
}

export const ArrayItem = forwardRef(BaseArrayItem);

/**
 * @component ArrayComponent
 */
function ArrayComponent(props, ref) {
    const { form, value } = props;
    const { error } = props;
    const arrays = [];

    const { readonly: disabled } = form;

    const type = useMemo(() => ObjectPath.stringify(form.key), [form.key]);
    const droppableId = useMemo(shortid);
    const items = useArrayItems(form);
    const deco = useDecorator();
    const localizer = useLocalizer();

    for (let i = 0; i < items.items.length; ++i) {
        const item = items.items[i];
        const forms = item.forms.map(function ({ form, key }) {
            if (!form) return;
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
                {
                    key: item.key,
                    id: item.key,
                    form,
                    index: i,
                    items,
                    item,
                    type,
                },
                forms
            )
        );
    }

    const label = localizer.getLocalizedString(form.title);
    const description = localizer.getLocalizedString(form.description);

    return h(
        DragDropContext,
        { onDragEnd },
        h(Droppable, { droppableId }, (provided) => {
            const ref = provided.innerRef;
            const otherProps = provided.droppableProps;
            return h(
                deco.Arrays.Items,
                {
                    add: items.add,
                    value,
                    label,
                    description,
                    error,
                    ref,
                    otherProps,
                },
                [arrays, provided.placeholder]
            );
        })
    );

    function onDragEnd(result) {
        if (!result.destination) {
            return;
        } else if (result.destination.index === result.source.index) {
            return;
        } else {
            items.move(result.destination.index, result.source.index);
        }
    }
}
export default forwardRef(ArrayComponent);

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
    const copy = clone(form);
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
