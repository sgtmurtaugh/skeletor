'use strict';

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
    //
    // // if necessary - register depending tasks
    // app.fn.tasks.registerDependingTasks(gulp, plugins, app, app.tasks, self_tasks);

    // define task
    gulp.task( self,
        deployAssets
    );
};

/**
 * deployAssets
 * Task-Function
 * Copy files out of the assets folder
 * This task skips over the "img", "js", and "scss" folders, which are parsed separately
 */
function deployAssets() {
    return gulp.src( app.config.paths.src.assets )
        .pipe( gulp.dest( app.config.paths.dist.path + '/assets') );
}
