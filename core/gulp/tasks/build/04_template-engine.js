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
    app.fn.tasks.defineTask(self, gulp.series(
        app.fn.templateEngine.copyDependencies,
        app.fn.templateEngine.copyTemplates,
        app.fn.templateEngine.addNPMSupport
    ), () => {});
};
