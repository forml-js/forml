import React, { useMemo } from 'react';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

/**
 * @component
 */

function paperTransform(orientation, delta) {
    if (orientation === 'vertical') {
        if (delta === 0) {
            return 'translateX(0vw)';
        } else if (delta < 0) {
            return 'translateX(-100vw)';
        } else if (delta > 0) {
            return 'translateX(100vw)';
        }
    } else {
        if (delta === 0) {
            return undefined;
        } else if (delta < 0) {
            return 'translateY(-100vh)';
        } else if (delta > 0) {
            return 'translateY(100vh)';
        }
    }
}

function paperPosition(delta) {
    if (delta === 0) {
        return 'relative';
    } else {
        return 'absolute';
    }
}

function paperZIndex(delta) {
    if (delta === 0) {
        return 99;
    } else {
        return 1;
    }
}

export default function Panel(props) {
    const { activeDelta, form, parent } = props;

    const settings = useMemo(
        () => ({
            elevation: 'elevation' in form ? form.elevation : 0,
            orientation: 'layout' in parent ? parent.layout : 'horizontal',
        }),
        [form]
    );
    const sx = useMemo(
        () => ({
            position: paperPosition(activeDelta),
            display: 'flex',
            transition: 'all 0.3s',
            flex: '1 1 100%',
            height: '100%',
            zIndex: paperZIndex(activeDelta),
            transform: paperTransform(settings.orientation, activeDelta),
        }),
        [settings.orientation, activeDelta]
    );

    console.log('Panel(key: %o, sx: %o)', form.title, sx);

    return <Paper {...props} elevation={settings.elevation} sx={sx} />;
}
