'use strict';

let isRoot = require('is-root');

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
    app.fn.tasks.defineTask(self, self_tasks, checkRequirements);
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
