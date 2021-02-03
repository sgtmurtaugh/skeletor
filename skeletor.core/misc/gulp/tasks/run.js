'use strict';

var gulp;
var plugins;
var app;

module.exports = function ( _gulp, _plugins, _app ) {
    gulp = _gulp;
    plugins = _plugins;
    app = _app;

    // Pruefen, ob alle Tasks bereits definiert und registriert wurden
    app.fn.tasks.ensureTaskDependencies( gulp, plugins, app, app.tasks, [
        'build',
        'deliver'
    ]);

    // Task definieren
    gulp.task( 'run',
        gulp.series(
            'build',
            'deliver'
        )
    );
};
