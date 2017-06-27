'use strict';

import gulp     from 'gulp';
import plugins  from 'gulp-load-plugins';

var requireDir = require('require-dir');

var typechecks = require('./type-checks');

module.exports = {

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
                    let taskfunction = module.exports.lookupTaskFunction( gulp, plugins, app, jsonTasks, taskname, done );

                    if ( taskfunction !== null ) {
                        module.exports.addTask( gulp, plugins, app, taskfunction, done )
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
                        taskvalue = module.exports.lookupTaskFunction(gulp, plugins, app, jsonTasks[key], taskname);

                        if ( taskvalue !== null ) {
                            break;
                        }
                    }
                }
            }
        }

        return taskvalue;
    },


    'lookupTasknames' : function (jsonTasks) {
        // Wenn das uebergebene jsonTasks Objekt nicht null ist
        if ( typechecks.isTypeObject( jsonTasks ) ) {

            for ( let taskname in jsonTasks ) {
                let taskvalue = jsonTasks[taskname];

                if ( typechecks.isTypeFunction(taskvalue) ) {
                    console.log( ' - ' + taskname );
                }
                else {
                    module.exports.lookupTasknames(taskvalue);
                }
            }
        }
    },



    'addTasks': function ( gulp, plugins, app, jsonTasks, done ) {
        if ( jsonTasks !== null ) {
            for (var key in jsonTasks) {
                var value = jsonTasks[key];

                if ( ! gulp.tree().nodes.key ) {
                    if ( typechecks.isTypeObject( value ) ) {
                        module.exports.addTasks( gulp, plugins, app, value, done );
                    }
                    else
                    if ( typechecks.isTypeFunction( value ) ) {
                        module.exports.addTask( gulp, plugins, app, value, done );
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
