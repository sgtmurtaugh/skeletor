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
    // app.fn.tasks.ensureTaskDependencies( gulp, plugins, app, app.tasks, [
    //     'clean',
    //     'generate-pages',
    //     'generate-less',
    //     'generate-sass',
    //     'generate-javascript',
    //     'copy-images',
    //     'copy-assets'
    // ]);
    //
    // // Task definieren
    // gulp.task( 'build',
    //      gulp.series(
    //          'clean',
    //          gulp.parallel(
    //              'generate-pages',
    //              'generate-less',
    //              'generate-sass',
    //              'generate-javascript',
    //              'copy-images',
    //              'copy-assets'
    //          )
    //      )
    // );

    // Sub-Tasks lookup
    let self_tasks = app.fn.tasks.lookupDependentTasknames(app.tasks, self);

    // if necessary - register depending tasks
    app.fn.tasks.registerDependingTasks(gulp, plugins, app, app.tasks, self_tasks);

    // define task
    gulp.task( self,
        gulp.series(
            'clean',
            gulp.parallel(
                'generate-pages',
                'generate-less',
                'generate-sass',
                'generate-javascript',
                'copy-images',
                'copy-assets'
            )
        )
    );
};
