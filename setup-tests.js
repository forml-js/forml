const path = require('node:path');
const babelRegister = require('@babel/register');
require('global-jsdom/register');
const mocha = require('mocha');
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const sourceMapSupport = require('source-map-support');

sourceMapSupport.install();
babelRegister({
    configFile: path.resolve(__dirname, 'babel.config.js'),
    rootMode: 'upward',
});
chai.use(sinonChai.default);

global.ResizeObserver = class ResizeObserver {
    observe = sinon.spy();
    unobserve = sinon.spy();
    disconnect = sinon.spy();
};
