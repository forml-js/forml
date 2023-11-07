import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import ListItem from '@mui/material/ListItem';
import { styled } from '@mui/material/styles';
import React, { forwardRef, useMemo } from 'react';

const DragHandle = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(1.5),
}));
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
const Spacer = styled('div')(({ theme }) => ({
    flex: '1 0 auto',
    width: 'fill-available',
    borderBottom: `1px solid ${theme.palette?.divider}`,
}));
const OnlyDestroy = styled(Button)(({ theme }) => ({
    display: 'inline-flex !important',
    flexDirection: 'column',
    width: theme.spacing?.(6),
    minWidth: theme.spacing?.(6),
    border: 0,
    justifyContent: 'center',
    alignItems: 'center',
}));
const Destroy = styled(Button)(({ theme }) => ({
    width: theme.spacing?.(6),
    minWidth: theme.spacing?.(6),
}));
const MovementButton = styled(Button)(({ theme, spacer }) => ({
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
            sx={{
                display: 'flex',
                alignItems: 'stretch',
                flexDirection: 'row',
                paddingTop: 0,
                paddingBottom: 0,
                backgroundColor: 'background.paper',
            }}
        />
    );
});

/**
 * @component
 * @return {React.Component}
 */
export function ItemComponent(props, ref) {
    const { disabled, form } = props;
    const { draggableProps, dragHandleProps } = props.otherProps;

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
            <DragHandle {...dragHandleProps}>
                <Icon>drag_handle</Icon>
            </DragHandle>
            <FormsContainer>{props.children}</FormsContainer>
            <Controls key="controls">
                {useMemo(
                    () =>
                        renderMovementButtons ? (
                            <>
                                <MovementButton
                                    onClick={props.moveUp}
                                    size="small"
                                    disabled={disabled}
                                >
                                    <Icon>keyboard_arrow_up</Icon>
                                </MovementButton>
                                <MovementButton
                                    onClick={props.moveDown}
                                    size="small"
                                    disabled={disabled}
                                    spacer
                                >
                                    <Icon>keyboard_arrow_down</Icon>
                                </MovementButton>
                                <Spacer />
                            </>
                        ) : null,
                    [renderMovementButtons]
                )}
                <DestroyButton
                    onClick={props.destroy}
                    color="secondary"
                    size="small"
                    disabled={disabled}
                >
                    <Icon>delete_forever</Icon>
                </DestroyButton>
            </Controls>
        </StyledListItem>
    );
}

export default forwardRef(ItemComponent);
