var requireDir = require('require-dir');
var typechecks = require('./type-checks');

var gulp;
var plugins;
var app;

module.exports = function ( _gulp, _plugins, _app ) {
    gulp = _gulp;
    plugins = _plugins;
    app = _app;

    return {
        'getTask': function (task) {
            return requireDir('../tasks/' + task)(gulp, plugins, config, tasks);
        },


        'loadTaskConfigs': function () {
            return requireDir('../tasks', {recurse: true});
        },


        'ensureTaskDependencies': function ( gulp, plugins, app, jsonTasks, tasknames, done ) {
            if ( typechecks.isTypeArray( tasknames ) ) {
                for ( let taskname of tasknames ) {
                    if ( ! gulp.tree().nodes.hasOwnProperty(taskname) ) {
                        let taskfunction = this.lookupTaskFunction( gulp, plugins, app, jsonTasks, taskname, done );

                        if ( taskfunction !== null ) {
                            this.addTask( gulp, plugins, app, taskfunction, done )
                        }
                    }
                }
            }
        },


        'lookupTaskFunction': function (gulp, plugins, app, jsonTasks, taskname) {
            let taskvalue = null;

            // Wenn das uebergebene jsonTasks Objekt nicht null ist
            if ( typechecks.isTypeObject( jsonTasks ) ) {
                // Wenn ein taskname uebergeben wurde, in dem JSON direkt nach einem Key taskname suchen
                if ( taskname !== null ) {
                    if ( jsonTasks.hasOwnProperty(taskname) ) {
                        taskvalue = jsonTasks[taskname];
                    }

                    // Wenn der ermittelte Wert eine Task-Function ist, dann diese zurueckgeben, andernfalls den JSON
                    // Baumrekursiv durchsuchen.
                    if ( ! typechecks.isTypeFunction( taskvalue ) ) {
                        for ( let key in jsonTasks ) {
                            taskvalue = this.lookupTaskFunction(gulp, plugins, app, jsonTasks[key], taskname);

                            if ( taskvalue !== null ) {
                                break;
                            }
                        }
                    }
                }
            }

            return taskvalue;
        },


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
            if ( typechecks.isTypeObject( jsonTasks ) ) {

                for ( let taskname in jsonTasks ) {
                    let taskvalue = jsonTasks[taskname];

                    if ( typechecks.isTypeFunction(taskvalue) ) {
                        tasknames.push(taskname);
                    }
                    else {
                        tasknames = tasknames.concat(
                            this.lookupTasknames(taskvalue)
                        );
                    }
                }
            }
            return tasknames;
        },


        'lookupTasknames' : function (jsonTasks) {
            let tasknames = [];

            // Wenn das uebergebene jsonTasks Objekt nicht null ist
            if ( typechecks.isTypeObject( jsonTasks ) ) {

                for ( let taskname in jsonTasks ) {
                    let taskvalue = jsonTasks[taskname];

                    if ( typechecks.isTypeFunction(taskvalue) ) {
                        tasknames.push(taskname);
                    }
                    else {
                        tasknames = tasknames.concat(
                            this.lookupTasknames(taskvalue)
                        );
                    }
                }
            }
            return tasknames;
        },


        'lookupDependentTasknames': function (jsonTasks, taskname) {
            let tasknames = [];

            if ( taskname !== null ) {
                // Wenn das uebergebene jsonTasks Objekt nicht null ist
                if ( typechecks.isTypeObject( jsonTasks ) ) {

                    if ( jsonTasks.hasOwnProperty(taskname) ) {
                        let taskvalue = jsonTasks[taskname];

                        if ( typechecks.isTypeFunction(taskvalue) ) {
                            tasknames.push(taskname);
                        }
                        else
                        if ( typechecks.isTypeObject(taskvalue) ) {
                            tasknames.push(
                                this.lookupDependentTasknames(taskvalue, null)
                            );
                        }
                    }
                }
            }
            return tasknames;
        },


        'addTasks': function ( gulp, plugins, app, jsonTasks, done ) {
            if ( jsonTasks !== null ) {
                for (var key in jsonTasks) {
                    var value = jsonTasks[key];

                    if ( ! gulp.tree().nodes.key ) {
                        if ( typechecks.isTypeObject( value ) ) {
                            this.addTasks( gulp, plugins, app, value, done );
                        }
                        else
                        if ( typechecks.isTypeFunction( value ) ) {
                            this.addTask( gulp, plugins, app, value, done );
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
        },


        'addTask': function ( gulp, plugins, app, taskfunction, done ) {
            if ( typechecks.isTypeFunction( taskfunction ) ) {
                taskfunction( gulp, plugins, app, done );
            }
        }
    };
};