import { useValue } from '@forml/hooks';
export const schema = {
    type: 'object',
    title: 'Issue Report',
    properties: {
        hadIssues: {
            title: 'Did you have any issues?',
            type: 'boolean',
            default: false,
        },
        issues: {
            type: 'array',
            title: 'Issues',
            items: {
                type: 'object',
                title: 'Issue',
                properties: {
                    summary: { type: 'string' },
                    description: { type: 'string' },
                },
            },
        },
    },
};
export function form() {
    return [
        'hadIssues',
        {
            type: 'dynamic',
            key: [],
            generate() {
                const hadIssues = useValue(['hadIssues']);
                return hadIssues
                    ? [
                          {
                              type: 'array',
                              key: 'issues',
                              items: [
                                  {
                                      type: 'fieldset',
                                      items: [
                                          'issues[].summary',
                                          {
                                              type: 'textarea',
                                              key: 'issues[].description',
                                          },
                                      ],
                                  },
                              ],
                          },
                      ]
                    : [];
            },
        },
    ];
}
