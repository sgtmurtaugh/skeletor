'use strict';

let path = require('path');

let gulp;
let plugins;
let app;

module.exports = function ( _gulp, _plugins, _app ) {

    gulp = _gulp;
    plugins = _plugins;
    app = _app;

    return {

        /**
         * TODO
         * @param {{}} json
         * @param {boolean} recursive [false]
         */
        'countKeys' : function(json, recursive = false) {
            let count = 0;

            if ( app.fn.typechecks.isObject( json ) ) {
                // count current keys
                count = Object.keys( json ).length;

                // if recursive is true and current count > 0 -> call countKeys recursively
                if ( recursive && count > 0 ) {
                    for (let key in json) {
                        if ( app.fn.typechecks.isNotEmpty( key )
                            && json.hasOwnProperty(key) ) {

                            let value = json[key];

                            if ( app.fn.typechecks.isObject( value ) ) {
                                count += this.countKeys( value );
                            }
                        }
                    }
                }

            }
            return count;
        },

        /**
         * TODO
         * @param {{}} json
         * @param {boolean} recursive [false]
         * @param {boolean} ignoreParentKeys [false]
         */
        'getKeys' : function(json, recursive = false, ignoreParentKeys = false) {
            let keys = [];

            if ( app.fn.typechecks.isObject( json ) ) {
                for (let key of Object.keys(json)) {
                    if ( app.fn.typechecks.isNotEmpty(key) && json.hasOwnProperty(key) ) {
                        let value = json[key];

                        // if value is an object, then check ignoreParentKeys and recursive flags for child handling
                        if ( app.fn.typechecks.isObject(value) ) {
                            // push key, if parent keys are allowed
                            if (!ignoreParentKeys) {
                                keys.push(key);
                            }

                            // when recursive is set to true run recursively through the values object.
                            if (recursive) {
                                let subKeys = this.getKeys(value, recursive, ignoreParentKeys);
                                if (app.fn.typechecks.isNotEmpty(subKeys)) {
                                    Object.assign(keys, subKeys);
                                }
                            }
                        }
                        else {
                            // add current key to array
                            keys.push(key);
                        }
                    }
                }
            }
            return keys;
        },

        /*
         * getOwnPropertyValue
         * @param json
         * @param key
         * <p>Delegates to <code>hasOwnProperty(json, key) and if the check is true the key used as json access key and the
         * return value will be returned.</code>
         */
        'getOwnPropertyValue' : function (json, key) {
            if (this.hasOwnProperty(json, key)) {
                return json[key];
            }
            return null;
        },


        /*
         * hasOwnProperty
         * @param json
         * @param key
         * <p>When both parameters are not null/empty the <code>hasOwnProperty(key)</code> is called on the json parameter with
         * the key as parameter.
         * The boolean return value will also returned. If the initial empty check fails false is returned.
         */
        'hasOwnProperty' : function (json, key) {
            if (!app.functions.typechecks.isEmpty(json)
                && !app.functions.typechecks.isEmpty(key)) {

                return json.hasOwnProperty(key);
            }
            else {
                if (app.functions.typechecks.isEmpty(json)) {
                    console.log('[warn] hasOwnProperty: json parameter is null/empty.');
                }
                if (app.functions.typechecks.isEmpty(key)) {
                    console.log('[warn] hasOwnProperty: key parameter is null/empty.');
                }
            }
            return false;
        },

        /*
         * hasOwnPropertyValue
         * @param json
         * @param key
         * <p>Delegate to <code>getOwnPropertyValue(json, key)</code> and determines the return type. This value is delegated
         * to <code>app.functions.typechecks.isEmpty(obj)</code> analyse for emptyness. The inverted boolean is returned.
         */
        'hasOwnPropertyValue' : function (json, key) {
            return (! app.functions.typechecks.isEmpty( getOwnPropertyValue(json, key)));
        },









        /*
         * addMultipleNPMEntriesToPackageConfiguration
         * @param json
         * @param keyList
         * @param cb
         * @return {*}
         */
        'addMultipleNPMEntriesToPackageConfiguration' : function (json, keyList, cb) {
            // when the json param and the keyList param are not empty
            if (!app.fn.typechecks.isEmpty(json)
                && !app.fn.typechecks.isEmpty(keyList)) {
    
                let packageJson = {
                    devDependencies: {}
                };
    
                // add each keyList entry definition to devDependencies (multiple values possible)
                for ( let key of keyList ) {
                    if ( app.fn.npm.hasOwnProperty( json, key ) ) {
                        if ( app.fn.npm.hasOwnProperty( json[key], 'npm')) {
                            // for each key npm dependency
                            for ( let npmConfigKey in json[key].npm ) {
                                if ( npmConfigKey !== null
                                        && json.hasOwnProperty(npmConfigKey) ) {

                                    if ( app.fn.npm.hasOwnProperty( json[key].npm, npmConfigKey ) ) {
                                        packageJson.devDependencies[npmConfigKey] = json[key].npm[npmConfigKey];
                                    }
                                }
                            }
                        }
                    }
                    else {
                        console.log('[warn] addMultipleNPMEntriesToPackageConfiguration: current key cannot be found in' +
                            ' json. key: ' + key);
                    }
                }
    
                // add definition to package.json
                return this.writeJSONConfigToPackageConfiguration(packageJson, cb);
            }
            else
            if (null === json) {
                console.log('[warn] addMultipleNPMEntriesToPackageConfiguration: json is null.');
            }
            else
            if (null === keyList) {
                console.log('[warn] addMultipleNPMEntriesToPackageConfiguration: keyList is null/empty.');
            }
            cb();
        },


        /*
         * addNPMEntryToPackageConfiguration
         * @param json
         * @param cb
         * @return {*}
         */
        'addNPMEntryToPackageConfiguration' : function (json, cb) {
            // when json is defined
            if (null !== json) {
                let packageJson = {
                    devDependencies: {}
                };

                if (app.fn.npm.hasOwnProperty(json, 'npm')) {
                    // add entry in devDependencies
                    packageJson.devDependencies = json.npm;
    
                    // add definition to package.json
                    return this.writeJSONConfigToPackageConfiguration(packageJson, cb);
                }
            }
            cb();
        },


        /*
         * writeJSONConfigToPackageConfiguration
         * @param packageJson
         * @param cb
         * @return {*}
         * <p>Adds the json snippet parameter to the package.json file in the installation directory.
         */
         'writeJSONConfigToPackageConfiguration' : function (packageJson, cb) {
            if (null !== packageJson) {
// console.dir(packageJson);
// console.log(path.join(app.wizard.projectFolder, app.config.paths.packageJson));
                return gulp.src(
                        path.join(
                            app.wizard.projectFolder,
                            app.config.paths.packageJson
                        )
                    )
// .pipe(plugins.debug())
                    .pipe( plugins.jsonEditor( packageJson ) )
                    // .pipe( plugins.jsonEditor( function (json) {
// console.dir(json);
//                         return json;
//                     }))
                    .pipe( gulp.dest( app.wizard.projectFolder ) );
            }
            cb();
        }

    };
};
