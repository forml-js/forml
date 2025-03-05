import React, { forwardRef, useMemo } from 'react';
import { Box, Button, Icon, ListItem, styled } from '@mui/material';

const DragHandle = (props) => (
    <Box
        {...props}
        sx={useMemo(
            () => ({ display: 'flex', flexDirection: 'column', p: 1.5 }),
            []
        )}
    >
        <Icon>drag_handle</Icon>
    </Box>
);
const FormsContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    flexGrow: '1',
    borderLeftWidth: '1px',
    borderLeftStyle: 'solid',
    borderLeftColor: theme.palette.divider,
    borderRightWidth: '1px',
    borderRightStyle: 'solid',
    borderRightColor: theme.palette.divider,
    padding: theme.spacing(1),
}));
const Controls = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    '&:has(button:only-child)': {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
}));
const DestroyButton = styled(Button)(({ divider, theme }) => ({
    width: theme.spacing(6),
    minWidth: theme.spacing(6),
    marginTop: 'auto',
    border: 0,
    borderTop: divider ? `1px solid ${theme.palette?.divider}` : undefined,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
}));
function OnlyDestroy(props) {
    const { onClick, disabled } = props;
    return (
        <DestroyButton
            onClick={onClick}
            disabled={disabled}
            color="secondary"
            size="small"
        >
            <Icon>delete_forever</Icon>
        </DestroyButton>
    );
}
function Destroy(props) {
    const { onClick, disabled } = props;
    return (
        <DestroyButton
            onClick={onClick}
            disabled={disabled}
            color="secondary"
            size="small"
        >
            <Icon>delete_forever</Icon>
        </DestroyButton>
    );
}
const MovementButton = styled(Button, {
    shouldForwardProp: (prop) => !['spacer'].includes(prop),
})(({ theme, spacer }) => ({
    borderRadius: '0',
    width: theme.spacing(6),
    minWidth: theme.spacing(6),
    borderBottom: spacer ? 'none !important' : undefined,
}));
const StyledListItem = forwardRef(function StyledListItem(props, ref) {
    return (
        <ListItem
            {...props}
            ref={ref}
            sx={useMemo(
                () => ({
                    display: 'flex',
                    alignItems: 'stretch',
                    flexDirection: 'row',
                    paddingTop: 0,
                    paddingBottom: 0,
                    backgroundColor: 'background.paper',
                }),
                []
            )}
        />
    );
});

/**
 * @component
 * @return {React.Component}
 */
export const ItemComponent = function ItemComponent(props, ref) {
    const { disabled, form, draggableProps, dragHandleProps } = props;
    const { moveUp, moveDown, destroy } = props;

    const renderMovementButtons = useMemo(
        () => ('movementButtons' in form ? form.movementButtons : true),
        [form]
    );
    const DestroyButton = useMemo(
        () => (renderMovementButtons ? Destroy : OnlyDestroy),
        [renderMovementButtons]
    );

    return (
        <StyledListItem
            divider={true}
            ref={ref}
            dense
            disableGutters={true}
            {...draggableProps}
        >
            <DragHandle {...dragHandleProps}></DragHandle>
            <FormsContainer>{props.children}</FormsContainer>
            <Controls key="controls">
                <MovementButtons
                    moveUp={moveUp}
                    moveDown={moveDown}
                    disabled={disabled}
                    render={renderMovementButtons}
                />
                <DestroyButton onClick={destroy} disabled={disabled} />
            </Controls>
        </StyledListItem>
    );
};

function MovementButtons(props) {
    const { render, moveUp, moveDown, disabled } = props;
    if (render) {
        return (
            <>
                <MovementButton
                    onClick={moveUp}
                    size="small"
                    disabled={disabled}
                >
                    <Icon>keyboard_arrow_up</Icon>
                </MovementButton>
                <MovementButton
                    onClick={moveDown}
                    size="small"
                    disabled={disabled}
                    spacer
                >
                    <Icon>keyboard_arrow_down</Icon>
                </MovementButton>
            </>
        );
    } else {
        return null;
    }
}
export default forwardRef(ItemComponent);
