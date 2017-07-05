import isRoot from 'is-root';

let gulp;
let plugins;
let app;
let self;

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
        checkRequirements
    );
};

/**
 * checkRequirements
 * Task-Function
 * @param cb
 * <p>Checks the clone requirements
 */
function checkRequirements(cb) {
    if (isRoot()) {
        console.log(messages.noRoot);
        cb(new Error());
    }
    cb();
}
