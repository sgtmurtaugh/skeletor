'use strict';

let fs = require('fs');
let path = require('path');

let gulp;
let plugins;
let app;

module.exports = function (_gulp, _plugins, _app) {
    gulp =_gulp;
    plugins = _plugins;
    app = _app;

    return {
        'path' : require('./path-utils'),

        'app' : require('./app-utils'),
        'environment' : require('./environment-utils'),
        'config' : require('./config-utils'),
        'messages' : require('./messages'),
        'helper' : require('./helper-utils'),
        'npm' : require('./npm-utils'),
        'wizard' : require('./install-wizard'),

        'json' : require('./json-utils')(gulp, plugins, app),
        'log' : require('./log-utils')(gulp, plugins, app),
        'tasks' : require('./task-utils')(gulp, plugins, app),
        'template' : require('./template-utils')(gulp, plugins, app),

        'templateEngineSupport' : require('./template-engine-support')(gulp, plugins, app),
        'preprocessorSupport' : require('./preprocessor-support')(gulp, plugins, app),
        'uiFrameworkSupport' : require('./ui-framework-support')(gulp, plugins, app),
        'featureSupport' : require('./feature-support')(gulp, plugins, app),
        'spriteGeneratorSupport' : require('./sprite-generator-support')(gulp, plugins, app),
        'testFrameworkSupport' : require('./test-framework-support')(gulp, plugins, app)
    };
};
