'use strict';

import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';

import fs from 'fs';
import path from 'path';

import isRoot from 'is-root';
import merge from 'merge2';

import messages from './lib/messages';
import questions from './lib/questions';


const $ = gulpLoadPlugins();
var config = loadJSONConfig();

var installVariables = {
    name: null,
    directory: null,
    frameworkSupport: null,
    framework: null,
    frameworkVersion: null,
    bootstrap: null,
    foundation: null,
    preprocessorSupport: null,
    preprocessors: null,
    spriteGeneratorSupport: null,
    spriteGenerators: null,
    installDependencies: null,
    projectFolder: null
};
// less: null,
// sass: null,



/* ==============================
 *  # Functions (INSTALL)
 * ============================== */


/**
 * loadJSONConfig
 * <p>Loads the config.json file
 */
function loadJSONConfig() {
    let configFile = fs.readFileSync(process.cwd() + '/config.json', 'utf-8');
    return JSON.parse(configFile);
}

/**
 * preflight
 * @param cb
 * <p>Checks the clone requirements
 */
function preflight(cb) {
    if (isRoot()) {
        console.log(messages.noRoot);
        cb(new Error());
    }
    cb();
}

/**
 * addBaseTemplates
 * @return string
 * <p>Returns the source path for the custom templates folder without framework support
 */
