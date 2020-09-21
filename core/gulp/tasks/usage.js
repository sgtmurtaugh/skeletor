'use strict';

let gulp;
let plugins;
let app;
let self;
let selfFolder;

module.exports = function (_gulp, _plugins, _app) {
    gulp = _gulp;
    plugins = _plugins;
    app = _app;
    self = app.fn.tasks.taskname(__filename);
    selfFolder = app.fn.tasks.subtasksFolder(__filename);

    // define Task function
    app.fn.tasks.defineTask(self, [], usage);
};

/**
 * usage
 * @param {fn} callback
 */
function usage(callback) {
    console.log(
        '\nList of all registered tasks:\n'.bold.underline);

    let tasks = app.fn.tasks.getRegisteredGulpTasks();

    if (app.fn.typechecks.isNotEmpty(tasks)) {
        // sort tasks alphabetically
        app.modules.arraySort(tasks);

        for (let task of tasks) {
            console.log(' - '.bold + task.yellow);
        }
    }

    console.log(
        '\nusage:'.bold +
        '\n  npm start '.green + '{taskname}'.italic.yellow +
        '\nor'.italic +
        '\n  gulp '.green + '{taskname}\n'.italic.yellow
    );
    callback();
}
