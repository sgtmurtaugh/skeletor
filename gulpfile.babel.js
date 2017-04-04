'use strict';

import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import fs from 'fs';
import path from 'path';
import isRoot from 'is-root';
import messages from './src/messages';
import questions from './src/questions';

// load Gulp Plugins
const $ = gulpLoadPlugins();

// load JSON config
const config = loadJSONConfig();

const REGEX_PLACEHOLDER_CLICKDUMMY_CREATOR = /clickdummy-creator-placeholder/;
const PLACEHOLDER_CLICKDUMMY_CREATOR = 'clickdummy-creator-placeholder';

// container variable for all installation params (mapped answers object)

/**
 * installVariables
 * @type {{}}
 * installVariables.directory: installation directory
 * installVariables.name: new template name
 * installVariables.projectFolder: concatenated path of directory and name
 *
 * installVariables.frameworkSupport: boolean flag
 * installVariables.framework: chosen framework name
 * installVariables.frameworkVersion: chosen framework version
 *
 * installVariables.preprocessorSupport: boolean flag, true if preprocessor is configured and chosen
 * installVariables.preprocessor: chosen preprocessor
 *
 * installVariables.spriteGeneratorSupport: boolean flag, true if spritegenerators are configured and chosen
 * installVariables.spriteGenerators: array for with chosen spritegenerators
 *
 * installVariables.installDependencies: boolean flag
 */
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
    let configFile = fs.readFileSync(path.join(process.cwd(), 'config.json'), 'utf-8');
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
// TODO!!!! At the moment directories can be overwritten
    fs.access(installVariables.projectFolder, function(err, stat) {
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
                cb(new Error(messages(installVariables.name).projectExists));
            }
        }
    });

    let src = [ path.join(config.paths.template, config.paths.recursive) ];

    return copyTemplatesSourcesToProjectFolder(src, installVariables.projectFolder, cb);
}

/**
 * installCloneDependencies
 * @param cb
 * <p>Installs the project dependencies using gulp-install, when the flag 'installDependencies' is set to true.
 */
function installCloneDependencies(cb) {
    if (installVariables.installDependencies) {
        return gulp.src(path.join(installVariables.projectFolder, config.paths.recursive))
            .pipe($.install());
    }
    cb();
}

/**
 * promptQuestions
 * <p>Prompts the cloning configurations to the user
 * @return {*}
 */
function promptQuestions() {
    return gulp.src(process.cwd())
        .pipe($.prompt.prompt(questions($.prompt.inq, config), function (answers) {
            // assign user answers to installVariables object
            installVariables = answers;

            // add projectFolder variable (concatenated path for directory and name)
            installVariables.projectFolder = path.join( installVariables.directory, installVariables.name );

            // //TODO messages = utils.messages(name);
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
        // and framework selected
        if (!isEmpty(installVariables.framework)) {
            return addNPMEntryToPackageConfiguration(
                config.frameworks[installVariables.framework][installVariables.frameworkVersion],
                cb
            );
        }
    }
    cb();
}

/**
 * copyFrameworkDependencies
 * @param cb
 * <p>Copies the framework dependencies (e.g. preprocessor template).
 */
function copyFrameworkDependencies(cb) {
    let src = null;
// TODO!!!!!
    // when framework support is enabled
    if (installVariables.frameworkSupport) {
        // check dependencies
        let jsonDependencies = getOwnPropertyValue(
            config.frameworks[installVariables.framework][installVariables.frameworkVersion],
            'dependencies'
        );

        if (null !== jsonDependencies) {
            for ( let jsonDependencyKey in jsonDependencies ) {
                let jsonDependencyValue = getOwnPropertyValue(jsonDependencies, jsonDependencyKey);

                if ( jsonDependencyKey === 'preprocessor' ) {
// TODO!!!
//                    copyPreprocessorTemplates(config.preprocessors[jsonDependencyValue], cb);
                }
            }
        }



        // // create framework src path variable with user selected framework informations
        // src = [
        //     path.join(
        //         config.paths.frameworks,
        //         installVariables.framework,
        //         installVariables.frameworkVersion,
        //         config.paths.recursive
        //     )
        // ];
    }

    // return copyTemplatesSourcesToProjectFolder(src, null, cb);
cb();
}

/**
 * copyFrameworkTemplates
 * @param cb
 * <p>Copies the framework template for the user selected framework type to the default installation directory.
 */
function copyFrameworkTemplates(cb) {
    let src = null;

    // when framework support is enabled
    if (installVariables.frameworkSupport) {
        // create framework src path variable with user selected framework informations
        src = [
            path.join(
                config.paths.frameworks,
                installVariables.framework,
                installVariables.frameworkVersion,
                config.paths.recursive
            )
        ];
    }

    return copyTemplatesSourcesToProjectFolder(src, null, cb);
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
        // and preprocessor selected
        if (!isEmpty(installVariables.preprocessor)) {
            return addNPMEntryToPackageConfiguration(
                config.preprocessors[installVariables.preprocessor],
                cb
            );
        }
    }
    cb();
}

/**
 * copyPreprocessorTemplates
 * @param cb
 * <p>Copies the preprocessor template for the user selected preprocessor type to the corresponding preprocessor folder
 * inside the assets of the installation directory.
 */
function copyPreprocessorTemplates(cb) {
    let src = null;
    let dest = null;

    // when preprocessor support is enabled
    if (installVariables.preprocessorSupport) {
        // create preprocessor src path variable with user selected preprocessor informations
        src = [
            path.join(
                config.paths.preprocessors,
                installVariables.preprocessor,
                config.paths.recursive
            )
        ];

        dest = path.join(installVariables.projectFolder, config.paths.assets, installVariables.preprocessor);
    }
    return copyTemplatesSourcesToProjectFolder(src, dest, cb);
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
        // and spriteGenerators selected
        if (!isEmpty(installVariables.spriteGenerators)) {
            return addMultipleNPMEntriesToPackageConfiguration(
                config.spritegenerators,
                installVariables.spriteGenerators,
                cb
            );
        }
    }
    cb();
}

