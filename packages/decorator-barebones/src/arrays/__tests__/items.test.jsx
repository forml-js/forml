import Items from '../items';
import React from 'react';
import { render } from '@testing-library/react';
import Context from '@forml/context';

describe('renders', function () {
    let localizer;
    beforeEach(function () {
        localizer = { getLocalizedString: jest.fn((id) => id) };
    });
    test('its children', function () {
        const { container } = render(
            <Context.Provider value={{ localizer }}>
                <Items>
                    <div id="test">test</div>
                </Items>
            </Context.Provider>
        );

        expect(container).toMatchSnapshot();
        expect(container.querySelector('#test')).not.toBeNull();
        expect(localizer.getLocalizedString).toHaveBeenCalled();
    });
});
