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
    gulp.task( 'copy-assets', copyAssets );
};

/**
 * copyAssets
 * Task-Function
 * Copy files out of the assets folder
 * This task skips over the "img", "js", and "scss" folders, which are parsed separately
 */
function copyAssets() {
    return gulp.src( app.config.paths.src.assets )
        .pipe( gulp.dest( app.config.paths.dist.path + '/assets') );
}
