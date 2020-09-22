'use strict';

// TODO Make this part of a global package for other projects

let gulp;
let plugins;
let app;

/**
 *
 * @param _gulp
 * @param _plugins
 * @param {{}} _app
 * @returns
 */
module.exports = function ( _gulp, _plugins, _app ) {
    gulp = _gulp;
    plugins = _plugins;
    app = _app;

    /**
     * TODO
     * @type {{filter: (function(string): boolean), extensions: [string, string], ignores: [string, string, string], recursive: boolean}}
     */
    const DEFAULT_FOLDER_OPTIONS = {
        'extensions': [ '.js', '.json' ],
        'filter': function ( absolutePath ) {
            return true;
        },
        'ignores': [ '.ignore', '.exclude', 'node_modules' ],
        'recursive': true
    };

    // export default folder options
    module.exports.DEFAULT_FOLDER_OPTIONS = DEFAULT_FOLDER_OPTIONS;

    /*
        // additionally add folder options to app consts.
        app.config.options.task = {
            'folderOptions': DEFAULT_FOLDER_OPTIONS
        };
    */

    return {

        /**
         * taskname
         * @param {string} filename
         * @return {*}
         * Returns the basename for the given file without any path information - this basename is used as gulp taskname.
         */
        'taskname': function (filename) {
            let taskname = null;
            if (app.fn.typechecks.isNotEmpty(filename)) {
                let dirname = app.modules.path.dirname(filename);
                let basename = app.modules.path.basename(filename,
                    app.modules.path.extname(filename)
                );

                let regex = new RegExp(app.modules.path.sep, 'g');
                let relativePath = app.modules.path.join(dirname, basename).replace(app.core.paths.gulpTasks, '');

                if (relativePath.startsWith(app.modules.path.sep)) {
                    relativePath = relativePath.substr(1);
                }
                taskname = relativePath.replace(regex, app.config.get('delimiters.tasks.subtasks'));
            }
            return taskname;
        },


        /**
         * TODO
         * @param {string} filename
         * @param {boolean} useFolderExtension - default is true
         * @param {string} folderExtension - default is '.d'
         * @return {*}
         */
        'subtasksFolder': function (filename, useFolderExtension = true, folderExtension =  '.d') {
            return app.modules.path.join(
                app.modules.path.dirname(filename),
                this.taskname(filename) + ( useFolderExtension ? folderExtension : '' )
            );
        },

        /**
         * loadTaskConfigs
         * TODO
         * @param {string} path
         * @param {{}} options [@see DEFAULT_FOLDER_OPTIONS]
         * @returns {{}}
         */
        'loadTaskConfigs': function (path = app.core.paths.gulpTasks, options = DEFAULT_FOLDER_OPTIONS) {
            let tasks = {};

            if ( _isPathExisting(path) ) {
                let files = app.modules.fs.readdirSync(path, {withFileTypes: true});
                let ignores = options.ignores || [];
                let fnFilter = options.filter;
                let bRecursive = options.recursive || false;

                for (let file of files) {
                    let absoluteFile = app.modules.path.join(path, file);

                    // handle ignores
                    if ( _handleTaskIgnores( absoluteFile, ignores ) ) {
                        continue;
                    }

                    // eval filter -> skip file
                    if ( _evalTaskFilter(absoluteFile, fnFilter ) ) {
                        continue;
                    }

                    // check filename for illegal characters -> the taskname is constructed with gulp task structure and file name
                    if ( _illegalTaskname(file) ) {
                        continue;
                    }

                    // determine taskname
                    let taskname = this.taskname(absoluteFile);

                    // skip duplicate tasks
                    if ( _isTaskDuplicate(tasks, taskname) ) {
                        continue;
                    }

                    // when recusive flag true: recursive method call for directories.
                    if (app.modules.fs.statSync(absoluteFile).isDirectory()) {
                        if (!bRecursive) {
                            app.logger.debug(`recursive configuration is disabled and subfolder will be ignored: ${taskname}`);
                            continue;
                        }

                        // determine subtasks and add them to task json with current task name
                        tasks[taskname] = this.loadTaskConfigs(absoluteFile);
                        app.logger.debug(`task folder added: ${taskname}`);
                    }
                    else {
                        // check file extensions
                        let extension = app.modules.path.extname( file );
                        if ( options.extensions ) {
                            if ( app.fn.typechecks.isEmpty(extension) || !options.extensions.includes(extension) ) {
                                app.logger.debug(`ignored by extension: ${file}`);
                                continue;
                            }
                        }

                        // add loaded file to task json
                        tasks[taskname] = require(absoluteFile);
                        app.logger.debug(`task added: ${taskname} : ${typeof tasks[taskname]}`);
                    }
                }
            }
            return tasks;
        },


        /**
         * lookupTaskFunction
         * @param {{}} jsonTasks
         * @param {string} taskname
         * @return {*}
         * TODO
         */
        /*
                'lookupTaskFunction': function (jsonTasks, taskname) {
                    let taskvalue = null;

                    // Wenn das uebergebene jsonTasks Objekt nicht null ist
                    if ( app.fn.typechecks.isObject( jsonTasks ) ) {
                        // Wenn ein taskname uebergeben wurde, in dem JSON direkt nach einem Key taskname suchen
                        if ( taskname !== null ) {
                            if ( jsonTasks.hasOwnProperty(taskname) ) {
                                taskvalue = jsonTasks[taskname];
                            }

                            // Wenn der ermittelte Wert eine Task-Function ist, dann diese zurueckgeben, andernfalls den JSON
                            // Baumrekursiv durchsuchen.
                            if ( !app.fn.typechecks.isFunction( taskvalue ) ) {
                                for ( let key in jsonTasks ) {
                                    if ( key !== null
                                            && jsonTasks.hasOwnProperty(key) ) {

                                        taskvalue = this.lookupTaskFunction(jsonTasks[key], taskname);

                                        if ( taskvalue !== null ) {
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    return taskvalue;
                },
        */

        /**
         * getRegisteredGulpTasks
         * @return {ProfileNode[]}
         * TODO
         */
        'getRegisteredGulpTasks' : function () {
            return gulp.tree().nodes;
        },


        /**
         * isTaskDefined
         * checks gulp tree for the given taskname. undefined or null will result in true.
         * @param taskname {string}
         * @returns {boolean}
         */
        'isTaskDefined' : function (taskname) {
            let bIsTaskDefined = false;

            if (app.fn.typechecks.isNotEmptyString(taskname)) {
                let gulpTasks = this.getRegisteredGulpTasks();

                if (app.fn.typechecks.isNotEmpty(gulpTasks)) {
                    bIsTaskDefined = gulpTasks.includes( taskname );
                }
            }
            return bIsTaskDefined;
        },


        /**
         * registerTasks
         * @param unregisteredTasks {{}}
         * @param callback {function}
         */
// TODO dummy function muss unregisteredTasks aktualisieren im Fehler/nicht-Erfolgreich fall
        'registerTasks': function ( unregisteredTasks, callback = function () {} ) {
            if ( app.fn.typechecks.isEmpty( unregisteredTasks ) ) {
                app.logger.warn( 'no json tasks defined!' );
            }
            else {
                for (let key in unregisteredTasks) {
                    if ( app.fn.typechecks.isNotEmpty( key )
                        && unregisteredTasks.hasOwnProperty(key) ) {

                        let bRemoveTask = false;
                        let value = unregisteredTasks[key];

                        if ( !this.isTaskDefined(key) ) {

                            // value is an Object. It might contain JSON SubTask definitions
                            if ( app.fn.typechecks.isObject( value ) ) {
                                if ( Object.keys( value ).length ) {
                                    this.registerTasks( value, callback );
                                }
                                else bRemoveTask = true;
                            }
                            // The value is a Task Function and can be registered
                            else
                            if ( app.fn.typechecks.isFunction( value ) ) {
                                let bSuccess = this.registerTask( value, callback );

                                if (!bSuccess) {
// TODO                                    app.unfinished.push( key );
                                }
                                else {
                                    bRemoveTask = true;
                                }
                            }
                            // The value might be null or undefined
                            else {
                                app.logger.debug(`The determined value Object will not be further processed! value : ${value}`);
                                bRemoveTask = true;
                            }
                        }
                        else {
                            app.logger.debug(`task already registred: ${key}`);
                            bRemoveTask = true;
                        }

                        // remove task from list when condition for removal is true
                        if (bRemoveTask) {
                            delete unregisteredTasks[key];
                        }
                    }
                }
            }
        },


        /**
         * TODO
         * @param {fn} taskfunction
         * @param {fn} callback
         */
        'registerTask': function ( taskfunction, callback ) {
            let bRegistered = false;

            if ( app.fn.typechecks.isFunction( taskfunction ) ) {
                try {
                    taskfunction( gulp, plugins, app );
                    bRegistered = true;
                }
                catch (e) {
                    app.logger.error( e );
                }
            }

            if ( !bRegistered ) {
                callback();
            }
            return bRegistered;
        },


        /**
         * TODO
         * @param {{}} jsonTasks
         * @param {string} taskname
         * @param {fn} callback
         */
        'registerDependingTask': function (jsonTasks, taskname, callback) {
            if ( app.fn.typechecks.isNotEmptyString( taskname ) ) {
                let bIsRegistered = this.isTaskDefined( taskname );

                // when no registered task with the given name can be found, try to register the task
                if ( !bIsRegistered ) {
                    let taskfunction = this.lookupTaskFunction( jsonTasks, taskname );

                    if ( taskfunction !== null ) {
                        bIsRegistered = this.registerTask( taskfunction );
                    }
                }

                // log error an call callback, if registration failed
                if ( !bIsRegistered ) {
                    app.logger.error(`Task '${taskname}' not defined!`);
                    callback();
                }
            }
        },

        /**
         * TODO
         * @param {{}} jsonTasks
         * @param {string|string[]} tasknames
         * @param {fn} callback
         */
        'registerDependingTasks': function (jsonTasks, tasknames, callback) {
            if ( app.fn.typechecks.isEmpty( tasknames ) ) {
                app.logger.debug( 'var tasknames is empty/null.' );
            }
            else {
                // handle strings if neccessary and split them into an array
                if ( app.fn.typechecks.isString( tasknames ) ) {
                    app.logger.debug(`var tasknames is of type string. try splitting into values by '${app.config.get('regex.stringSeparator')}'.`);
                    tasknames = tasknames.split( app.config.get('regex.stringSeparator') );
// TODO: Was ist hier mit der split Zuweisung???
                }

                if ( app.fn.typechecks.isArray( tasknames ) ) {
                    for ( let taskname of tasknames ) {
                        this.registerDependingTask( jsonTasks, taskname, callback );
                    }
                }
            }
        },

        /**
         * defineTask
         * @param {string} taskname
         * @param {string[]} dependingTasks
         * @param {fn} taskFunction
         * @param {boolean} bParallelTasks
         * @returns {*}
         */
        'defineTask': function ( taskname, dependingTasks, taskFunction = () => {}, bParallelTasks = false ) {
            if (app.fn.typechecks.isNotEmptyString( taskname ) ) {
                if (app.fn.typechecks.isNotEmpty( dependingTasks ) ) {
                    if (this.isEachTaskDefined( dependingTasks ) ) {
                        if ( app.fn.typechecks.isFunction( taskFunction ) ) {
                            if ( !bParallelTasks ) {
                                gulp.task( taskname, gulp.series( dependingTasks, taskFunction ) );
                            }
                            else {
                                gulp.task( taskname, gulp.parallel( dependingTasks, taskFunction ) );
                            }
                        }
                        else {
                            if ( !bParallelTasks ) {
                                gulp.task( taskname, gulp.series( dependingTasks ) );
                            }
                            else {
                                gulp.task( taskname, dependingTasks );
                            }
                        }
                    }
                }
                else {
                    if ( app.fn.typechecks.isString( taskFunction ) ) {
                        // Attention: Without this series, an assertionError is thrown!
                        // For further infomations check https://www.liquidlight.co.uk/blog/how-do-i-update-to-gulp-4/
                        gulp.task( taskname, gulp.series( taskFunction ) );
                    }
                    else
                    if ( app.fn.typechecks.isFunction( taskFunction ) ) {
                        gulp.task( taskname, taskFunction );
                    }
                    else {
                        app.logger.warning(`neither there is a task function nor subtasks defined for task. task: ${taskname}`);
                    }
                }
            }
        },


        /**
         * isEachTaskDefined
         * @param tasknames {string|string[]}
         * @returns {boolean}
         * each value is checked by isTaskDefined method. undefined or null will result in true.
         */
        'isEachTaskDefined' : function (tasknames) {
            let bIsEachTaskDefined = true;

            if (app.fn.typechecks.isNotEmpty(tasknames)) {
                if (app.fn.typechecks.isArray(tasknames)) {
                    for (let taskname of tasknames) {
                        bIsEachTaskDefined = this.isTaskDefined(taskname);

                        if (!bIsEachTaskDefined)
                            break;
                    }
                }
                else
                if (app.fn.typechecks.isString(tasknames)) {
                    bIsEachTaskDefined = this.isTaskDefined(tasknames);
                }
                else {
                    // TODO logging
                    // no String or String Array -> no definition check possible!
                }
            }
            else {
                // TODO logging
                // undefined/null/empty Object
            }

            return bIsEachTaskDefined;
        }
    }
}

