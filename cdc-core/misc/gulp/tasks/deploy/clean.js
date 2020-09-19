'use strict';

import rimraf   from 'rimraf';

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
    gulp.task( 'clean', clean );
};

/**
 * clean
 * Task-Function
 * @param cb
 * Delete the "dist" folder
 * This happens every time a build starts
 */
function clean(cb) {
    rimraf( app.config.paths.dist.path, cb );
}

