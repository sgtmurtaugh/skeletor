import browser  from 'browser-sync';

var gulp;
var plugins;
var app;
let self;

module.exports = function ( _gulp, _plugins, _app ) {
    gulp = _gulp;
    plugins = _plugins;
    app = _app;
    self = app.fn.tasks.taskname(__filename);

    // // Pruefen, ob alle Tasks bereits definiert und registriert wurden
    // app.fn.tasks.ensureTaskDependencies(gulp, plugins, app, app.tasks, []);
    //
    // // Task definieren
    // gulp.task( 'watch', watch );

    // Sub-Tasks lookup
    let self_tasks = app.fn.tasks.lookupDependentTasknames(app.tasks, self);

    // if necessary - register depending tasks
    app.fn.tasks.registerDependingTasks(gulp, plugins, app, app.tasks, self_tasks);

    // define task
    gulp.task( self,
        watch
    );
};

/**
 * watch
 * Task-Function
 * @param cb
 * Watch for changes to static assets, pages, Sass, and JavaScript
 */
function watch(cb) {
    gulp.watch(app.config.paths.assets, gulp.series('copy-assets'));
    gulp.watch('src/pages/**/*.html').on('change', gulp.series('generate-pages', browser.reload));
    gulp.watch('src/{layouts,partials}/**/*.html').on('change', gulp.series('update-pages', 'generate-pages', browser.reload));
    gulp.watch('src/assets/scss/**/*.scss', gulp.series('generate-sass'));
    gulp.watch('src/assets/js/**/*.js').on('change', gulp.series('generate-javascript', browser.reload));
    gulp.watch('src/assets/img/**/*').on('change', gulp.series('copy-images', browser.reload));
    // gulp.watch('src/styleguide/**').on('change', gulp.series('generate-styleguide', browser.reload));
    cb();
}
