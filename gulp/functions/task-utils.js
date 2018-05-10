let requireDir = require('require-dir');

let gulp;
let plugins;
let app;

module.exports = function ( _gulp, _plugins, _app ) {
    gulp = _gulp;
    plugins = _plugins;
    app = _app;

    // Recursion breakOff object.
    let _requestedTasknames = [];
    const TASK_FOLDER_PREFIX = '.';

    return {

        /**
         * loadTaskConfigs
         * @return {map}
         * TODO
         */
        'loadTaskConfigs': function () {
            return requireDir('../tasks', {recurse: true, duplicates: false});
        },


        /**
         * isTaskDefined
         * @param taskname {String}
         * @returns {boolean}
         * checks gulp tree for the given taskname. undefined or null will result in true.
         */
        'isTaskDefined' : function (taskname) {
            let bIsTaskDefined = true;

            if (app.fn.typeChecks.isNotEmptyString(taskname)) {
                bIsTaskDefined = gulp.tree().nodes.includes(taskname);
            }
            else {
                // TODO logging
                // undefined/null/empty Object
            }
            return bIsTaskDefined;
        },


        /**
         * isEachTaskDefined
         * @param tasknames {String} / String-{Array}
         * @returns {boolean}
         * each value is checked by isTaskDefined method. undefined or null will result in true.
         */
        'isEachTaskDefined' : function (tasknames) {
            let bIsEachTaskDefined = true;

            if (app.fn.typeChecks.isNotEmpty(tasknames)) {
                if (app.fn.typeChecks.isArray(tasknames)) {
                    for (let taskname of tasknames) {
                        bIsEachTaskDefined = this.isTaskDefined(taskname);

                        if (!bIsEachTaskDefined)
                            break;
                    }
                }
                else
                if (app.fn.typeChecks.isString(tasknames)) {
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
        },


        /**
         * taskname
         * @param filename
         * @return {*}
         * TODO
         */
        'taskname': function (filename) {
            return app.fn.path.basename(filename,
                app.fn.path.extname(filename)
            );
        },


        /**
         * registerTasks
         * @param jsonTasks
         * @param cb
         * TODO
         */
        'registerTasks': function ( jsonTasks, cb ) {
            if ( jsonTasks !== null ) {
                for (let key in jsonTasks) {
                    if ( key !== null
                            && jsonTasks.hasOwnProperty(key) ) {

                        // Ignore SubTask-folder
                        if (key.startsWith(TASK_FOLDER_PREFIX)) {
                            // TODO log Task-Folder ignored
                        }
                        else {
                        // Ignore already registred tasks
                        if (!this.isTaskDefined(key)) {
                            let value = jsonTasks[key];

                                // value is an Object. It might contain JSON SubTask definitions
                                if ( app.fn.typeChecks.isObject( value ) ) {
// TODO really start recursion?
                                    this.callTaskDefinition( value, cb );
                                }
                                // The value is a Task Function and can be registered
                                else
                                if ( app.fn.typeChecks.isFunction( value ) ) {
                                    this.callTaskDefinition( value, cb );
                                    // this.registerTask(key, value, jsonTasks[TASK_FOLDER_PREFIX + key]);
                                }
                                // The value might be null or undefined
                                else {
                                    console.log('The determined value Object will not be further processed! value : ' + value);
                                }
                            }
                            else {
                                console.log('task already registred: ' + key);
                            }
                        }
                    }
                }
            }
        },


        /**
         * callTaskDefinition
         * @param taskfunction
         * @param cb
         * TODO
         */
        'callTaskDefinition': function ( taskfunction, cb ) {
            if ( app.fn.typeChecks.isFunction( taskfunction ) ) {
                taskfunction( gulp, plugins, app, cb );
            }
        },



        //
        //
        // /**
        //  * registerTask
        //  * @param taskname
        //  * @param dependingTasks
        //  * @param taskFunction
        //  * @param bParallelTasks
        //  * @returns {*}
        //  */
        // 'registerTask': function (taskname, dependingTasks, taskFunction, bParallelTasks = false) {
        //     if (app.fn.typeChecks.isNotEmptyString(taskname)) {
        //
        //         if (app.fn.typeChecks.isNotEmpty(dependingTasks)) {
        //
        //             if (app.fn.tasks.isEachTaskDefined(dependingTasks)) {
        //
        //                 if (app.fn.typeChecks.isNotEmpty(taskFunction)
        //                     && app.fn.typeChecks.isFunction(taskFunction)) {
        //
        //                     if (!bParallelTasks) {
        //                         gulp.task(taskname,
        //                             gulp.series(dependingTasks),
        //                             taskFunction
        //                         );
        //                     }
        //                     else {
        //                         gulp.task(taskname,
        //                             gulp.parallel(dependingTasks),
        //                             taskFunction
        //                         );
        //                     }
        //                 }
        //                 else {
        //                     if (!bParallelTasks) {
        //                         gulp.task(taskname,
        //                             gulp.series(dependingTasks)
        //                         );
        //                     }
        //                     else {
        //                         gulp.task(taskname,
        //                             gulp.parallel(dependingTasks)
        //                         );
        //                     }
        //                 }
        //             }
        //         }
        //         else {
        //             if (app.fn.typeChecks.isNotEmpty(taskFunction)
        //                 && app.fn.typeChecks.isFunction(taskFunction)) {
        //
        //                 gulp.task(taskname,
        //                     taskFunction
        //                 );
        //             }
        //             else {
        //                 console.log('taskname : ' + taskname + '  --> missing taskFunction!!!');
        //                 console.log('[warn] neither there is a task function nor subtasks defined for task "' + taskname + '"');
        //             }
        //         }
        //     }
        // },
        //


        /**
         * registerDependingTasks
         * @param taskname
         * @param jsonSubTasks
         * @param additionalTasknames
         * TODO
         */
        'registerDependingTasks': function ( taskname, jsonSubTasks, additionalTasknames) {
            let dependingTasknames = app.fn.helper.getMergedArray(
                this.lookupDependentTasknames(jsonSubTasks, taskname, taskname),
                additionalTasknames
            );

            if ( app.fn.typeChecks.isNotEmpty( dependingTasknames ) ) {
                for ( let dependingTaskname of dependingTasknames ) {
                    let flag = false;

                    if ( app.fn.typeChecks.isNotEmptyString( dependingTaskname ) ) {
                        if (!this.isTaskDefined(dependingTaskname)) {
// TODO                            this._endlessRecursionBreakOff(taskname);

                            let taskfunction = this.lookupTaskFunction( jsonSubTasks, dependingTaskname );

                            if ( taskfunction !== null ) {
                                this.callTaskDefinition( taskfunction );
                                flag = true;
                            }
                        }
                        else {
                            flag = true;
                        }

                        if ( !flag ) {
                            console.log('[ERROR] Task "' + taskname + '" not defined!');
                        }
                    }
                    else
                    if ( app.fn.typeChecks.isNotEmpty( dependingTaskname ) ) {
                        console.log('[WARN] Detected a Non-String Object in the task definitions! type : ' + (typeof dependingTaskname));
                        console.log(dependingTaskname);
                    }
                }
            }
            return dependingTasknames;
        },


        /**
         * lookupDependentTasknames
         * @param jsonTasks
         * @param taskname
         * @param currentTask
         * @return {Array}
         * TODO
         */
        'lookupDependentTasknames': function (jsonTasks, taskname, currentTask) {
            let tasknames = [];

            // when json object is not null, search for taskname
            if ( app.fn.typeChecks.isObject( jsonTasks ) ) {
                if ( taskname !== null ) {
                    let taskvalue = null;

                    // Das JSON Objekt enthaelt einen Folder Key fuer den geforderten Tasknamen
                    if ( jsonTasks.hasOwnProperty(TASK_FOLDER_PREFIX + taskname) ) {
                        taskvalue = jsonTasks[TASK_FOLDER_PREFIX + taskname];
                    }
                    else
                    // Das JSON Objekt enthaelt den geforderten Tasknamen
                    if ( jsonTasks.hasOwnProperty(taskname) ) {
                        taskvalue = jsonTasks[taskname];
                    }

                    // Taskvalue is a function and can be registered when is it the not the currentTask
                    if ( app.fn.typeChecks.isFunction(taskvalue) ) {

                        // Only add Task, when it's not the current task! (-> recursion)
                        if (app.fn.typeChecks.isEmpty(currentTask)
                                || currentTask !== taskname) {

                            tasknames.push(taskname);
                        }
                    }
                    else
                    // Taskvalue is an object (json). search for task with lookupDependentTasknames call on taskvalue
                    if ( app.fn.typeChecks.isObject(taskvalue) ) {
                        tasknames = tasknames.concat(
                            this.lookupDependentTasknames(taskvalue, null, currentTask)
                        );
                    }
                    else {
                        tasknames = tasknames.concat(
                            this.lookupDependentTasknames(jsonTasks, null, currentTask)
                        );
                    }
                }
                else {

                    for (let jsonKey in jsonTasks) {
                        if ( jsonKey !== null
                            && jsonTasks.hasOwnProperty(jsonKey) ) {

                            let taskvalue = jsonTasks[jsonKey];

                            if ( app.fn.typeChecks.isFunction(taskvalue) ) {
                                tasknames.push(jsonKey);
                            }
                            // else
                            // if ( app.fn.typeChecks.isObject(taskvalue) ) {
                            //     tasknames = tasknames.concat(
                            //         this.lookupDependentTasknames(taskvalue, null, currentTask)
                            //     );
                            // }
                        }
                    }
                }
            }
            return tasknames;
        },


        /**
         * lookupTaskFunction
         * @param jsonTasks
         * @param taskname
         * @return {*}
         * TODO
         */
        'lookupTaskFunction': function (jsonTasks, taskname) {
            let taskvalue = null;

            // Wenn das uebergebene jsonTasks Objekt nicht null ist
            if ( app.fn.typeChecks.isObject( jsonTasks ) ) {
                // Wenn ein taskname uebergeben wurde, in dem JSON direkt nach einem Key taskname suchen
                if ( taskname !== null ) {
                    if ( jsonTasks.hasOwnProperty(taskname) ) {
                        taskvalue = jsonTasks[taskname];
                    }

                    // Wenn der ermittelte Wert eine Task-Function ist, dann diese zurueckgeben, andernfalls den JSON
                    // Baumrekursiv durchsuchen.
                    if ( ! app.fn.typeChecks.isFunction( taskvalue ) ) {
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


        /**
         * defineTask
         * @param taskname
         * @param dependingTasks
         * @param taskFunction
         * @param bParallelTasks
         * @returns {*}
         */
        'defineTask': function (taskname, dependingTasks, taskFunction, bParallelTasks = false) {
            if (app.fn.typeChecks.isNotEmptyString(taskname)) {

                if (app.fn.typeChecks.isNotEmpty(dependingTasks)) {

                    if (app.fn.tasks.isEachTaskDefined(dependingTasks)) {

                        if (app.fn.typeChecks.isNotEmpty(taskFunction)
                                && app.fn.typeChecks.isFunction(taskFunction)) {

                            if (!bParallelTasks) {
                                gulp.task(taskname,
                                    gulp.series(dependingTasks),
                                    taskFunction
                                );
                            }
                            else {
                                gulp.task(taskname,
                                    gulp.parallel(dependingTasks),
                                    taskFunction
                                );
                            }
                        }
                        else {
                            if (!bParallelTasks) {
                                gulp.task(taskname,
                                    gulp.series(dependingTasks)
                                );
                            }
                            else {
                                gulp.task(taskname,
                                    gulp.parallel(dependingTasks)
                                );
                            }
                        }
                    }
                }
                else {
                    if (app.fn.typeChecks.isNotEmpty(taskFunction)
                            && app.fn.typeChecks.isFunction(taskFunction)) {

                        gulp.task(taskname,
                            taskFunction
                        );
                    }
                    else {
console.log('taskname : ' + taskname + '  --> missing taskFunction!!!');
                        console.log('[warn] neither there is a task function nor subtasks defined for task "' + taskname + '"');
                    }
                }
            }
        },



        'lookForTaskJson' : function (jsonTasks, taskname) {
            let jsonTask = null;

            if (app.fn.typeChecks.isNotEmptyString(taskname)) {

                if (app.fn.typeChecks.isObject(jsonTasks)) {

                    if (jsonTasks.hasOwnProperty(taskname)) {
                        jsonTask = jsonTasks;
                    }
                    else {
                        for (let jsonKey in jsonTasks) {
                            if (jsonTasks.hasOwnProperty(jsonKey)) {
                                let jsonValue = jsonTasks[jsonKey];
                                if (app.fn.typeChecks.isObject(jsonValue)) {
                                    jsonTask = this.lookForTaskJson(jsonValue, taskname);
                                }

                                if (null !== jsonTask) {
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            return jsonTask;
        },

        'lookForSubTaskJson' : function (jsonTasks, taskname) {
            if (app.fn.typeChecks.isNotEmptyString(taskname)) {

                if (app.fn.typeChecks.isObject(jsonTasks)) {

                    for (let jsonKey in jsonTasks) {
                        if (jsonTasks.hasOwnProperty(jsonKey)) {
                            if (app.fn.typeChecks.isNotEmptyString(jsonKey)) {
                                // Das JSON Objekt enthaelt einen Folder Key fuer den geforderten Tasknamen
                                if ( jsonTasks.hasOwnProperty(TASK_FOLDER_PREFIX + jsonKey) ) {
                                    taskvalue = jsonTasks[TASK_FOLDER_PREFIX + jsonKey];
                                }
                                else
                                // Das JSON Objekt enthaelt den geforderten Tasknamen
                                if ( jsonTasks.hasOwnProperty(jsonKey) ) {
                                    taskvalue = jsonTasks[jsonKey];
                                }
                            }
                        }
                    }
                }
            }
        }





//         /**
//          * lookupTasknames
//          * @param jsonTasks
//          * @return {Array}
//          * TODO
//          */
//         'lookupTasknames' : function (jsonTasks) {
//             let tasknames = [];
//
//             // Wenn das uebergebene jsonTasks Objekt nicht null ist
//             if ( app.fn.typeChecks.isObject( jsonTasks ) ) {
//
//                 for ( let taskname in jsonTasks ) {
//                     if ( taskname !== null
//                         && jsonTasks.hasOwnProperty(taskname) ) {
//
//                         let taskvalue = jsonTasks[taskname];
//
//                         if ( app.fn.typeChecks.isFunction(taskvalue) ) {
//                             tasknames.push(taskname);
//                         }
//                         else {
//                             tasknames = tasknames.concat(
//                                 this.lookupTasknames(taskvalue)
//                             );
//                         }
//                     }
//                 }
//             }
//             return tasknames;
//         },
//
//
//         /**
//          * registerDependingTasks
//          * @param jsonTasks
//          * @param tasknames
//          * @param cb
//          * TODO
//          */
//         'registerDependingTasks': function (jsonTasks, tasknames, cb) {
//             if ( app.fn.typeChecks.isArray( tasknames ) ) {
//                 for ( let taskname of tasknames ) {
//                     let flag = false;
//
//                     if (!this.isTaskDefined(taskname)) {
//                         let taskfunction = this.lookupTaskFunction( jsonTasks, taskname, cb );
//
//                         if ( taskfunction !== null ) {
//                             this.registerTask( taskfunction, cb );
//                             flag = true;
//                         }
//                     }
//
//                     if ( !flag ) {
//                         console.log('[ERROR] Task "' + taskname + '" not defined!');
//                     }
//                 }
//             }
//         },
//
//
//
//         /**
//          * showTasknames
//          * @param jsonTasks
//          * @return {*}
//          * TODO
//          */
//         'showTasknames' : function (jsonTasks) {
//             let tasknames = this.lookupTasknames(jsonTasks);
//
//             if (tasknames !== null) {
//                 for (let task of tasknames) {
//                     console.log('- ' + task);
//                 }
//             }
//             else {
//                 console.log('no task defined!');
//             }
//
//             // Wenn das uebergebene jsonTasks Objekt nicht null ist
//             if ( app.fn.typeChecks.isObject( jsonTasks ) ) {
//
//                 for ( let taskname in jsonTasks ) {
//                     if ( taskname !== null
//                         && jsonTasks.hasOwnProperty(taskname) ) {
//
//                         let taskvalue = jsonTasks[taskname];
//
//                         if ( app.fn.typeChecks.isFunction(taskvalue) ) {
//                             tasknames.push(taskname);
//                         }
//                         else {
//                             tasknames = tasknames.concat(
//                                 this.lookupTasknames(taskvalue)
//                             );
//                         }
//                     }
//                 }
//             }
//             return tasknames;
//         },
//
//
//         /**
//          * task
//          * @param task
//          * @return {*}
//          * TODO
//          */
//         'task': function (task) {
//             return requireDir('../tasks/' + task)(gulp, plugins, config, tasks);
//         },
//
//
//         /**
//          * _endlessRecursionBreakOff
//          * @param taskname
//          * @private
//          */
//         '_endlessRecursionBreakOff' : function (taskname) {
//             // remove already registered tasknames
//             for (let requestedTaskname of _requestedTasknames) {
//                 if (this.isTaskDefined(requestedTaskname)) {
//                     _requestedTasknames.splice(_requestedTasknames.indexOf(requestedTaskname), 1);
//                 }
//             }
//
//             if (!_requestedTasknames.includes(taskname)) {
//                 _requestedTasknames.push(taskname);
//             }
//             else {
//                 throw Error('Recursion detected! taskname "' + taskname + '" already requested.');
//             }
//         },
//
//
//         /**
//          * getJsonTaskPath
//          * @param currentTaskPath
//          */
//         'getJsonTaskPath' : function (currentTaskPath) {
//             let jsonTaskPath = [];
//
//             if (app.fn.typeChecks.isNotEmpty(currentTaskPath)) {
//                 let paths = currentTaskPath.split('/');
//                 let startIndex = 0;
//
//                 for (let pathIndex in paths.reverse()) {
//                     if (paths[pathIndex] === 'tasks') break;
//
//                     startIndex = paths.length - 1;
//                 }
//
//                 for (let i=startIndex; i<=paths.length; i++) {
// // console.log('- (' + startIndex + ')' + paths[i]);
//                     if (app.fn.typeChecks.isNotEmpty(paths[i])) {
//                         jsonTaskPath.push(paths[i]);
//                     }
//                 }
//             }
//
//             return jsonTaskPath;
//         }


     };
};