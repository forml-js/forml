module.exports = async () => {
    return {
        rootDir: __dirname,
        testPathIgnorePatterns: ['lib/**/*.js'],
        coverageReporters: [
            'json',
            'text',
            'clover',
            ['lcov', { projectRoot: __dirname }],
        ],
        collectCoverage: true,
        collectCoverageFrom: ['src/**/*.js', 'src/**/*.jsx'],
    };
};
