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
        'clean',
        'generate-pages',
        'generate-sass',
        'generate-javascript',
        'copy-images',
        'copy-assets'
    ]);

    // Task definieren
    gulp.task( 'build',
         gulp.series(
             'clean',
             gulp.parallel(
                 'generate-pages',
                 'generate-sass',
                 'generate-javascript',
                 'copy-images',
                 'copy-assets'
             )
         )
    );
};
