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
    app.fn.tasks.defineTask(self, [], 'build :: build');
};
