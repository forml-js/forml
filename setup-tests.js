const babelRegister = require('@babel/register');
require('global-jsdom/register');
const mocha = require('mocha');
const chai = require('chai');
const sinon = require('sinon');
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
chai.use(sinonChai.default);
chai.use(JestExtend);
chai.use(JestChaiExpect);
chai.use(JestAsymmetricMatchers);

global.ResizeObserver = class ResizeObserver {
    observe = sinon.spy();
    unobserver = sinon.spy();
    disconnect = sinon.spy();
};
