let requireDir = require('require-dir');

let gulp;
let plugins;
let app;

module.exports = function ( _gulp, _plugins, _app ) {
    gulp = _gulp;
    plugins = _plugins;
    app = _app;

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
         * lookupDependentTasknames
         * @param jsonTasks
         * @param taskname
         * @return {Array}
         * TODO
         */
        'lookupDependentTasknames': function (jsonTasks, taskname) {
            const TASK_FOLDER_PREFIX = '.';
            let tasknames = [];

            // Wenn das uebergebene jsonTasks Objekt nicht null ist
            if ( app.fn.typeChecks.isObject( jsonTasks ) ) {
                if ( taskname !== null ) {
                    let taskvalue = null;

                    if ( jsonTasks.hasOwnProperty(TASK_FOLDER_PREFIX + taskname) ) {
                        taskvalue = jsonTasks[TASK_FOLDER_PREFIX + taskname];
                    }
                    else
                    if ( jsonTasks.hasOwnProperty(taskname) ) {
                        taskvalue = jsonTasks[taskname];
                    }

                    if ( app.fn.typeChecks.isFunction(taskvalue) ) {
                        tasknames.push(taskname);
                    }
                    else
                    if ( app.fn.typeChecks.isObject(taskvalue) ) {
                        tasknames = tasknames.concat(
                            this.lookupDependentTasknames(taskvalue, null)
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
                            else
                            if ( app.fn.typeChecks.isObject(taskvalue) ) {
                                tasknames = tasknames.concat(
                                    this.lookupDependentTasknames(taskvalue, null)
                                );
                            }
                        }
                    }
                }
            }
            return tasknames;
        },


        /**
         * lookupTaskFunction
         * @param gulp
         * @param plugins
         * @param app
         * @param jsonTasks
         * @param taskname
         * @return {*}
         * TODO
         */
        'lookupTaskFunction': function (gulp, plugins, app, jsonTasks, taskname) {
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

                                taskvalue = this.lookupTaskFunction(gulp, plugins, app, jsonTasks[key], taskname);

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
         * lookupTasknames
         * @param jsonTasks
         * @return {Array}
         * TODO
         */
        'lookupTasknames' : function (jsonTasks) {
            let tasknames = [];

            // Wenn das uebergebene jsonTasks Objekt nicht null ist
            if ( app.fn.typeChecks.isObject( jsonTasks ) ) {

                for ( let taskname in jsonTasks ) {
                    if ( taskname !== null
                        && jsonTasks.hasOwnProperty(taskname) ) {

                        let taskvalue = jsonTasks[taskname];

                        if ( app.fn.typeChecks.isFunction(taskvalue) ) {
                            tasknames.push(taskname);
                        }
                        else {
                            tasknames = tasknames.concat(
                                this.lookupTasknames(taskvalue)
                            );
                        }
                    }
                }
            }
            return tasknames;
        },


        /**
         * registerDependingTasks
         * @param gulp
         * @param plugins
         * @param app
         * @param jsonTasks
         * @param tasknames
         * @param cb
         * TODO
         */
        'registerDependingTasks': function ( gulp, plugins, app, jsonTasks, tasknames, cb ) {
            if ( app.fn.typeChecks.isArray( tasknames ) ) {
                for ( let taskname of tasknames ) {
                    let flag = false;

                    if ( ! gulp.tree().nodes.hasOwnProperty(taskname) ) {
                        let taskfunction = this.lookupTaskFunction( gulp, plugins, app, jsonTasks, taskname, cb );

                        if ( taskfunction !== null ) {
                            this.registerTask( gulp, plugins, app, taskfunction, cb );
                            flag = true;
                        }
                    }

                    if ( !flag ) {
                        console.log('[ERROR] Task "' + taskname + '" not defined!');
                    }
                }
            }
        },


        /**
         * registerTask
         * @param gulp
         * @param plugins
         * @param app
         * @param taskfunction
         * @param cb
         * TODO
         */
        'registerTask': function ( gulp, plugins, app, taskfunction, cb ) {
            if ( app.fn.typeChecks.isFunction( taskfunction ) ) {
                taskfunction( gulp, plugins, app, cb );
            }
        },


        /**
         * registerTasks
         * @param gulp
         * @param plugins
         * @param app
         * @param jsonTasks
         * @param cb
         * TODO
         */
        'registerTasks': function ( gulp, plugins, app, jsonTasks, cb ) {
            if ( jsonTasks !== null ) {
                for (let key in jsonTasks) {
                    if ( key !== null
                            && jsonTasks.hasOwnProperty(key) ) {

                        let value = jsonTasks[key];

                        if ( ! gulp.tree().nodes.key ) {
                            if ( app.fn.typeChecks.isObject( value ) ) {
                                this.registerTasks( gulp, plugins, app, value, cb );
                            }
                            else
                            if ( app.fn.typeChecks.isFunction( value ) ) {
                                this.registerTask( gulp, plugins, app, value, cb );
                            }
                            else {
                                console.log('else: ' + value);
                            }
                        }
                        else {
                            console.log('task already registred: ' + key);
                        }
                    }
                }
            }
        },


        /**
         * showTasknames
         * @param jsonTasks
         * @return {*}
         * TODO
         */
        'showTasknames' : function (jsonTasks) {
            let tasknames = this.lookupTasknames(jsonTasks);

            if (tasknames !== null) {
                for (let task of tasknames) {
                    console.log('- ' + task);
                }
            }
            else {
                console.log('no task defined!');
            }

            // Wenn das uebergebene jsonTasks Objekt nicht null ist
            if ( app.fn.typeChecks.isObject( jsonTasks ) ) {

                for ( let taskname in jsonTasks ) {
                    if ( taskname !== null
                        && jsonTasks.hasOwnProperty(taskname) ) {

                        let taskvalue = jsonTasks[taskname];

                        if ( app.fn.typeChecks.isFunction(taskvalue) ) {
                            tasknames.push(taskname);
                        }
                        else {
                            tasknames = tasknames.concat(
                                this.lookupTasknames(taskvalue)
                            );
                        }
                    }
                }
            }
            return tasknames;
        },


        /**
         * task
         * @param task
         * @return {*}
         * TODO
         */
        'task': function (task) {
            return requireDir('../tasks/' + task)(gulp, plugins, config, tasks);
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
        }


    };
};