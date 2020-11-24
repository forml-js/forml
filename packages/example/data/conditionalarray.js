module.exports = {
    'schema': {
        'type': 'object',
        'title': 'Conditional Elements in Arrays',
        'properties': {
            'notes': {
                'type': 'array',
                'items': {
                    'type': 'object',
                    'properties': {
                        'basicInfo': {'type': 'string', 'title': 'Basic Information'},
                        'additionalInfoRequired':
                            {'type': 'boolean', 'title': 'Addition Information Required'},
                        'additionalInfo': {'type': 'string', 'title': 'Additional Information'}
                    }
                }
            }
        }
    },
    'form': function(props, model) {
        return [{
            'key': 'notes',
            'type': 'array',
            'items': [
                {
                    type: 'dynamic',
                    key: 'notes[]',
                    generate(props, model) {
                        const forms = [
                            'basicInfo',
                            'additionalInfoRequired',
                        ];

                        if (model.additionalInfoRequired) {
                            forms.push({
                                'key': 'additionalInfo',
                                'type': 'textarea',
                            });
                        }

                        forms.push({
                            'type': 'help',
                            'description':
                                'key will be: [\'notes\', x, \'additionalInfo\'], where x is the index of the array, so use \'form.key[1]\' to get index'
                        });

                        return forms;
                    }
                },
            ]
        }];
    }
}
