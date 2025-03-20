import React from 'react';
import { Box, Button, Divider } from '@mantine/core';
import {
    IconMenu,
    IconChevronUp,
    IconChevronDown,
    IconTrash,
} from '@tabler/icons-react';
import { useIsFirstArrayItem, useIsLastArrayItem } from '@forml/hooks';

function DragHandle(props) {
    return (
        <Box className="forml-array-item-draghandle">
            <IconMenu />
        </Box>
    );
}

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

function Base(props) {
    return <Box className="forml-array-item">{props.children}</Box>;
}

export default function Item(props) {
    const { children, id, form, destroy, moveUp, moveDown } = props;

    return (
        <Base>
            <DragHandle />
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
}
