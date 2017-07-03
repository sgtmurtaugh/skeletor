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
    gulp.task( app.fn.path.basename(__filename),
        gulp.series(
            app.fn.preprocessor.copyPreprocessorTemplates,
            app.fn.preprocessor.addNPMPreprocessorSupport,
        )
    );
};
