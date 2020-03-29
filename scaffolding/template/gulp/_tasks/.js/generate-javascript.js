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
    // gulp.task( 'generate-javascript', generateJavascript );

    // Sub-Tasks lookup
    let self_tasks = app.fn.tasks.lookupDependentTasknames(app.tasks, self);

    // if necessary - register depending tasks
    app.fn.tasks.registerDependingTasks(gulp, plugins, app, app.tasks, self_tasks);

    // define task
    gulp.task( self,
        generateJavascript
    );
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
