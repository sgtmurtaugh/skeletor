'use strict';

import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import fs from 'fs';
import path from 'path';
import isRoot from 'is-root';
import messages from './src/messages';
import questions from './src/questions';

const $ = gulpLoadPlugins();
const config = loadJSONConfig();
const REGEX_PLACEHOLDER_CLICKDUMMY_CREATOR = /clickdummy-creator-placeholder/;
const PLACEHOLDER_CLICKDUMMY_CREATOR = 'clickdummy-creator-placeholder';

let installVariables = {
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

    let src = [ path.join(config.paths.src.template, '/**/*') ];

    return gulp.src(src, { dot: true })
        .pipe($.rename(function (file) {
            if (file.basename.match(REGEX_PLACEHOLDER_CLICKDUMMY_CREATOR)) {
                file.basename = file.basename.replace(REGEX_PLACEHOLDER_CLICKDUMMY_CREATOR, installVariables.name);
            }

            if (file.dirname.match(REGEX_PLACEHOLDER_CLICKDUMMY_CREATOR)) {
                file.dirname = file.dirname.replace(REGEX_PLACEHOLDER_CLICKDUMMY_CREATOR, installVariables.name);
            }

            return file;
        }))
        .pipe($.replace(PLACEHOLDER_CLICKDUMMY_CREATOR, installVariables.name, { skipBinary: true }))
        .pipe(gulp.dest(installVariables.projectFolder));
}

/**
 * installCloneDependencies
 * @param cb
 * <p>Installs the project dependencies using gulp-install, when the flag 'installDependencies' is set to true.
 */
