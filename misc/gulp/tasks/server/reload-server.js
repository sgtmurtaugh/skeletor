'use strict';

import browser  from 'browser-sync';

var gulp;
var plugins;
var app;

module.exports = function ( _gulp, _plugins, _app ) {
    gulp = _gulp;
    plugins = _plugins;
    app = _app;

    // Pruefen, ob alle Tasks bereits definiert und registriert wurden
    app.fn.tasks.ensureTaskDependencies(gulp, plugins, app, app.tasks, []);

    // Task definieren
    gulp.task( 'reload-server', reloadServer );
};

/**
 * reloadServer
 * Task-Function
 * @param done
 * Reload the browser with BrowserSync
 */
function reloadServer( done ) {
    browser.reload();
    done();
}
