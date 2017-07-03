'use strict';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins');
var yargs = require('yargs');

var fn = require('./gulp/functions');

// Load all Gulp plugins into one variable
const $ = plugins();

const app = {
    'config': fn.config.loadConfigs(),
    'tasks': fn.tasks.loadTaskConfigs(),
    'isProductive': !!(yargs.argv.production),
    'fn' : fn
};

/*
 * load dynamically all tasks
 */
fn.tasks.addTasks( gulp, $, app, app.tasks );


/* ==============================
 *  # Functions
 * ============================== */


/**
 * defaultTask
 * @param done
 */
function defaultTask( done ) {
    // Pruefen, ob alle Tasks bereits definiert und registriert wurden
    fn.tasks.ensureTaskDependencies( gulp, plugins, app, app.tasks, [
        'run',
    ]);
    done();
}

/**
 * usage
 * @param done
 */
function usage( done ) {
    console.log('\r\nList of all registred tasks:\r\n');
    fn.tasks.lookupTasknames(app.tasks);
    console.log('');
    console.log('npm start {taskname}\r\n');
    done();
}



/* ==============================
 *  # Tasks
 * ============================== */


/**
 * Task: default
 * runs: run task
 */
gulp.task('default',
    gulp.series(
        defaultTask,
        'run'
    )
);

/**
 * Task: usage
 * runs: usage function
 */
gulp.task('usage',
    usage
);
