import React, { useMemo, useRef } from 'react';
import * as MuiComponents from './collection/mui/index.jsx';
import * as MantineComponents from './collection/mantine/index.jsx';
import Page from './Page';
import ComponentProvider from './ComponentProvider.jsx';
import { SampleProvider, useSampleDecorator } from '../samples.jsx';

function MantineProvider(props) {
    return (
        <ComponentProvider value={MantineComponents}>
            <MantineComponents.Provider withGlobalStyles withNormalizeCSS>
                {props.children}
            </MantineComponents.Provider>
        </ComponentProvider>
    );
}
function MaterialUIProvider(props) {
    return (
        <ComponentProvider value={MuiComponents}>
            <MuiComponents.Provider>{props.children}</MuiComponents.Provider>
        </ComponentProvider>
    );
}

function Provider(props) {
    const [decorator] = useSampleDecorator();
    const ComponentProvider = useMemo(() => {
        if (decorator.startsWith('Mantine')) {
            console.log('Provider: Mantine');
            return MantineProvider;
        } else if (decorator.startsWith('Material UI')) {
            console.log('Provider: Material UI');
            return MaterialUIProvider;
        } else {
            console.log('Default Provider: Material UI');
            return MaterialUIProvider;
        }
    });

    return <ComponentProvider>{props.children}</ComponentProvider>;
}

export default function ThemeProvider(props) {
    return (
        <SampleProvider>
            <Provider>
                <Page />
            </Provider>
        </SampleProvider>
    );
}
