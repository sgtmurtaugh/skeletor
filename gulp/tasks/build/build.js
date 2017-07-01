var gulp;
var plugins;
var app;

module.exports = function ( _gulp, _plugins, _app ) {
    gulp = _gulp;
    plugins = _plugins;
    app = _app;

    // Pruefen, ob alle Tasks bereits definiert und registriert wurden
    app.fn.tasks.ensureTaskDependencies(gulp, plugins, app, app.tasks, [
        'check-requirements',
        'show-wizard',
        'clone-template',
        'add-framework-support',
        'add-preprocessor-support',
        'add-sprite-generator-support',
        'install-clone-dependencies',
    ]);

    // Task definieren
    gulp.task('build',
        gulp.series(
            'check-requirements',
            'show-wizard',
            'clone-template',
            'add-framework-support',
            'add-preprocessor-support',
            'add-sprite-generator-support',
            'install-clone-dependencies',
        )
    );
};