/**
 * copySpriteGeneratorTemplates
 * @param cb
 * <p>Copies the spriteGenerator templates for the user selected spriteGenerator types to the default installation
 * directory.
 */
function copySpriteGeneratorTemplates(cb) {
    let src = null;

    // when spriteGenerator support is enabled
    if (installVariables.spriteGeneratorSupport) {
        src = [];

        // for each sprite generator add concatenated src path
        for (let spriteGenerator of installVariables.spriteGenerators) {
            // add src folder for the current spriteGenerator
            src.push(
                path.join(
                    config.paths.spritegenerators,
                    spriteGenerator,
                    config.paths.recursive
                )
            );
        }
    }
    return copyTemplatesSourcesToProjectFolder(src, null, cb);
}


/* ==============================
 *  # Functions (Base Functionality)
 * ============================== */

/**
 * addMultipleNPMEntriesToPackageConfiguration
 * @param json
 * @param keyList
 * @param cb
 * @return {*}
 */
function addMultipleNPMEntriesToPackageConfiguration(json, keyList, cb) {
    // when spritegenerator support is enabled
    if (!isEmpty(json)
            && !isEmpty(keyList)) {

        let packageJson = {
            devDependencies: {}
        };

        // add preprocessor entries in devDependencies (multiple values possible)
        for (let key of keyList) {
            if (hasOwnProperty(json, key)) {
                if (hasOwnProperty(json[key], 'npm')) {
                    // for each preprocessor npm dependency
                    for (let npmConfigKey in json[key].npm) {
                        if (hasOwnProperty(json[key].npm, npmConfigKey)) {
                            packageJson.devDependencies[npmConfigKey] = json[key].npm[npmConfigKey];
                        }
                    }
                }
            }
            else {
                console.log('[warn] addMultipleNPMEntriesToPackageConfiguration: current key cannot be found in' +
                    ' json. key: ' + key);
            }
        }

        // add sprite generator definition to package.json
        return writeJSONConfigToPackageConfiguration(packageJson, cb);
    }
    else
    if (null === jsonPart) {
        console.log('[warn] addMultipleNPMEntriesToPackageConfiguration: jsonPart is null.');
    }
    else
    if (null === keyList) {
        console.log('[warn] addMultipleNPMEntriesToPackageConfiguration: keyList is null/empty.');
    }
    cb();
}

/**
 * addNPMEntryToPackageConfiguration
 * @param json
 * @param cb
 * @return {*}
 */
function addNPMEntryToPackageConfiguration(json, cb) {
    // when preprocessor support is enabled
    if (null !== json) {
        let packageJson = {
            devDependencies: {}
        };

        if (hasOwnProperty(json, 'npm')) {
            // add preprocessor entry in devDependencies
            packageJson.devDependencies = json.npm;

            // add framework definition to package.json
            return writeJSONConfigToPackageConfiguration(packageJson, cb);
        }
    }
    cb();
}

/**
 * copyTemplatesSourcesToProjectFolder
 * @param src
 * @param dest
 * @param cb
 * @return {*}
 * <p>Copy given src to target destination and replaces all 'clickdummy-creator-placeholder' placeholder in file- and
 * dirnames and inside files.
 */
function copyTemplatesSourcesToProjectFolder(src, dest, cb) {
    if (null !== src) {
        // set default destination (src folder inside projectFolder)
        if (null === dest) {
            dest = path.join(installVariables.projectFolder, config.paths.src);
        }

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
            .pipe(gulp.dest(dest));
    }
    cb();
}

