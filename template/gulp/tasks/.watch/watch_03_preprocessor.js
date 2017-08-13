'use strict';

import browser  from 'browser-sync';

let gulp;
let plugins;
let app;
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
        watchPreprocessor
    );
};

/**
 * watchPreprocessor
 * Task-Function
 * @param cb
 * Watch for changes to static preprocessor files
 */
function watchPreprocessor(cb) {
    // TODO determine installed preprocessor and run specific watch file

    return watchSASS(cb);
}

/**
 * watchLESS
 * @param cb
 * Watch for changes to less files
 */
function watchLESS(cb) {
    gulp.watch('src/assets/less/**/*.less', gulp.series('generate-less'));
    cb();
}

/**
 * watchSASS
 * @param cb
 * Watch for changes to less files
 */
function watchSASS(cb) {
    gulp.watch('src/assets/scss/**/*.scss', gulp.series('generate-sass'));
    cb();
}
