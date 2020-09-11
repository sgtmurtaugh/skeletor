'use strict';

let gulp = require('gulp');
let gulpPlugins = require('gulp-load-plugins');
let yargs = require('yargs');
// var promise = require('es6-promise');

// Load all Gulp plugins into one variable
const plugins = gulpPlugins();

const app = {
    'isProductive': !!(yargs.argv.production),

    'const' : {
        'REGEX_PLACEHOLDER_CLICKDUMMY_CREATOR' : /clickdummy-creator-placeholder/,
        'PLACEHOLDER_CLICKDUMMY_CREATOR' : 'clickdummy-creator-placeholder',
        '': 'panini'
    },

    /*
     * wizard.directory: installation directory
     * wizard.name: new template name
     * wizard.projectFolder: concatenated path of directory and name
     *
     * wizard.quickClone: boolean flag
     *
     * wizard.frameworkSupport: boolean flag
     * wizard.framework: chosen framework name
     * wizard.frameworkVersion: chosen framework version
     *
     * wizard.preprocessorSupport: boolean flag, true if preprocessor is configured and chosen
     * wizard.preprocessor: chosen preprocessor
     *
     * wizard.spriteGeneratorSupport: boolean flag, true if spritegenerators are configured and chosen
     * wizard.spriteGenerators: array with chosen spritegenerators
     *
     * wizard.features: array with chosen features
     *
     * wizard.installDependencies: boolean flag
     */
    'wizard' : {
        directory: null,
        name: null,
        projectFolder: null,

        quickClone: false,

        templateEngine: null,

        frameworkSupport: false,
        framework: null,
        frameworkVersion: null,

        preprocessorSupport: false,
        preprocessor: null,

        spriteGeneratorSupport: false,
        spriteGenerators: null,

        features: null,

        installDependencies: false
    },


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
fn.tasks.registerTasks( app.tasks );


/* ==============================
 *  # Functions
 * ============================== */




/* ==============================
 *  # Tasks
 * ============================== */


