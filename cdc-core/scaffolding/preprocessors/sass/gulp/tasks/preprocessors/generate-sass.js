import browser  from 'browser-sync';

var gulp;
var plugins;
var app;

module.exports = function ( _gulp, _plugins, _app ) {
    gulp = _gulp;
    plugins = _plugins;
    app = _app;

    // Pruefen, ob alle Tasks bereits definiert und registriert wurden
    app.fn.tasks.ensureTaskDependencies(gulp, plugins, app, app.tasks, []);

    // Task definieren
    gulp.task( 'generate-sass', generateSASS );
};

/**
 * generateSASS
 * Task-Function
 * Compile Sass into CSS
 * In production, the CSS is compressed
 */
function generateSASS() {
    return gulp.src( app.config.paths.src.sass )
        .pipe( plugins.sourcemaps.init() )
        .pipe( plugins.sass({
                includePaths: app.config.paths.src.sass
            }).
            on( 'error', plugins.sass.logError )
        )
        .pipe( plugins.autoprefixer({
            browsers: app.config.vendor.autoprefixer.compatibility
        }))
        // Comment in the pipe below to run UnCSS in production
        // .pipe( plugins.if( app.isProductive, plugins.uncss( app.config.vendor.uncss.UNCSS_OPTIONS ) ) )
        .pipe( plugins.if( app.isProductive, plugins.cssnano() ) )
        .pipe( plugins.if( !app.isProductive, plugins.sourcemaps.write() ) )
        .pipe( gulp.dest( app.config.paths.dist.css ) )
        .pipe( browser.reload({ stream: true }) );
}
