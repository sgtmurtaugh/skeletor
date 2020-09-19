'use strict';

let templateEngine = require('../template-engines/deploy_template-engine');

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
    app.fn.tasks.defineTask(self, self_tasks, deployTemplateEngine);
};

/**
 * deployTemplateEngine
 * Task-Function
 * @param cb
 * @return {*}
 * TODO
 */
function deployTemplateEngine(cb) {
    if ( app.fn.typeChecks.isFunction(templateEngine) ) {
        return templateEngine( gulp, plugins, app );
    }
    cb();
}