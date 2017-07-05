var gulp;
var plugins;
var app;
var self;

module.exports = function ( _gulp, _plugins, _app ) {
    gulp = _gulp;
    plugins = _plugins;
    app = _app;
    self = app.fn.tasks.taskname(__filename);

    // Sub-Tasks ermitteln
    let self_tasks = app.fn.tasks.lookupDependentTasknames(app.tasks, self);

    // Pruefen, ob alle Tasks bereits definiert und registriert wurden
    app.fn.tasks.ensureTaskDependencies(gulp, plugins, app, app.tasks, self_tasks);

    // Task definieren
    gulp.task( self,
        installCloneDependencies
    );
};

/**
 * installCloneDependencies
 * @param cb
 * <p>Installs the project dependencies using gulp-install, when the flag 'installDependencies' is set to true.
 */
function installCloneDependencies(cb) {
    if (app.wizard.installDependencies) {
        return gulp.src(
                app.fn.path.join(
                    app.wizard.projectFolder,
                    app.config.paths.recursive
                )
            )
            .pipe(plugins.install());
    }
    cb();
}
