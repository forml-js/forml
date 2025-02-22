import { MenuItem } from '@mui/material';
import React from 'react';

/**
 * @component
 */
export default function Option({ selected, value, onClick, children }) {
    return (
        <MenuItem selected={selected} value={value} onClick={onClick}>
            {children}
        </MenuItem>
    );
}
