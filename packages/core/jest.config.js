module.exports = async () => {
    return {
        rootDir: __dirname,
        reporters: ['default', 'jest-summary-reporter'],
        testPathIgnorePatterns: [
            '/node_modules/',
            '/lib/',
            '/decorator-bootstrap/',
        ],
        transformIgnorePatterns: ['/node_modules/(?!(@mui|@babel)/)'],
        testEnvironment: 'jsdom',
        collectCoverageFrom: ['src/**/*.js', 'src/**/*.jsx'],
        coveragePathIgnorePatterns: ['/__tests__/', '/node_modules/', '/lib/'],
    };
};
