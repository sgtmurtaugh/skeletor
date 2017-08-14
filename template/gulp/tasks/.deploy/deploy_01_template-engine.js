'use strict';

let templateEngine = require('../template-engines/deploy_template-engine');

let gulp;
let plugins;
let app;
let self;

module.exports = function ( _gulp, _plugins, _app ) {
    gulp = _gulp;
    plugins = _plugins;
    app = _app;
    self = app.fn.tasks.taskname(__filename);

    if ( app.fn.typeChecks.isFunction(templateEngine) ) {
        templateEngine( gulp, plugins, app );
    }
};
