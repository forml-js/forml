module.exports = async () => {
    return {
        rootDir: __dirname,
        coverageReporters: [
            'json',
            'text',
            'clover',
            ['lcov', { projectRoot: __dirname }],
        ],
        testEnvironment: 'jsdom',
        testPathIgnorePatterns: [
            '/node_modules/',
            '/lib/',
            '/decorator-bootstrap/',
        ],
        transformIgnorePatterns: ['/node_modules/(?!(@mui|@babel)/)'],
        collectCoverage: true,
        collectCoverageFrom: [
            'packages/*/src/**/*.js',
            'packages/*/src/**/*.jsx',
        ],
        coveragePathIgnorePatterns: [
            '/node_modules/',
            '/lib/',
            '/decorator-bootstrap/',
        ],
    };
};
