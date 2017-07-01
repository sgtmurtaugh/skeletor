var path = require('path');

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
    gulp.task( 'show-wizard', showWizard );
};

/**
 * showWizard
 * Task-Function
 * <p>Prompts the cloning configurations wizard to the user
 * @return {*}
 */
function showWizard() {
    return gulp.src(process.cwd())
        .pipe(plugins.prompt.prompt(app.fn.wizard(plugins.prompt.inq, app.config), function (answers) {
                // assign user answers to installVariables object
                app.wizard = answers;

                // add projectFolder variable (concatenated path for directory and name)
                app.wizard.projectFolder = path.join( app.wizard.directory, app.wizard.name );

                // //TODO messages = utils.messages(name);
            })
        );
}
