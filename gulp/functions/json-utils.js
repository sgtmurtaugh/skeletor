var path = require('path');

var gulp;
var plugins;
var app;

module.exports = function ( _gulp, _plugins, _app ) {

    gulp = _gulp;
    plugins = _plugins;
    app = _app;

    return {

        /*
         * addMultipleNPMEntriesToPackageConfiguration
         * @param json
         * @param keyList
         * @param cb
         * @return {*}
         */
        'addMultipleNPMEntriesToPackageConfiguration' : function (json, keyList, cb) {
            // when spritegenerator support is enabled
            if (!app.fn.typeChecks.isEmpty(json)
                && !app.fn.typeChecks.isEmpty(keyList)) {
    
                let packageJson = {
                    devDependencies: {}
                };
    
                // add preprocessor entries in devDependencies (multiple values possible)
                for ( let key of keyList ) {
                    if ( app.fn.npm.hasOwnProperty( json, key ) ) {
                        if ( app.fn.npm.hasOwnProperty( json[key], 'npm')) {
                            // for each preprocessor npm dependency
                            for ( let npmConfigKey in json[key].npm ) {
                                if ( app.fn.npm.hasOwnProperty( json[key].npm, npmConfigKey ) ) {
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
                return this.writeJSONConfigToPackageConfiguration(packageJson, cb);
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
        },


        /*
         * addNPMEntryToPackageConfiguration
         * @param json
         * @param cb
         * @return {*}
         */
        'addNPMEntryToPackageConfiguration' : function (json, cb) {
            // when preprocessor support is enabled
            if (null !== json) {
                let packageJson = {
                    devDependencies: {}
                };
    
                if (app.fn.npm.hasOwnProperty(json, 'npm')) {
                    // add preprocessor entry in devDependencies
                    packageJson.devDependencies = json.npm;
    
                    // add framework definition to package.json
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
                return gulp.src(
                        path.join(
                            app.wizard.projectFolder,
                            app.config.paths.packageJson
                        )
                    )
                    .pipe( plugins.jsonEditor( packageJson ) )
                    .pipe( gulp.dest( app.wizard.projectFolder ) );
            }
            cb();
        }

    };
};
