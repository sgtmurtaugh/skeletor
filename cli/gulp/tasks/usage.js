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

    // if necessary - register depending tasks
    let self_tasks = app.fn.tasks.registerDependingTasks(self, app.tasks);

    // define Task
    app.fn.tasks.defineTask(self, self_tasks, usage);
};

/**
 * usage
 * @param cb
 */
function usage(cb) {
    console.log('\r\nList of all registred tasks:\r\n');

    let tasks = app.fn.tasks.lookupTasknames(app.tasks);

    if (null !== tasks) {
        for (let task of tasks) {
            console.log(' - ' + task);
        }
    }
    console.log('');
    console.log('npm start {taskname}\r\n');
    cb();
}
