module.exports = async () => {
  return {
    rootDir: __dirname,
    coverageReporters: [
      "json",
      "text",
      "clover",
      ["lcov", { projectRoot: __dirname }],
    ],
    testPathIgnorePatterns: ["/node_modules/", "/lib/"],
    collectCoverage: true,
    collectCoverageFrom: ["packages/*/src/**/*.js", "packages/*/src/**/*.jsx"],
  };
};
