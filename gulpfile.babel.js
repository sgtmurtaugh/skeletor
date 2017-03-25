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
const config = loadJSONConfig();

let installVariables = {
    name: null,
    directory: null,
    projectFolder: null,

    frameworkSupport: false,
    framework: null,
    frameworkVersion: null,

    preprocessorSupport: false,
    preprocessor: null,

    spriteGeneratorSupport: false,
    spriteGenerators: null,

    installDependencies: false
};



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
    return gulp.src( config.paths.src.framework_support.none + '/**/*', { dot: true } );
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
        if (err === null) {
            cb(new Error(messages(installVariables.name).projectExists));
        }
    });

    let src = [
        config.paths.src.template,
        '!' + config.paths.src.framework_support.base,
        '!' + config.paths.src.framework_support.base + '/**'
    ];

    return gulp.src(src, { dot: true })
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
        return gulp.src(path.join(installVariables.projectFolder, "**/*"))
            .pipe($.install());
    }
    else {
        cb();
    }
}

/**
 * promptQuestions
 * <p>Prompts the cloning configurations to the user
 * @return {*}
 */
function promptQuestions() {
    return gulp.src(process.cwd())
        .pipe($.prompt.prompt(questions($.prompt.inq, config), function (answers) {
            // 1. question: Clone Name (name)
            installVariables.name = answers.name;

            // 2. question: Installation Directory (directory)
            installVariables.directory = answers.directory;

            // Concatenated ProjectFolder
            installVariables.projectFolder = path.join( installVariables.directory, installVariables.name );


            // 3. question: Framework Support (frameworkSupport)
            installVariables.frameworkSupport = answers.frameworkSupport;

            // 4. question: Framework (framework)
            installVariables.framework = answers.framework;

            // 5. question: Framework Version (frameworkVersion)
            installVariables.frameworkVersion = answers.frameworkVersion;

            // 6. question: Preprocessor Support (preprocessorSupport)
            installVariables.preprocessorSupport = answers.preprocessorSupport;

            // 7. question: Preprocessor (preprocessor)
            installVariables.preprocessor = answers.preprocessor;

            // 8. question: Sprite Generator Support (spriteGeneratorSupport)
            installVariables.spriteGeneratorSupport = answers.spriteGeneratorSupport;

            // 9. question: Sprite Generator List (spriteGenerators)
            installVariables.spriteGenerators = answers.spriteGenerators;

            // 10. question: Dependencies Installation (installDependencies)
            installVariables.installDependencies = answers.installDependencies;

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

    // when framework support is enabled
    if ( null !== installVariables.frameworkSupport
            && installVariables.frameworkSupport ) {

        // when framework selected
        if (null !== installVariables.framework) {
            // framework bootstrap
            if (installVariables.framework === 'bootstrap') {
                bAddFramework = addBootstrapSupport(packageJson);
            }
            // framework foundation
            // else if (installVariables.foundation === 'foundation') {
            //     bAddFramework = addFoundationSupport(packageJson);
            // }
            else {
                // TODO: log framework support enabled, but no specific definition found!
            }
        }
    }

    // when framework definition should be added to package.json
    if ( bAddFramework ) {
        return gulp.src( path.join( installVariables.projectFolder, 'package.json') )
            .pipe( $.jsonEditor( packageJson ))
            .pipe( gulp.dest( installVariables.projectFolder ) );
    }
    else {
        cb();
    }
}

// /**
//  * addFrameworkTemplates
//  * @param cb
//  */
// function addFrameworkTemplates(cb) {
//     let gulpSrc = null;
//     let dest = installVariables.projectFolder + '/src';
//
//     if ( installVariables.frameworkSupport ) {
//         if ( installVariables.bootstrap ) {
//             gulpSrc = addBootstrapTemplates();
//         }
//         else
//         if ( null !== installVariables.foundation ) {
//             gulpSrc = addFoundationTemplates();
//         }
//     }
//     else {
//         gulpSrc = addBaseTemplates();
//     }
//
//     if ( null === gulpSrc ) {
//         cb();
//     }
//     else {
//         return gulpSrc.pipe($.rename(function (file) {
//                 if (file.basename.match(/clickdummy-creator-placeholder/)) {
//                     file.basename = file.basename.replace(/clickdummy-creator-placeholder/, installVariables.name);
//                 }
//
//                 if (file.dirname.match(/clickdummy-creator-placeholder/)) {
//                     file.dirname = file.dirname.replace(/clickdummy-creator-placeholder/, installVariables.name);
//                 }
//
//                 return file;
//             }))
//             .pipe($.replace("clickdummy-creator-placeholder", installVariables.name))
//             .pipe(gulp.dest(dest));
//     }
// }
//
/**
 * addBootstrapSupport
 * @param packageJson
 * @returns
 * <p>Adds Bootstrap specific package information to the given json config.
 */
function addBootstrapSupport(packageJson) {
    let bAddFramework = false;

    // framework support is enabled
    if ( null !== installVariables.frameworkSupport
            && installVariables.frameworkSupport ) {

        // when framework
        if ( installVariables.framework === 'bootstrap' ) {
            bAddFramework = true;
console.log(config.frameworks.bootstrap.bootstrap[installVariables.frameworkVersion]);
            packageJson.devDependencies.bootstrap = config.frameworks.bootstrap.bootstrap[installVariables.frameworkVersion];
        }
    }
    return bAddFramework;
}

// /**
//  * addFoundationSupport
//  * @param packageJson
//  * <p>Adds Foundation specific package information to the given json config.
//  */
// function addFoundationSupport(packageJson) {
//     let bAddFramework = false;
//
//     if ( null !== installVariables.frameworkSupport ) {
//         if ( null !== installVariables.foundation ) {
//             if ( Array.isArray(installVariables.foundation) ) {
//                 installVariables.foundation.forEach(function (foundationType, index, array) {
//                     switch ( foundationType ) {
//                         case "apps":
//                         case "emails":
//                         case "sites":
//                             bAddFramework = true;
//                             packageJson.devDependencies['foundation-'+foundationType] = config.frameworks.foundation[foundationType][installVariables.frameworkVersion];
//                             break;
//
//                         default:
//                             console.log("unknown foundation type: " + foundationType);
//                     }
//                 });
//             }
//         }
//     }
//     return bAddFramework;
// }
//
// /**
//  * addBootstrapTemplates
//  * @return string
//  * <p>Return the source path for the custom bootstrap templates folder
//  */
// function addBootstrapTemplates() {
//     let gulpSrc = null;
//
//     if ( installVariables.frameworkSupport ) {
//         if ( installVariables.bootstrap ) {
//             gulpSrc = gulp.src( config.paths.src.framework_support.bootstrap + '/**/*', { dot: true } )
//         }
//     }
//     return gulpSrc;
// }
//
// /**
//  * addFoundationTemplates
//  * @return string array
//  * <p>Return the source path for the custom foundation templates folder.
//  */
// function addFoundationTemplates() {
//     let gulpSrc = null;
//     let src = null;
//     let supportImport = '';
//
//     // determine foundation src types and create an import string for these activated types
//     if ( installVariables.frameworkSupport ) {
//         if ( null !== installVariables.foundation ) {
//             if ( Array.isArray(installVariables.foundation) ) {
//                 src = [];
//
//                 installVariables.foundation.forEach(function (foundationType, index, array) {
//                     switch ( foundationType ) {
//                         case "apps":
//                         case "emails":
//                         case "sites":
//                             src.push( config.paths.src.framework_support.foundation[foundationType] + '/**/*' );
//
//                             supportImport = supportImport + '@import "foundation-'+foundationType+'-support.scss";' + '\r\n';
//                             break;
//
//                         default:
//                             console.log("unknown foundation type: " + foundationType);
//                     }
//                 });
//             }
//         }
//     }
//
//     // if foundation sources are available, then add the foundation common files source
//     if ( null !== src && src.length > 0 ) {
//         if ( src.length === 1 ) {
//             src.push( config.paths.src.framework_support.foundation['common'] + '/**/*' );
//             gulpSrc = gulp.src( src, { dot: true } );
//         }
//         else {
//             gulpSrc = gulp.src( src, {
//                 dot: true,
//                 base: config.paths.src.framework_support.foundation['common'] + '/..'
//             });
//
//             let additionalGulpSrc = gulp.src( config.paths.src.framework_support.foundation['common'] + '/**/*',
//                 { dot: true } );
//
//             gulpSrc = merge( gulpSrc, additionalGulpSrc );
//         }
//
//         // when the foundation import string is not empty, then create a foundation support file with the imports.
//         if ( supportImport.length > 0 ) {
//             $.file( '_foundation-support.scss', supportImport, { src: false } )
//                 .pipe( gulp.dest(installVariables.projectFolder + '/src/assets/scss/') );
//         }
//     }
//     return gulpSrc;
// }
//
//
//
// /* ==============================
//  *  # Functions (PREPROCESSOR)
//  * ============================== */
//
// /**
//  * addPreprocessorSupport
//  * <p>Delegates to separate preprocessor specific addPreprocessor-Methods
//  */
// function addPreprocessorSupport(cb) {
//     let bAddPreprocessors = false;
//     let packageJson = null;
//
//     if ( null !== installVariables.preprocessorSupport ) {
//         packageJson = {
//             devDependencies: {}
//         };
//         let bAddPreprocessor;
//
//         // 1. LESS
//         bAddPreprocessor = addLESSSupport(packageJson);
//         if ( !bAddPreprocessors ) {
//             bAddPreprocessors = bAddPreprocessor;
//         }
//
//         // 2. SASS
//         bAddPreprocessor = addSASSSupport(packageJson);
//         if ( !bAddPreprocessors ) {
//             bAddPreprocessors = bAddPreprocessor;
//         }
//     }
//
//     // if bAddPreprocessor is true, add specific json informations to the package.json
//     if ( bAddPreprocessors ) {
//         return gulp.src( path.join(installVariables.projectFolder, 'package.json') )
//             .pipe($.jsonEditor( packageJson ))
//             .pipe(gulp.dest( installVariables.projectFolder ));
//     }
//     else {
//         cb();
//     }
// }
//
// /**
//  * addLESSSupport
//  * @param packageJson
//  * @returns
//  * <p>Adds LESS specific package information to the given json config.
//  */
// function addLESSSupport(packageJson) {
//     let bAddPreprocessor = false;
//
//     if ( installVariables.preprocessorSupport
//             && null !== installVariables.preprocessor
//             && installVariables.preprocessor.indexOf('less') ) {
//
//         bAddPreprocessor = true;
//         packageJson.devDependencies.less = config.preprocessors.less;
//     }
//     return bAddPreprocessor;
// }
//
// /**
//  * addSASSSupport
//  * @param packageJson
//  * @returns
//  * <p>Adds SASS specific package information to the given json config.
//  */
// function addSASSSupport(packageJson) {
//     let bAddPreprocessor = false;
//
//     if ( installVariables.preprocessorSupport
//             && null !== installVariables.preprocessor
//             && installVariables.preprocessor.indexOf('sass') ) {
//
//         bAddPreprocessor = true;
//         packageJson.devDependencies.sass = config.preprocessors.sass;
//     }
//     return bAddPreprocessor;
// }
//
// /**
//  * addSpriteGeneratorSupport
//  * <p>Delegates to separate sprite generator specific addSpriteGenerator-Methods
//  */
// function addSpriteGeneratorSupport(cb) {
//     let bAddSpriteGenerators = false;
//     let packageJson = null;
//
//     if ( null !== installVariables.spriteGeneratorSupport ) {
//         packageJson = {
//             devDependencies: {}
//         };
//         let bAddSpriteGenerator;
//
//         // 1. node-sprite-generator
//         bAddSpriteGenerator = addNodeSpriteGeneratorSupport(packageJson);
//         if ( !bAddSpriteGenerators ) {
//             bAddSpriteGenerators = bAddSpriteGenerator;
//         }
//
//         // 2. svg sprite
//         bAddSpriteGenerator = addSVGSpriteSupport(packageJson);
//         if ( !bAddSpriteGenerators ) {
//             bAddSpriteGenerators = bAddSpriteGenerator;
//         }
//     }
//
//     // if bAddPreprocessor is true, add specific json informations to the package.json
//     if ( bAddSpriteGenerators ) {
//         return gulp.src( path.join(installVariables.projectFolder, 'package.json') )
//             .pipe($.jsonEditor( packageJson ))
//             .pipe(gulp.dest( installVariables.projectFolder ));
//     }
//     else {
//         cb();
//     }
// }
//
// /**
//  * addNodeSpriteGeneratorSupport
//  * @param packageJson
//  * @returns
//  * <p>Adds node-sprite-generator specific package information to the given json config.
//  */
// function addNodeSpriteGeneratorSupport(packageJson) {
//     let bAddSpriteGenerator = false;
//
//     if ( installVariables.spriteGeneratorSupport
//             && null !== installVariables.spriteGenerators
//             && installVariables.spriteGenerators.indexOf('nsg') ) {
//
//         bAddSpriteGenerator = true;
//         packageJson.devDependencies.nsg = config.spritegenerators.nsg;
//     }
//     return bAddSpriteGenerator;
// }
//
// /**
//  * addSVGSpriteSupport
//  * @param packageJson
//  * @returns
//  * <p>Adds SVG-Sprite specific package information to the given json config.
//  */
// function addSVGSpriteSupport(packageJson) {
//     let bAddSpriteGenerator = false;
//
//     if ( installVariables.spriteGeneratorSupport
//             && null !== installVariables.spriteGenerators
//             && installVariables.spriteGenerators.indexOf('svg') ) {
//
//         bAddSpriteGenerator = true;
//         packageJson.devDependencies.svg = config.spritegenerators.svg;
//     }
//     return bAddSpriteGenerator;
// }



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
    // gulp.series(
    //     addFrameworkTemplates,
        addFrameworkSupport,
        // addPreprocessorSupport,
    // )
);

/**
 * Task: install-clone-dependencies
 * runs: installCloneDependencies function
 */
// gulp.task('add-sprite-generator-support',
//     addSpriteGeneratorSupport
// );

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
        // 'add-sprite-generator-support',
        'install-clone-dependencies',
    )
);
