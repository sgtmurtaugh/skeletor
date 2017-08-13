import browser  from 'browser-sync';

var gulp;
var plugins;
var app;
let self;

module.exports = function ( _gulp, _plugins, _app ) {
    gulp = _gulp;
    plugins = _plugins;
    app = _app;
    self = app.fn.tasks.taskname(__filename);

    // // Pruefen, ob alle Tasks bereits definiert und registriert wurden
    // app.fn.tasks.ensureTaskDependencies(gulp, plugins, app, app.tasks, []);
    //
    // // Task definieren
    // gulp.task( 'start-server', startServer );

    // Sub-Tasks lookup
    let self_tasks = app.fn.tasks.lookupDependentTasknames(app.tasks, self);

    // if necessary - register depending tasks
    app.fn.tasks.registerDependingTasks(gulp, plugins, app, app.tasks, self_tasks);

    // define task
    gulp.task( self,
        startServer
    );
};

/**
 * startServer
 * Task-Function
 * @param done
 * Start a server with BrowserSync to preview the site in
 */
function startServer( done ) {
    browser.init({
        server: app.config.paths.dist.path,
        port: app.config.vendor.server.development.port
    });
    done();
}
