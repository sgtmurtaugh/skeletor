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

    // // Sub-Tasks lookup
    // let self_tasks = app.fn.tasks.lookupDependentTasknames(app.tasks, self);

    // // if necessary - register depending tasks
    // app.fn.tasks.registerDependingTasks(gulp, plugins, app, app.tasks, self_tasks);

    // define task
    gulp.task( self,
        showWizard
    );
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
                app.wizard.projectFolder = app.fn.path.join(
                    app.wizard.directory,
                    app.wizard.name
                );

                // //TODO messages = utils.messages(name);
            })
        );
}
