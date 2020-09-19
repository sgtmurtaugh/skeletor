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
    app.fn.tasks.defineTask(self, self_tasks, generateJavascript);
};

/**
 * generateJavascript
 * Task-Function
 * Combine JavaScript into one file
 * In production, the file is minified
 */
function generateJavascript() {
    return gulp.src( app.config.paths.src.javascript )
        .pipe( plugins.sourcemaps.init() )
        .pipe( plugins.babel() )
        .pipe( plugins.concat('app.js') )
        .pipe( plugins.if(app.isProductive, plugins.uglify()
            .on('error', e => { console.log(e); })
        ) )
        .pipe( plugins.if( !app.isProductive, plugins.sourcemaps.write() ) )
        .pipe( gulp.dest( app.config.paths.dist.javascript ) );
}
