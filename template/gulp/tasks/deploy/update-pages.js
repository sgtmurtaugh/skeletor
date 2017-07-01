import panini   from 'panini';

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
    gulp.task( 'update-pages', updatePages );
};

/**
 * updatePages
 * Task-Function
 * Load updated HTML templates and partials into Panini
 * @param done
 */
function updatePages( done ) {
    panini.refresh();
    done();
}