/**
 * TODO
 * @param {string} path
 * @returns {boolean}
 * @private
 */
function _isPathExisting(path) {
    let bIsExisting = false;

    if ( app.fn.typechecks.isNotEmpty(path) ) {
        try {
            bIsExisting = app.modules.fs.existsSync(path);
        } catch (err) {
            app.logger.error(`Error while loading task definitions. please check definition files. ${err}`);
        }
    }
    return bIsExisting;
}

/**
 *
 * @param {string} absfile
 * @param {string[]} ignores
 * @returns {boolean}
 * @private
 */
function _handleTaskIgnores(absfile, ignores = []) {
    let bIgnore = false;

    if ( app.fn.typechecks.isNotEmpty(absfile)
        && app.fn.typechecks.isNotEmpty(ignores) ) {

        // split absolute file into its tokens
        let pathTokens = absfile.split( app.modules.path.sep );

        // iter over ignores
        for ( let ignore of ignores ) {

            // check each path token
            if ( app.fn.typechecks.isNotEmpty(ignore) ) {
                for ( let pathToken of pathTokens ) {
                    if ( pathToken.startsWith( ignore ) || pathToken.endsWith( ignore ) ) {
                        bIgnore = true;
                        break;
                    }
                }
            }

            // ignore current file -> break ignore check
            if ( bIgnore ) {
                break;
            }
        }
    }
    return bIgnore;
}


