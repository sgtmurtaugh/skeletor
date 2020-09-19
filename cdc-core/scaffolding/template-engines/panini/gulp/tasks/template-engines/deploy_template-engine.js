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
    app.fn.tasks.defineTask(self, self_tasks, executePanini);
};

/**
 * executePanini
 * @return {*}
 */
function executePanini() {
    return gulp.src( app.config.paths.src.path + '/' + app.config.vendor.panini.root + '/**/*.{html,hbs,handlebars}' )
        .pipe( panini({
            root: app.config.paths.src.path + '/' + app.config.vendor.panini.root,
            layouts: app.config.paths.src.path + '/' + app.config.vendor.panini.layouts,
            partials: app.config.paths.src.path + '/' + app.config.vendor.panini.partials,
            data: app.config.paths.src.path + '/' + app.config.vendor.panini.data,
            helpers: app.config.paths.src.path + '/' + app.config.vendor.panini.helpers
        }) )
        .pipe( gulp.dest( app.config.paths.dist.path ) );
}
