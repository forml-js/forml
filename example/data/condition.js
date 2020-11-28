module.exports = {
    formId: 'com.networknt.light.user.address',
    version: 1,
    action: [
        {
            category: 'user',
            name: 'addAddress',
            readOnly: false,
            title: 'New',
        },
    ],
    schema: {
        type: 'object',
        required: ['delivery'],
        title: 'Address',
        properties: {
            delivery: {
                title: 'Select delivery option',
                type: 'string',
            },
            firstName: {
                title: 'First Name',
                type: 'string',
            },
            lastName: {
                title: 'Last Name',
                type: 'string',
            },
            apartmentSuiteNumber: {
                title: 'Apartment/Suite Number',
                type: 'string',
            },
            address: {
                title: 'Address',
                type: 'string',
            },
            city: {
                title: 'City',
                type: 'string',
                description: 'Please enter full city name',
            },
            province: {
                title: 'Province',
                type: 'string',
                enum: [
                    'AB',
                    'BC',
                    'MB',
                    'NB',
                    'NF',
                    'NS',
                    'NT',
                    'NU',
                    'ON',
                    'PE',
                    'QC',
                    'SK',
                    'YK',
                ],
            },
            postalCode: {
                title: 'Postal Code',
                type: 'string',
            },
            country: {
                title: 'Country',
                type: 'string',
                enum: ['Canada'],
            },
            phone: {
                title: 'Phone',
                type: 'string',
                description: 'Please include area code',
            },
            pickupAddress: {
                title: 'Select a pickup address',
                type: 'string',
            },
        },
    },
    form: [
        {
            key: 'delivery',
            type: 'select',
            titleMap: [
                {
                    value: 'S',
                    name: 'Shipping',
                },
                {
                    value: 'P',
                    name: 'Pickup',
                },
            ],
        },
        {
            key: 'pickupAddress',
            condition: "model.delivery === 'P'",
            type: 'select',
            titleMap: [
                {
                    value: 'address1',
                    name: '22 Front Street, Toronto ON, P1P1P1',
                },
                {
                    value: 'address2',
                    name: '10 King Street, Mississauga ON, L1L1L1',
                },
            ],
        },
        {
            type: 'dynamic',
            key: [],
            generate: (props, model) => {
                let items = [];
                if (model.delivery === 'S') {
                    items = [
                        ...items,
                        'firstName',
                        'lastName',
                        'address',
                        'city',
                        'postalCode',
                        'phone',
                        'country',
                        'province',
                    ];
                }
                return items;
            },
        },
    ],
};
