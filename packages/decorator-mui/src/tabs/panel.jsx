import React, { useMemo, Suspense } from 'react';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';

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
    const { children, ...forwardProps } = props;

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

    return (
        <Paper {...forwardProps} elevation={settings.elevation} sx={sx}>
            <Suspense fallback={<CircularProgress />}>{children}</Suspense>
        </Paper>
    );
}
