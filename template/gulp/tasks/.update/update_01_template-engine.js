'use strict';

import panini   from 'panini';

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
    app.fn.tasks.defineTask(self, self_tasks, updateTemplateEngine);
};

/**
 * updateTemplateEngine
 * Task-Function
 * Load updated HTML templates and partials into Panini
 * @param cb
 */
function updateTemplateEngine(cb) {

    // TODO determine installed template engine and call specific update method
    return updatePanini(cb);
}

/**
 * updatePanini
 * Load updated HTML templates and partials into Panini
 * @param cb
 */
function updatePanini( cb ) {
    panini.refresh();
    cb();
}
