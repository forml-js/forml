const babelRegister = require('@babel/register');
const jsdom = require('global-jsdom');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const {
    JestAsymmetricMatchers,
    JestChaiExpect,
    JestExtend,
} = require('@vitest/expect');
const sourceMapSupport = require('source-map-support');

sourceMapSupport.install();
babelRegister({
    configFile: './babel.config.js',
    rootMode: 'upward',
});
jsdom({
    pretendToBeVisual: true,
    url: 'http://localhost:3000',
});
chai.use(sinonChai.default);
chai.use(JestExtend);
chai.use(JestChaiExpect);
chai.use(JestAsymmetricMatchers);
