'use strict';

let gulp = require('gulp');
let plugins = require('gulp-load-plugins');
let yargs = require('yargs');

// Load all Gulp plugins into one variable
const $ = plugins();

const app = {
    'isProductive': !!(yargs.argv.production),

    'fn' : [],
    'config': [],
    'tasks': []
};

let fn = require('./gulp/functions')(gulp, plugins, app);

app.fn = fn;
app.config = fn.config.loadConfigs();
app.tasks = fn.tasks.loadTaskConfigs();


/*
 * load dynamically all tasks
 */
fn.tasks.registerTasks( gulp, $, app, app.tasks );


/* ==============================
 *  # Functions
 * ============================== */


/**
 * defaultTask
 * @param done
 */
function defaultTask( done ) {
    // Pruefen, ob alle Tasks bereits definiert und registriert wurden
    fn.tasks.registerDependingTasks( gulp, plugins, app, app.tasks, [
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