/**
 * calls additional possible filter method
 * @param {string} absfile
 * @param {fn} filter
 * @returns {boolean}
 * @private
 */
function _evalTaskFilter(absfile, filter = function() {
    return true;
}) {
    let bFiltered = false;

    if (app.fn.typechecks.isFunction(filter) && !filter(absfile)) {
        app.logger.info(`file filtered by special filter conditions. file: ${absfile}`);
        bFiltered = true;
    }
    return bFiltered;
}


/**
 * check taskname for illegal characters
 * @param {string} taskname
 * @param {char[]} [@link app.core.delimiters.tasks.subtasks] illegalChars
 * @returns {boolean}
 * @private
 */
function _illegalTaskname(taskname, illegalChars = [ app.config.get('delimiters.tasks.subtasks') ]) {
    let bIllegal = false;

    if ( app.fn.typechecks.isNotEmpty( taskname )
        && app.fn.typechecks.isNotEmpty( illegalChars ) ) {

        // iter over all possible chars
        for ( let illegalChar of illegalChars ) {
            if ( app.fn.typechecks.isNotEmpty( illegalChar )
                && taskname.indexOf( illegalChar ) > 0 ) {

                app.logger.warning('tasknames must not contain following character(s)'.red + `: >>${illegalChar}<<`);
                app.logger.warning('  \'-> ' + 'task will be ignored! '.red + `task: '${taskname}'`);
                bIllegal = true;
                break;
            }
        }
    }
    return bIllegal;
}

/**
 * skip duplicate tasks
 * @param {{}} tasks
 * @param {string} taskname
 * @returns {boolean}
 * @private
 */
function _isTaskDuplicate(tasks, taskname) {
    let bDuplicate = false;

    // task and taskname not empty...
    if ( app.fn.typechecks.isNotEmpty( tasks )
        && app.fn.typechecks.isNotEmpty( taskname ) ) {

        // tasks already contains taskname...
        if ( app.fn.typechecks.isNotEmpty( tasks[taskname] ) ) {
            app.logger.warning('task already defined! '.red + `task: ${taskname}`);
            bDuplicate = true;
        }
    }
    return bDuplicate;
}
