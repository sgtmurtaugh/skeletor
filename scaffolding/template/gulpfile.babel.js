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
// fn.tasks.registerTasks( gulp, $, app, app.tasks );
fn.tasks.registerTasks( app.tasks );


/* ==============================
 *  # Functions
 * ============================== */




/* ==============================
 *  # Tasks
 * ============================== */


