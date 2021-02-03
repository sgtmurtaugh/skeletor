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

    // if necessary - register depending tasks
    let self_tasks = app.fn.tasks.registerDependingTasksNeu(app.tasks, self);

    // define Task
    app.fn.tasks.defineTask(self, self_tasks, watchStyleguide);
};

/**
 * watchStyleguide
 * Task-Function
 * @param cb
 * Watch for changes to static assets, pages, Sass, and JavaScript
 */
function watchStyleguide(cb) {
    // gulp.watch('src/styleguide/**').on('change', gulp.series('generate-styleguide', browser.reload));
    cb();
}
