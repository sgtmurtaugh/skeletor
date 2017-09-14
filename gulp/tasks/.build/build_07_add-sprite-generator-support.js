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
    let self_tasks = app.fn.tasks.registerDependingTasksNeu(app.tasks, self);

    // define Task
    app.fn.tasks.defineTask(self, self_tasks, addSpriteGeneratorSupport);
};

/**
 * addSpriteGeneratorSupport
 * @param cb
 */
function addSpriteGeneratorSupport(cb) {
    app.fn.spriteGenerator.copyDependencies(cb);
    app.fn.spriteGenerator.copyTemplates(cb);
    app.fn.spriteGenerator.addNPMSupport(cb);
    cb();
}
