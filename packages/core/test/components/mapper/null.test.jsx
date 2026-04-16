import React from 'react';
import { render } from '@testing-library/react';
import Null from '../../../src/components/mapper/null.jsx';

describe('Null Component', function () {
    it('renders and returns null', function () {
        const mockForm = {
            type: 'null',
            title: 'Null Field',
        };

        const { container } = render(<Null form={mockForm} />);

        // The null component should render nothing
        expect(container.firstChild).to.be.null;
    });

    it('has the correct displayName', function () {
        expect(Null.name).to.equal('Null');
    });
});

