import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import ListItem from '@mui/material/ListItem';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import React, { forwardRef } from 'react';

const useStyles = makeStyles(function (theme) {
    return {
        forms: {
            display: 'flex',
            flexDirection: 'column',
            flexGrow: '1',
            borderLeftWidth: '1px',
            borderLeftStyle: 'solid',
            borderLeftColor: theme.palette?.divider,
            borderRightWidth: '1px',
            borderRightStyle: 'solid',
            borderRightColor: theme.palette?.divider,
            padding: theme.spacing?.(1),
        },
        spacer: {
            flex: '1 0 auto',
            width: 'fill-available',
            borderBottom: `1px solid ${theme.palette?.divider}`,
        },
        controls: {
            display: 'flex',
            flexDirection: 'column',
            '&:has(button:only-child)': {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
            },
            '& button:not($destroy):not($onlyDestroy)': {
                borderRadius: '0',
                width: theme.spacing?.(6),
                minWidth: theme.spacing?.(6),
                '&:has(+ $(spacer))': {
                    borderBottom: 'none !important',
                },
            },
        },
        item: {
            display: 'flex',
            alignItems: 'stretch',
            flexDirection: 'row',
            paddingTop: 0,
            paddingBottom: 0,
            backgroundColor: theme.palette?.background?.paper,
        },
        icon: {
            padding: theme.spacing?.(1.5),
        },
        dragHandle: {
            display: 'flex',
            flexDirection: 'column',
            padding: theme.spacing?.(1.5),
        },
        topDragHandle: {
            padding: theme.spacing?.(1.5),
        },
        onlyDestroy: {
            display: 'inline-flex !important',
            flexDirection: 'column',
            width: theme.spacing?.(6),
            minWidth: theme.spacing?.(6),
            border: 0,
            justifyContent: 'center',
            alignItems: 'center',
        },
        destroy: {
            width: theme.spacing?.(6),
            minWidth: theme.spacing?.(6),
        },
    };
});
/**
 * @component
 * @return {React.Component}
 */
export function ItemComponent(props, ref) {
    const classes = useStyles(props);
    const { disabled, form } = props;
    const { draggableProps, dragHandleProps } = props.otherProps;

    const renderMovementButtons =
        'movementButtons' in form ? form.movementButtons : true;
    const dragHandleClass = clsx(
        dragHandleProps ? dragHandleProps.className : null,
        renderMovementButtons ? classes.topDragHandle : classes.dragHandle
    );

    return (
        <ListItem
            divider={true}
            className={classes.item}
            ref={ref}
            dense
            disableGutters={true}
            {...draggableProps}
        >
            <div {...dragHandleProps} className={dragHandleClass}>
                <Icon>drag_handle</Icon>
            </div>
            <div className={classes.forms}>{props.children}</div>
            <div key="controls" className={classes.controls}>
                {renderMovementButtons ? (
                    <>
                        <Button
                            onClick={props.moveUp}
                            size="small"
                            disabled={disabled}
                        >
                            <Icon>keyboard_arrow_up</Icon>
                        </Button>
                        <Button
                            onClick={props.moveDown}
                            size="small"
                            disabled={disabled}
                        >
                            <Icon>keyboard_arrow_down</Icon>
                        </Button>
                        <div className={classes.spacer} />
                    </>
                ) : null}
                <Button
                    onClick={props.destroy}
                    className={
                        renderMovementButtons
                            ? classes.destroy
                            : classes.onlyDestroy
                    }
                    color="secondary"
                    size="small"
                    disabled={disabled}
                >
                    <Icon>delete_forever</Icon>
                </Button>
            </div>
        </ListItem>
    );
}

export default forwardRef(ItemComponent);