function addBaseTemplates() {
    return gulp.src(
        config.paths.src.framework_support.none + '/**/*',
        {
            dot: true
        }
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
    fs.stat(installVariables.projectFolder, function(err, stat) {
        if (err == null) {
            cb(new Error(messages(installVariables.name).projectExists));
        }
    });

    let src = [
        config.paths.src.template,
        '!' + config.paths.src.framework_support.base,
        '!' + config.paths.src.framework_support.base + '/**'
    ];

    return gulp.src(src, {
        dot: true
    })
        .pipe($.rename(function (file) {
            if (file.basename.match(/clickdummy-creator-placeholder/)) {
                file.basename = file.basename.replace(/clickdummy-creator-placeholder/, installVariables.name);
            }

            if (file.dirname.match(/clickdummy-creator-placeholder/)) {
                file.dirname = file.dirname.replace(/clickdummy-creator-placeholder/, installVariables.name);
            }

            return file;
        }))
        .pipe($.replace("clickdummy-creator-placeholder", installVariables.name, { skipBinary: true }))
        .pipe(gulp.dest(installVariables.projectFolder));
}

/**
 * installCloneDependencies
 * @param cb
 * <p>Installs the project dependencies using gulp-install, when the flag 'installDependencies' is set to true.
 */
function installCloneDependencies(cb) {
    if (installVariables.installDependencies) {
        return gulp.src(
            path.join(installVariables.projectFolder, "**/*")
        )
            .pipe($.install());
    }
    else {
        cb();
    }
}

/**
 * prompt
 * <p>Prompts the cloning configurations to the user
 * @return {*}
 */
function promptQuestions() {
    return gulp.src(process.cwd())
        .pipe($.prompt.prompt(questions(), function (answers) {
                // 1. question: Clone Name (name)
                installVariables.name = answers.name;

                // 2. question: Installation Directory (directory)
                installVariables.directory = answers.directory;

                // 3. question: Framework Support (frameworkSupport)
                installVariables.frameworkSupport = answers.frameworkSupport;

                // 4. question: Framework (framework)
                installVariables.framework = answers.framework;

                // 4a. / 4b question: Bootstrap Version (version) // Foundation Version (version)
                installVariables.version = answers.version;

                // 5a. question: Bootstrap Installation (bootstrap)
                installVariables.bootstrap = answers.bootstrap;

                // 5b. question: Foundation Installation (foundation)
                installVariables.foundation = answers.foundation;

                // 6. question: Preprocessor Support (preprocessorSupport)
                installVariables.preprocessorSupport = answers.preprocessorSupport;

                // 7. question: Preprocessors (preprocessors)
                installVariables.preprocessors = answers.preprocessors;

                // 8. question: Sprite Generator Support (spriteGeneratorSupport)
                installVariables.spriteGeneratorSupport = answers.spriteGeneratorSupport;

                // 9. question: Sprite Generator List (spriteGenerators)
                installVariables.spriteGenerators = answers.spriteGenerators;

                // 10. question: Dependencies Installation (installDependencies)
                installVariables.installDependencies = answers.installDependencies;

                // Concatenated ProjectFolder
                installVariables.projectFolder = path.join(
                    installVariables.directory,
                    installVariables.name
                );

                //TODO messages = utils.messages(name);
            })
        );
}




/* ==============================
 *  # Functions (FRAMEWORKS)
 * ============================== */

/**
 * addFrameworkSupport
 * @param cb
 * <p>Delegates to separate framework specific addFramework-Methods
 */
// TODO!!!!
function addFrameworkSupport(cb) {
    let bAddFramework = false;

    let packageJson = {
        devDependencies: {}
    };

    if ( null != installVariables.frameworkSupport ) {
        if (null != installVariables.frameworkSupport) {
            if (installVariables.bootstrap) {
                bAddFramework = addBootstrapSupport(packageJson);
            }
            else if (null != installVariables.foundation) {
                bAddFramework = addFoundationSupport(packageJson);
            }
        }
    }

    if ( bAddFramework ) {
        return gulp.src(
            path.join( installVariables.projectFolder, 'package.json')
        )
            .pipe( $.jsonEditor( packageJson ))
            .pipe( gulp.dest( installVariables.projectFolder ) );
    }
    else {
        cb();
    }
}

/**
 * addFrameworkTemplates
 * @param cb
 */
function addFrameworkTemplates(cb) {
    let gulpSrc = null;
    let dest = installVariables.projectFolder + '/src';

    if ( installVariables.frameworkSupport ) {
        if ( installVariables.bootstrap ) {
            gulpSrc = addBootstrapTemplates();
        }
        else
        if ( null != installVariables.foundation ) {
            gulpSrc = addFoundationTemplates();
        }
    }
    else {
        gulpSrc = addBaseTemplates();
    }

    if ( null == gulpSrc ) {
        cb();
    }
    else {
        return gulpSrc
            .pipe($.rename(function (file) {
                if (file.basename.match(/clickdummy-creator-placeholder/)) {
                    file.basename = file.basename.replace(/clickdummy-creator-placeholder/, installVariables.name);
                }

                if (file.dirname.match(/clickdummy-creator-placeholder/)) {
                    file.dirname = file.dirname.replace(/clickdummy-creator-placeholder/, installVariables.name);
                }

                return file;
            }))
            .pipe($.replace("clickdummy-creator-placeholder", installVariables.name))
            .pipe(gulp.dest(dest));
    }
}

/**
 * addBootstrapSupport
 * @param packageJson
 * @returns
 * <p>Adds Bootstrap specific package information to the given json config.
 */
function addBootstrapSupport(packageJson) {
    let bAddFramework = false;

    if ( null != installVariables.frameworkSupport ) {
        if ( installVariables.bootstrap ) {
            bAddFramework = true;
            packageJson.devDependencies.bootstrap = config.frameworks.bootstrap.bootstrap;
        }
    }
    return bAddFramework;
}

/**
 * addFoundationSupport
 * @param packageJson
 * <p>Adds Foundation specific package information to the given json config.
 */
function addFoundationSupport(packageJson) {
    let bAddFramework = false;

    if ( null != installVariables.frameworkSupport ) {
        if ( null != installVariables.foundation ) {
            if ( Array.isArray(installVariables.foundation) ) {
                installVariables.foundation.forEach(function (foundationType, index, array) {
                    switch ( foundationType ) {
                        case "apps":
                        case "emails":
                        case "sites":
                            bAddFramework = true;
                            packageJson.devDependencies['foundation-'+foundationType] = config.frameworks.foundation[foundationType];
                            break;

                        default:
                            console.log("unknown foundation type: " + foundationType);
                    }
                });
            }
        }
    }
    return bAddFramework;
}

/**
 * addBootstrapTemplates
 * @return string
 * <p>Return the source path for the custom bootstrap templates folder
 */
function addBootstrapTemplates() {
    let gulpSrc = null;

    if ( installVariables.frameworkSupport ) {
        if ( installVariables.bootstrap ) {
            gulpSrc = gulp.src(
                config.paths.src.framework_support.bootstrap + '/**/*',
                {
                    dot: true
                }
            )
        }
    }
    return gulpSrc;
}

/**
 * addFoundationTemplates
 * @return string array
 * <p>Return the source path for the custom foundation templates folder.
 */
function addFoundationTemplates() {
    let gulpSrc = null;
    let src = null;
    let supportImport = '';

    // determine foundation src types and create an import string for these activated types
    if ( installVariables.frameworkSupport ) {
        if ( null != installVariables.foundation ) {
            if ( Array.isArray(installVariables.foundation) ) {
                src = [];

                installVariables.foundation.forEach(function (foundationType, index, array) {
                    switch ( foundationType ) {
                        case "apps":
                        case "emails":
                        case "sites":
                            src.push( config.paths.src.framework_support.foundation[foundationType] + '/**/*' );

                            supportImport = supportImport + '@import "foundation-'+foundationType+'-support.scss";' + '\r\n';
                            break;

                        default:
                            console.log("unknown foundation type: " + foundationType);
                    }
                });
            }
        }
    }

    // if foundation sources are available, then add the foundation common files source
    if ( null != src && src.length > 0 ) {
        if ( src.length == 1 ) {
            src.push( config.paths.src.framework_support.foundation['common'] + '/**/*' );
            gulpSrc = gulp.src(
                src,
                {
                    dot: true
                }
            );
        }
        else {
            gulpSrc = gulp.src(
                src,
                {
                    dot: true,
                    base: config.paths.src.framework_support.foundation['common'] + '/..'
                }
            );

            var additionalGulpSrc = gulp.src(
                config.paths.src.framework_support.foundation['common'] + '/**/*',
                {
                    dot: true
                }
            );

            gulpSrc = merge(
                gulpSrc,
                additionalGulpSrc
            );
        }

        // when the foundation import string is not empty, then create a foundation support file with the imports.
        if ( supportImport.length > 0 ) {
            $.file(
                '_foundation-support.scss',
                supportImport,
                {
                    src: false
                }
            ).pipe(
                gulp.dest(installVariables.projectFolder + '/src/assets/scss/')
            );
        }
    }
    return gulpSrc;
}



/* ==============================
 *  # Functions (PREPROCESSOR)
 * ============================== */

/**
 * addPreprocessorSupport
 * <p>Delegates to separate preprocessor specific addPreprocessor-Methods
 */
// TODO
function addPreprocessorSupport(cb) {
    let bAddPreprocessor = false;

    if ( null != installVariables.preprocessorSupport ) {
        let packageJson = {
            devDependencies: {}
        };

        if (installVariables.preprocessors.indexOf('less')) {
            bAddPreprocessor = addLESSSupport(packageJson);
        }

        if (installVariables.preprocessors.indexOf('sass')) {
            bAddPreprocessor = addSASSSupport(packageJson);
        }
    }

    if ( bAddPreprocessor ) {
        return gulp.src(
            path.join(installVariables.projectFolder, 'package.json')
        )
            .pipe($.jsonEditor( packageJson ))
            .pipe(gulp.dest( installVariables.projectFolder ));
    }
    else {
        cb();
    }
}

/**
 * addLESSSupport
 * @param packageJson
 * @returns
 * <p>Adds LESS specific package information to the given json config.
 */
function addLESSSupport(packageJson) {
    let bAddPreprocessor = false;

    if ( null == installVariables.frameworkSupport ) {
        bAddPreprocessor = true;
        packageJson.devDependencies.less = config.preprocessors.less;
    }
    return bAddPreprocessor;
}

/**
 * addSASSSupport
 * @param packageJson
 * @returns
 * <p>Adds SASS specific package information to the given json config.
 */
function addSASSSupport(packageJson) {
    let bAddPreprocessor = false;

    if ( null == installVariables.frameworkSupport ) {
        bAddPreprocessor = true;
        packageJson.devDependencies.sass = config.preprocessors.sass;
    }
    return bAddPreprocessor;
}



/* ==============================
 *  # Tasks
 * ============================== */


/**
 * Task: clone-template
 * runs: cloneTemplate function
 */
gulp.task('clone-template',
    cloneTemplate
);

/**
 * Task: add-framework-support
 * runs: addFrameworkTemplates and addFrameworkSupport function
 */
gulp.task('add-framework-support',
    gulp.series(
        addFrameworkTemplates,
        addFrameworkSupport,
    )
);

/**
 * Task: install-clone-dependencies
 * runs: installCloneDependencies function
 */
gulp.task('install-clone-dependencies',
    installCloneDependencies
);

/**
 * Task: default
 * runs: built clone-template task
 */
gulp.task('default',
    gulp.series(
        preflight,
        promptQuestions,
        'clone-template',
        'add-framework-support',
        'install-clone-dependencies',
    )
);
