'use strict';

var gulp;
var plugins;
var app;

module.exports = function ( _gulp, _plugins, _app ) {
    gulp = _gulp;
    plugins = _plugins;
    app = _app;

    // Pruefen, ob alle Tasks bereits definiert und registriert wurden
    app.fn.tasks.ensureTaskDependencies(gulp, plugins, app, app.tasks, [
        'start-server',
        'watch'
    ]);

    // Task definieren
    gulp.task('deliver',
        gulp.series(
            'start-server',
            'watch'
        )
    );
};

/**
 * deliver
 * Task-Function
 * Start Server and watch Sources
 */
function deliver() {
    let tasks = [];
console.log('BAM2!');
    // if (app.tasks.server.startServer) {
    //     tasks.push(app.tasks.server.startServer);
    // }
    //
    // if (app.tasks.watch.watch) {
    //     tasks.push(app.tasks.watch.watch);
    // }
    //
    // if (tasks.length > 0) {
    //     gulp.series(tasks);
    // }
    // else {
    //     console.log('No tasks found for function \'deliver\'!');
    // }
}

// /**
//  * Task: deliver
//  * runs: start-server task, watch task
//  */
// gulp.task('deliver',
//     gulp.series(
//         app.task['start-server'],
//         app.task['watch']
//     )
// );
