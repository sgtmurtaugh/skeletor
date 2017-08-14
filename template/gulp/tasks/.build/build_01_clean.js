'use strict';

import rimraf   from 'rimraf';

let gulp;
let plugins;
let app;
let self;

module.exports = function ( _gulp, _plugins, _app ) {
    gulp = _gulp;
    plugins = _plugins;
    app = _app;
    self = app.fn.tasks.taskname(__filename);

    // define task
    gulp.task( self,
        clean
    );
};

/**
 * clean
 * Task-Function
 * @param cb
 * Delete the "dist" folder
 * This happens every time a build starts
 */
function clean(cb) {
    rimraf( app.config.paths.dist.path, cb );
}
