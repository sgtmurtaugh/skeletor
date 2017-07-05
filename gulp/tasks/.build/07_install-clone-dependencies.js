let gulp;
let plugins;
let app;
let self;

module.exports = function ( _gulp, _plugins, _app ) {
    gulp = _gulp;
    plugins = _plugins;
    app = _app;
    self = app.fn.tasks.taskname(__filename);

    // // Sub-Tasks lookup
    // let self_tasks = app.fn.tasks.lookupDependentTasknames(app.tasks, self);

    // // if necessary - register depending tasks
    // app.fn.tasks.ensureRegistrationOfDependingTasks(gulp, plugins, app, app.tasks, self_tasks);

    // define task
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
