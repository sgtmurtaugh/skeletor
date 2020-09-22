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
    app.fn.tasks.defineTask(self, gulp.series(
        checkRequirements,
        showWizard,
        cloneTemplate,
        templateEngineSupport,
        uiFrameworkSupport,
        preprocessorSupport,
        spriteGeneratorSupport,
        testFrameworkSupport,
        featureSupport,
        installCloneDependencies
    ));
    // app.fn.tasks.defineTask(self, gulp.series(
    //     'build :: 01_check-requirements',
    //     'build :: 02_show-wizard',
    //     'build :: 03_clone-template',
    //     'build :: 04_template-engine',
    //     'build :: 05_framework-support',
    //     'build :: 06_preprocessor-support',
    //     'build :: 07_sprite-generator-support',
    //     'build :: 08_install-clone-dependencies'
    // ));
};


/**
 * checkRequirements
 * Task-Function
 * @param cb
 * <p>Checks the clone requirements
 */
function checkRequirements(cb) {
    if (app.modules['is-root']()) {
        console.log(messages.noRoot);
        cb(new Error());
    }
    cb();
}

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

/**
 * cloneTemplate
 * @param cb
 * @return {*}
 * <p>When a clone with the given name doesn't exists, the sources will be copied to the destination folder.
 * Furthermore all 'clickdummy-creator-placeholder'-placeholders will be replaced in files and file- / folder-names by
 * the clone name.
 */
function cloneTemplate(cb) {
// TODO!!!! At the moment directories can be overwritten
    app.fn.fs.access(app.wizard.projectFolder, function(err, stat) {
        if (err !== null) {
            // EACCES: Permission denied
            // EADDRINUSE: Address already in use
            // ECONNREFUSED: Connection refused
            // ECONNRESET: Connection reset by peer
            // EEXIST: File exists
            // EISDIR: Is a directory
            // EMFILE: Too many open files in system
            // ENOENT: No such file or directory
            // ENOTDIR: Not a directory
            // ENOTEMPTY: Directory not empty
            // EPERM: Operation not permitted
            // EPIPE: Broken pipe
            // ETIMEDOUT: Operation timed out

            if (err.code === 'EEXIST') {
                cb(new Error(messages(app.wizard.name).projectExists));
            }
        }
    });

    let src = [
        app.fn.path.join(
            app.config.paths.template,
            app.config.paths.recursive
        )
    ];

    return app.fn.template.copyTemplatesSourcesToProjectFolder(src, app.wizard.projectFolder, cb);
}

function templateEngineSupport() {
    return gulp.series(
        app.fn.templateEngineSupport.copyDependencies,
        app.fn.templateEngineSupport.copyTemplates,
        app.fn.templateEngineSupport.addNPMSupport
    );
}

function uiFrameworkSupport() {
    return gulp.series(
        app.fn.uiFrameworkSupport.copyDependencies,
        app.fn.uiFrameworkSupport.copyTemplates,
        app.fn.uiFrameworkSupport.addNPMSupport
    );
}

function preprocessorSupport() {
    return gulp.series(
        app.fn.preprocessorSupport.copyDependencies,
        app.fn.preprocessorSupport.copyTemplates,
        app.fn.preprocessorSupport.addNPMSupport
    );
}

function spriteGeneratorSupport() {
    return gulp.series(
        app.fn.spriteGeneratorSupport.copyDependencies,
        app.fn.spriteGeneratorSupport.copyTemplates,
        app.fn.spriteGeneratorSupport.addNPMSupport
    );
}

function testFrameworkSupport() {
    return gulp.series(
        app.fn.testFrameworkSupport.copyDependencies,
        app.fn.testFrameworkSupport.copyTemplates,
        app.fn.testFrameworkSupport.addNPMSupport
    );
}

function featureSupport() {
    return gulp.series(
        app.fn.testFrameworkSupport.copyDependencies,
        app.fn.testFrameworkSupport.copyTemplates,
        app.fn.testFrameworkSupport.addNPMSupport
    );
}

/**
 * installCloneDependencies
 * @param cb
 * <p>Installs the project dependencies using gulp-install, when the flag 'installDependencies' is set to true.
 */
function installCloneDependencies(cb) {
    if (app.wizard.installDependencies) {
        return gulp.src(
            app.fn.path.join(
                app.wizard.projectFolder,
                app.config.paths.recursive
            )
        )
            .pipe(plugins.install());
    }
    cb();
}
