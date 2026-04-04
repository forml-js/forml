import cx from 'clsx';
import React, { forwardRef } from 'react';
import { Box, Button, Divider } from '@mantine/core';
import {
    IconMenu,
    IconChevronUp,
    IconChevronDown,
    IconTrash,
} from '@tabler/icons-react';
import { useIsFirstArrayItem, useIsLastArrayItem } from '@forml/hooks';

const DragHandle = forwardRef(function DragHandle(props, ref) {
    return (
        <Box {...props} ref={ref} className="forml-array-item-draghandle">
            <IconMenu />
        </Box>
    );
});

function Forms(props) {
    return <Box className="forml-array-item-forms">{props.children}</Box>;
}

function Controls(props) {
    return <Box className="forml-array-item-controls">{props.children}</Box>;
}

function Destroy(props) {
    return (
        <Button variant="subtle" color="red.3" onClick={props.onClick}>
            <IconTrash />
        </Button>
    );
}

function MovementButton(props) {
    return (
        <Button
            variant="subtle"
            onClick={props.onClick}
            disabled={props.disabled}
        >
            {props.children}
        </Button>
    );
}

function MovementButtons(props) {
    const { moveUp, moveDown, form, id } = props;

    const isFirst = useIsFirstArrayItem(form.key, id);
    const isLast = useIsLastArrayItem(form.key, id);

    return (
        <>
            <MovementButton key="moveUp" onClick={moveUp} disabled={isFirst}>
                <IconChevronUp />
            </MovementButton>
            <MovementButton key="moveDown" onClick={moveDown} disabled={isLast}>
                <IconChevronDown />
            </MovementButton>
            <Divider key="divider" />
        </>
    );
}

const Base = forwardRef(function Base(props, ref) {
    const { isDragging } = props;
    const className = cx(
        'forml-array-item',
        isDragging && 'forml-array-item-dragging'
    );
    return (
        <Box ref={ref} className={className}>
            {props.children}
        </Box>
    );
});

export default forwardRef(function Item(props, ref) {
    const {
        children,
        id,
        form,
        dragRef,
        handleRef,
        destroy,
        moveUp,
        moveDown,
        isDragging,
    } = props;

    return (
        <Base isDragging={isDragging} ref={dragRef}>
            <DragHandle ref={handleRef} />
            <Divider orientation="vertical" />
            <Forms>{children}</Forms>
            <Divider orientation="vertical" />
            <Controls>
                <MovementButtons
                    form={form}
                    id={id}
                    moveUp={moveUp}
                    moveDown={moveDown}
                />
                <Destroy onClick={destroy} />
            </Controls>
        </Base>
    );
});
