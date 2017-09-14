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
    app.fn.tasks.defineTask(self, self_tasks, watchTemplateEngine);
};

/**
 * watchTemplateEngine
 * Task-Function
 * @param cb
 * Watch for changes to static assets, pages, Sass, and JavaScript
 */
function watchTemplateEngine(cb) {
    return watchPanini(cb);
}

/**
 * watchPanini
 * @param cb
 * TODO
 */
function watchPanini(cb) {
    gulp.watch('src/pages/**/*.html').on('change', gulp.series('generate-pages', browser.reload));
    gulp.watch('src/{layouts,partials}/**/*.html').on('change', gulp.series('update-pages', 'generate-pages', browser.reload));
    cb();
}
