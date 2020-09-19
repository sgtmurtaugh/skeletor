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
    app.fn.tasks.defineTask(self, self_tasks, deployImages);
};

/**
 * deployImages
 * Task-Function
 * Copy images to the "dist" folder.
 * In production, the images are compressed
 */
function deployImages() {
    return gulp.src( ['src/assets/img/{icons,sprites}/**/*', '!src/assets/img/sprites-src'] )
        .pipe( plugins.if(app.isProductive, plugins.imagemin({
            progressive: true
        })))
        .pipe( gulp.dest('dist/assets/img') );
}
