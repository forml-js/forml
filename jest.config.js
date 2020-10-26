module.exports = async () => {
    return {
        rootDir: __dirname,
        coverageReporters: [
            "json",
            "text",
            "clover",
            ["lcov", { projectRoot: __dirname }]
        ]
    }
}
