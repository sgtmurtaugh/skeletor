var gulp;
var plugins;
var app;

module.exports = function ( _gulp, _plugins, _app ) {
    gulp = _gulp;
    plugins = _plugins;
    app = _app;

let build_tasks = app.fn.tasks.lookupDependentTasknames(app.tasks, app.fn.path.basename(__filename));
console.log('build_tasks');
console.log(build_tasks);

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
    gulp.task( app.fn.path.basename(__filename),
        gulp.series(
            'check-requirements',
            'show-wizard',
            'clone-template',
            'add-framework-support',
            'add-preprocessor-support',
            'add-sprite-generator-support',
            'install-clone-dependencies'
        )
    );
};
