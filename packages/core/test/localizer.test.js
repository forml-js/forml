import { defaultLocalizer, getLocalizer } from '../src/localizer.js';

describe('defaultLocalizer', function () {
    it('returns a localizer object', function () {
        const localizer = defaultLocalizer();

        expect(localizer).to.be.a('function');
        expect(localizer.getLocalizedString).to.be.a('function');
        expect(localizer.getLocalizedDate).to.be.a('function');
        expect(localizer.getLocalizedNumber).to.be.a('function');
    });

    it('getLocalizedString returns input unchanged', function () {
        const localizer = defaultLocalizer();
        const input = 'test string';

        expect(localizer.getLocalizedString(input)).to.equal(input);
    });

    it('getLocalizedDate returns input unchanged', function () {
        const localizer = defaultLocalizer();
        const input = new Date();

        expect(localizer.getLocalizedDate(input)).to.equal(input);
    });

    it('getLocalizedNumber returns input unchanged', function () {
        const localizer = defaultLocalizer();
        const input = 42;

        expect(localizer.getLocalizedNumber(input)).to.equal(input);
    });

    it('main localizer function routes based on value type', function () {
        const localizer = defaultLocalizer();

        // String routing
        expect(localizer('string')).to.equal('string');

        // Number routing
        expect(localizer(123)).to.equal(123);

        // Date routing
        const date = new Date();
        expect(localizer(date)).to.equal(date);
    });
});

describe('getLocalizer', function () {
    describe('with function template', function () {
        it('creates localizer from function template', function () {
            const template = (value) => `localized_${value}`;
            const localizer = getLocalizer(template);

            expect(localizer).to.be.a('function');
            expect(localizer.getLocalizedString).to.be.a('function');
            expect(localizer.getLocalizedDate).to.be.a('function');
            expect(localizer.getLocalizedNumber).to.be.a('function');
        });

        it('uses template function for all localization methods', function () {
            const template = (value) => `custom_${value}`;
            const localizer = getLocalizer(template);

            expect(localizer.getLocalizedString('test')).to.equal(
                'custom_test'
            );
            expect(localizer.getLocalizedDate('date')).to.equal('custom_date');
            expect(localizer.getLocalizedNumber('number')).to.equal(
                'custom_number'
            );
        });

        it('preserves existing methods on function template', function () {
            const template = (value) => `default_${value}`;
            template.getLocalizedString = (value) => `string_${value}`;
            template.getLocalizedDate = (value) => `date_${value}`;
            template.getLocalizedNumber = (value) => `number_${value}`;

            const localizer = getLocalizer(template);

            expect(localizer.getLocalizedString('test')).to.equal(
                'string_test'
            );
            expect(localizer.getLocalizedDate('test')).to.equal('date_test');
            expect(localizer.getLocalizedNumber('test')).to.equal(
                'number_test'
            );
        });

        it('routes values correctly through main function', function () {
            const template = (value) => `fallback_${value}`;
            template.getLocalizedString = (value) => `str_${value}`;
            template.getLocalizedDate = (value) => `date_${value}`;
            template.getLocalizedNumber = (value) => `num_${value}`;

            const localizer = getLocalizer(template);

            expect(localizer('text')).to.equal('str_text');
            expect(localizer(42)).to.equal('num_42');

            const date = new Date();
            expect(localizer(date)).to.equal(`date_${date}`);
        });
    });

    describe('with object template', function () {
        it('creates localizer from object template', function () {
            const template = {
                getLocalizedString: (value) => `obj_string_${value}`,
                getLocalizedDate: (value) => `obj_date_${value}`,
                getLocalizedNumber: (value) => `obj_number_${value}`,
            };

            const localizer = getLocalizer(template);

            expect(localizer).to.be.a('function');
            expect(localizer.getLocalizedString).to.be.a('function');
            expect(localizer.getLocalizedDate).to.be.a('function');
            expect(localizer.getLocalizedNumber).to.be.a('function');
        });

        it('uses provided methods from object template', function () {
            const template = {
                getLocalizedString: (value) => `custom_string_${value}`,
                getLocalizedDate: (value) => `custom_date_${value}`,
                getLocalizedNumber: (value) => `custom_number_${value}`,
            };

            const localizer = getLocalizer(template);

            expect(localizer.getLocalizedString('test')).to.equal(
                'custom_string_test'
            );
            expect(localizer.getLocalizedDate('test')).to.equal(
                'custom_date_test'
            );
            expect(localizer.getLocalizedNumber('test')).to.equal(
                'custom_number_test'
            );
        });

        it('fills in missing methods with noop', function () {
            const template = {
                getLocalizedString: (value) => `custom_${value}`,
                // getLocalizedDate and getLocalizedNumber are missing
            };

            const localizer = getLocalizer(template);

            expect(localizer.getLocalizedString('test')).to.equal(
                'custom_test'
            );
            expect(localizer.getLocalizedDate('test')).to.equal('test'); // noop behavior
            expect(localizer.getLocalizedNumber('test')).to.equal('test'); // noop behavior
        });

        it('routes values correctly through main function', function () {
            const template = {
                getLocalizedString: (value) => `str_${value}`,
                getLocalizedDate: (value) => `date_${value}`,
                getLocalizedNumber: (value) => `num_${value}`,
            };

            const localizer = getLocalizer(template);

            expect(localizer('text')).to.equal('str_text');
            expect(localizer(42)).to.equal('num_42');

            const date = new Date();
            expect(localizer(date)).to.equal(`date_${date}`);
        });
    });

    it('handles undefined template', function () {
        const localizer = getLocalizer();

        expect(localizer).to.be.a('function');
        expect(localizer('test')).to.equal('test');
        expect(localizer(42)).to.equal(42);

        const date = new Date();
        expect(localizer(date)).to.equal(date);
    });

    it('handles null template', function () {
        const localizer = getLocalizer(null);

        expect(localizer).to.be.a('function');
        expect(localizer('test')).to.equal('test');
    });
});

