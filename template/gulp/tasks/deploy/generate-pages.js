import panini   from 'panini';

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
    gulp.task('generate-pages', generatePages );
};

/**
 * generatePages
 * Task-Function
 * Copy page templates into finished HTML files
 */
function generatePages() {
    return gulp.src( app.config.paths.src.path + '/' + app.config.vendor.panini.root + '/**/*.{html,hbs,handlebars}' )
        .pipe( panini({
            root: app.config.paths.src.path + '/' + app.config.vendor.panini.root,
            layouts: app.config.paths.src.path + '/' + app.config.vendor.panini.layouts,
            partials: app.config.paths.src.path + '/' + app.config.vendor.panini.partials,
            data: app.config.paths.src.path + '/' + app.config.vendor.panini.data,
            helpers: app.config.paths.src.path + '/' + app.config.vendor.panini.helpers
        }) )
        .pipe( gulp.dest( app.config.paths.dist.path ) );
}
