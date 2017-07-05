'use strict';

var gulp = require('gulp');
var gulpPlugins = require('gulp-load-plugins');
var yargs = require('yargs');
// var promise = require('es6-promise');

// Load all Gulp plugins into one variable
const plugins = gulpPlugins();

const app = {
    'isProductive': !!(yargs.argv.production),

    'const' : {
        'REGEX_PLACEHOLDER_CLICKDUMMY_CREATOR' : /clickdummy-creator-placeholder/,
        'PLACEHOLDER_CLICKDUMMY_CREATOR' : 'clickdummy-creator-placeholder'
    },

    /*
     * wizard.directory: installation directory
     * wizard.name: new template name
     * wizard.projectFolder: concatenated path of directory and name
     *
     * wizard.frameworkSupport: boolean flag
     * wizard.framework: chosen framework name
     * wizard.frameworkVersion: chosen framework version
     *
     * wizard.preprocessorSupport: boolean flag, true if preprocessor is configured and chosen
     * wizard.preprocessor: chosen preprocessor
     *
     * wizard.spriteGeneratorSupport: boolean flag, true if spritegenerators are configured and chosen
     * wizard.spriteGenerators: array for with chosen spritegenerators
     *
     * wizard.installDependencies: boolean flag
     */
    'wizard' : {
        directory: null,
        name: null,
        projectFolder: null,

        frameworkSupport: false,
        framework: null,
        frameworkVersion: null,

        preprocessorSupport: false,
        preprocessor: null,

        spriteGeneratorSupport: false,
        spriteGenerators: null,

        installDependencies: false
    },


    // 'fn' : fn,
    // 'config': this.fn.config.loadConfigs(),
    // 'tasks': this.fn.tasks.loadTaskConfigs()
    'fn' : [],
    'config': [],
    'tasks': []
};

var fn = require('./gulp/functions')(gulp, plugins, app);

app.fn = fn;
app.config = fn.config.loadConfigs();
app.tasks = fn.tasks.loadTaskConfigs();

/*
 * load dynamically all tasks
 */
fn.tasks.addTasks( gulp, plugins, app, app.tasks );


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
        'build',
    ]);
    done();
}

/**
 * usage
 * @param done
 */
function usage( done ) {
    console.log('\r\nList of all registred tasks:\r\n');
    fn.tasks.showTasknames(app.tasks);
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
        'build'
    )
);

/**
 * Task: usage
 * runs: usage function
 */
gulp.task('usage',
    usage
);
