'use strict';

import browser  from 'browser-sync';

let gulp;
let plugins;
let app;
let self;

module.exports = function ( _gulp, _plugins, _app ) {
    gulp = _gulp;
    plugins = _plugins;
    app = _app;
    self = app.fn.tasks.taskname(__filename);

    // if necessary - register depending tasks
    let self_tasks = app.fn.tasks.registerDependingTasksNeu(app.tasks, self);

    // define Task
    app.fn.tasks.defineTask(self, self_tasks, startServer());
};

/**
 * startServer
 * Task-Function
 * @param cb
 * Start a server with BrowserSync to preview the site in
 */
function startServer( cb ) {
    browser.init({
        server: app.config.paths.dist.path,
        port: app.config.vendor.server.development.port
    });
    cb();
}
