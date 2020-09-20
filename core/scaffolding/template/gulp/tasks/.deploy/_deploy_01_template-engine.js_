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

    // // Sub-Tasks lookup
    // let self_tasks = app.fn.tasks.lookupDependentTasknames(app.tasks, self);
    //
    // // if necessary - register depending tasks
    // app.fn.tasks.registerDependingTasks(gulp, plugins, app, app.tasks, self_tasks);

    // define task
    gulp.task( self,
        runTemplateEngine
    );
};

/**
 * runTemplateEngine
 * Task-Function
 * Executes the installed template engine and deploys the generated files into the dist folder
 */
function runTemplateEngine(cb) {
    // TODO determine installed template engine and call specific execute Methode

    return executePanini();
}

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
