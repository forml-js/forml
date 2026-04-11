import { createRoot } from 'react-dom/client';
import Themes from './components/Themes';
import React, { StrictMode } from 'react';

async function init() {
    const root = createRoot(document.getElementById('app'));
    root.render(
        // <StrictMode>
        <Themes />
        // </StrictMode>
    );
}

document.addEventListener('DOMContentLoaded', init);
