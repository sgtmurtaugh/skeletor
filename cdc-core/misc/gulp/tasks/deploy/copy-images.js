'use strict';

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
    gulp.task( 'copy-images', copyImages );
};

/**
 * copyImages
 * Task-Function
 * Copy images to the "dist" folder.
 * In production, the images are compressed
 */
function copyImages() {
    return gulp.src( ['src/assets/img/{icons,sprites,svg-sprites}/**/*', '!src/assets/img/sprites-src'] )
        .pipe( plugins.if(app.isProductive, plugins.imagemin({
            progressive: true
        })))
        .pipe( gulp.dest('dist/assets/img') );
}