/**
 * getOwnPropertyValue
 * @param json
 * @param key
 * <p>Delegates to <code>hasOwnProperty(json, key) and if the check is true the key used as json access key and the
 * return value will be returned.</code>
 */
function getOwnPropertyValue(json, key) {
    if (hasOwnProperty(json, key)) {
        return json[key];
    }
    return null;
}

/**
 * hasOwnProperty
 * @param json
 * @param key
 * <p>When both parameters are not null/empty the <code>hasOwnProperty(key)</code> is called on the json parameter with
 * the key as parameter.
 * The boolean return value will also returned. If the initial empty check fails false is returned.
 */
function hasOwnProperty(json, key) {
    if (!isEmpty(json)
            && !isEmpty(key)) {

        return json.hasOwnProperty(key);
    }
    else {
        if (isEmpty(json)) {
            console.log('[warn] hasOwnProperty: json parameter is null/empty.');
        }
        if (isEmpty(key)) {
            console.log('[warn] hasOwnProperty: key parameter is null/empty.');
        }
    }
    return false;
}

/**
 * hasOwnPropertyValue
 * @param json
 * @param key
 * <p>Delegate to <code>getOwnPropertyValue(json, key)</code> and determines the return type. This value is delegated
 * to <code>isEmpty(obj)</code> analyse for emptyness. The inverted boolean is returned.
 */
function hasOwnPropertyValue(json, key) {
    return (! isEmpty( getOwnPropertyValue(json, key)));
}

/**
 * writeJSONConfigToPackageConfiguration
 * @param packageJson
 * @param cb
 * @return {*}
 * <p>Adds the json snippet parameter to the package.json file in the installation directory.
 */
function writeJSONConfigToPackageConfiguration(packageJson, cb) {
    if (null !== packageJson) {
        return gulp.src(path.join(installVariables.projectFolder, config.paths.packageJson))
            .pipe($.jsonEditor(packageJson))
            .pipe(gulp.dest(installVariables.projectFolder));
    }
    cb();
}

/**
 * getType
 * @param obj
 * @return {string}
 * <p>Checks the type of the given parameter. Returns four different values:
 * <dl>
 *  <dt>'array'</dt>
 *  <dd>If the obj is not null and the method <code>Array.isArray()</code> returns true the String 'array' is returned.</dd>
 *
 *  <dt>'object'</dt>
 *  <dd>If the obj is null or of type Object the String 'object' is returned.</dd>
 *
 *  <dt>'other'</dt>
 *  <dd>If the obj is not null and not one of the types Array, Object and String the value 'other' is returned.</dd>
 *
 *  <dt>'string'</dt>
 *  <dd>If the obj is null or of type String the String 'string' is returned.</dd>
 * </dl>
 */
function getType(obj) {
    let type = 'object';

    if (null !== obj) {
        if (Array.isArray(obj)) {
            type = 'array';
        }
        else
        if (typeof obj === 'string') {
            type = 'string';
        }
        else
        if (typeof obj !== 'object') {
            type = 'other';
        }
    }
    return type;
}

/**
 * isTypeArray
 * @param obj
 * @return {boolean}
 * <p>Delegates to <code>getType(obj)</code> and returns true if the returned type is 'array' otherwise false.
 */
function isTypeArray(obj) {
    return ('array' === getType(obj));
}

/**
 * isTypeObject
 * @param obj
 * @return {boolean}
 * <p>Delegates to <code>getType(obj)</code> and returns true if the returned type is 'object' otherwise false.
 */
function isTypeObject(obj) {
    return ('object' === getType(obj));
}

/**
 * isTypeOther
 * @param obj
 * @return {boolean}
 * <p>Delegates to <code>getType(obj)</code> and returns true if the returned type is 'other' otherwise false.
 */
function isTypeOther(obj) {
    return ('other' === getType(obj));
}

/**
 * isTypeString
 * @param obj
 * @return {boolean}
 * <p>Delegates to <code>getType(obj)</code> and returns true if the returned type is 'string' otherwise false.
 */
function isTypeString(obj) {
    return ('string' === getType(obj));
}

/**
 * isEmpty
 * @param obj
 * @return {boolean}
 * <p>Checks the value depending on the type of the parameter object. Returns true, if the obj is null/'undefined', an
 * empty Array or an empty String, otherwise true will be returned.
 */
function isEmpty(obj) {
    if (null === obj
            || obj === 'undefined') {
        return true;
    }
    else
    if (isTypeArray(obj)) {
        return (obj.length === 0);
    }
    else
    if (isTypeString(obj)) {
        return (obj.trim().length === 0);
    }
    return false;
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
        copyFrameworkDependencies,
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
