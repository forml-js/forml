import { CircularProgress, Paper, styled } from '@mui/material';
import React, { Suspense } from 'react';

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

const StyledPaper = styled(Paper)((props) => ({
    display: 'flex',
    transition: 'all 0.3s',
    flex: '1 1 100%',
    height: '100%',
    position: paperPosition(props.delta),
    zIndex: paperZIndex(props.delta),
    transform: paperTransform(props.orientation, props.delta),
}));

export default function Panel(props) {
    const { activeDelta, form, parent } = props;
    const { children, ...forwardProps } = props;

    const elevation = 'elevation' in form ? form.elevation : 0;
    const orientation = 'layout' in parent ? parent.layout : 'horizontal';

    return (
        <StyledPaper orientation={orientation} elevation={elevation}>
            <Suspense fallback={<CircularProgress />}>{children}</Suspense>
        </StyledPaper>
    );
}
