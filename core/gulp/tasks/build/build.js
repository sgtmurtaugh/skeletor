'use strict';

let gulp;
let plugins;
let app;
let self;
let selfFolder;

module.exports = function ( _gulp, _plugins, _app ) {
    gulp = _gulp;
    plugins = _plugins;
    app = _app;
    self = app.fn.tasks.taskname(__filename);
    selfFolder = app.fn.tasks.subtasksFolder(__filename);

    // define Task function
    app.fn.tasks.defineTask(self, [
        'build :: 01_check-requirements',
        'build :: 02_show-wizard',
        'build :: 03_clone-template',
        'build :: 04_template-engine',
        'build :: 05_framework-support',
        'build :: 06_preprocessor-support',
        'build :: 07_sprite-generator-support',
        'build :: 08_install-clone-dependencies'
    ], function() {});
};