function installCloneDependencies(cb) {
    if (installVariables.installDependencies) {
        return gulp.src(path.join(installVariables.projectFolder, '/**/*'))
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
            // 1. question: Installation Directory (directory)
            installVariables.directory = answers.directory;

            // 2. question: Clone Name (name)
            installVariables.name = answers.name;

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
function addFrameworkSupport(cb) {
    // when framework support is enabled
    if (installVariables.frameworkSupport) {
        let packageJson = {
            devDependencies: {}
        };

        // when framework selected
        if (null !== installVariables.framework) {
            // add framework entry in devDependencies
            packageJson.devDependencies[installVariables.framework] =
                config.frameworks[installVariables.framework][installVariables.frameworkVersion];

            // add framework definition to package.json
            return addJSONConfigToPackageConfiguration(packageJson);
        }
    }
    cb();
}

/**
 * copyFrameworkTemplates
 * @param cb
 */
function copyFrameworkTemplates(cb) {
    let src = null;

    // when framework support is enabled
    if (installVariables.frameworkSupport) {
        src = [
            path.join(
                config.paths.src.frameworks,
                installVariables.framework,
                installVariables.frameworkVersion,
                '/**/*'
            )
        ];
    }
    return copyTemplatesSourcesToProjectFolder(src, cb);
}


/* ==============================
 *  # Functions (PREPROCESSOR)
 * ============================== */

/**
 * addPreprocessorSupport
 * <p>Delegates to separate preprocessor specific addPreprocessor-Methods
 */
function addPreprocessorSupport(cb) {
    // when preprocessor support is enabled
    if (installVariables.preprocessorSupport) {
        let packageJson = {
            devDependencies: {}
        };

        if (null !== installVariables.preprocessor) {
            // the preprocessor key is an alias name, so we must iterate over the chosen preprocessor key  values to
            // get the real npm project names with its versions.
            for (let npmConfigKey in config.preprocessors[installVariables.preprocessor]) {
                // and add the entry in devDependencies
                packageJson.devDependencies[npmConfigKey] =
                    config.preprocessors[installVariables.preprocessor][npmConfigKey];
            }

            // add preprocessor definition to package.json
            return addJSONConfigToPackageConfiguration(packageJson);
        }
    }
    cb();
}

/**
 * copyPreprocessorTemplates
 * @param cb
 */
function copyPreprocessorTemplates(cb) {
    let src = null;

    // when preprocessor support is enabled
    if (installVariables.preprocessorSupport) {
        src = [
            path.join(
                config.paths.src.preprocessors,
                installVariables.preprocessor,
                '/**/*'
            )
        ];
    }
    return copyTemplatesSourcesToProjectFolder(src, cb);
}


/* ==============================
 *  # Functions (SPRITEGENERATOR)
 * ============================== */

/**
 * addSpriteGeneratorSupport
 * <p>Delegates to separate sprite generator specific addSpriteGenerator-Methods
 */
function addSpriteGeneratorSupport(cb) {
    // when spritegenerator support is enabled
    if (installVariables.spriteGeneratorSupport) {
        let packageJson = {
            devDependencies: {}
        };

        if (null !== installVariables.spriteGenerators) {
            // the sprite generator key is an alias name, so we must iterate over the chosen spriteGenerators key
            // values to get the real npm project names with its versions.
            for (let spriteGeneratorAlias of installVariables.spriteGenerators) {
                for (let npmConfigKey in config.spritegenerators[spriteGeneratorAlias]) {
                    // and add the entry in devDependencies
                    packageJson.devDependencies[npmConfigKey] =
                        config.spritegenerators[spriteGeneratorAlias][npmConfigKey];
                }
            }

            // add sprite generator definition to package.json
            return addJSONConfigToPackageConfiguration(packageJson);
        }
    }
    cb();
}

/**
 * copySpriteGeneratorTemplates
 * @param cb
 */
function copySpriteGeneratorTemplates(cb) {
    let src = null;

    // when spriteGenerator support is enabled
    if (installVariables.spriteGeneratorSupport) {
        src = [];

        // for each sprite generator add concatenated src path
        for (let spriteGenerator of installVariables.spriteGenerators) {
            src.push(
                path.join(
                    config.paths.src.spritegenerators,
                    spriteGenerator,
                    '/**/*'
                )
            );
        }
    }
    return copyTemplatesSourcesToProjectFolder(src, cb);
}






/**
 * addJSONConfigToPackageConfiguration
 * @param packageJson
 * @return {*}
 */
function addJSONConfigToPackageConfiguration(packageJson) {
    let gulpStream = null;
    if (null !== packageJson) {
        gulpStream = gulp.src(path.join(installVariables.projectFolder, 'package.json'))
            .pipe($.jsonEditor(packageJson))
            .pipe(gulp.dest(installVariables.projectFolder));
    }
    return gulpStream;
}

/**
 * copyTemplatesSourcesToProjectFolder
 * @param src
 * @param target
 * @return {*}
 * <p>Copy given src to target destination and replaces all 'clickdummy-creator-placeholder' placeholder in file- and
 * dirnames and inside files.
 */
function copyTemplatesSourcesToProjectFolder(src, cb) {
    if (null !== src) {
        let dest = path.join(installVariables.projectFolder, '/src');

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
            .pipe($.replace("clickdummy-creator-placeholder", installVariables.name))
            .pipe(gulp.dest(dest));
    }
    cb();
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
 * runs: copyFrameworkTemplates and addFrameworkSupport function
 */
gulp.task('add-framework-support',
    gulp.series(
        copyFrameworkTemplates,
        addFrameworkSupport
    )
);

/**
 * Task: add-preprocessor-support
 * runs: copyPreprocessorTemplates and addPreprocessorSupport function
 */
gulp.task('add-preprocessor-support',
    gulp.series(
        copyPreprocessorTemplates,
        addPreprocessorSupport,
    )
);

/**
 * Task: add-sprite-generator-support
 * runs: copySpriteGeneratorTemplates and addSpriteGeneratorSupport function
 */
gulp.task('add-sprite-generator-support',
    gulp.series(
        copySpriteGeneratorTemplates,
        addSpriteGeneratorSupport
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
        'add-preprocessor-support',
        'add-sprite-generator-support',
        'install-clone-dependencies',
    )
);
