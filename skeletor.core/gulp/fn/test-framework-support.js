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
        /*
         * addNPMSupport
         * @param cb
         * <p>Delegates to separate testFramework specific addFramework-Methods
         */
        'addNPMSupport' : function (cb) {
            // when testFramework support is enabled
            if (app.wizard.testFrameworkSupport) {
                // and testFramework selected
                if (!app.fn.typechecks.isEmpty(app.wizard.testFramework)) {
                    return app.fn.json.addNPMEntryToPackageConfiguration(
                        app.config.testFrameworks[app.wizard.testFramework][app.wizard.testFrameworkVersion],
                        cb
                    );
                }
            }
            else {
                console.info('addNPMSupport skipped!');
            }
            cb();
        },


        /*
         * copyDependencies
         * @param cb
         * <p>Copies the testFramework dependencies (e.g. preprocessor template).
         */
        'copyDependencies' : function (cb) {
            let src = null;
        // TODO!!!!!
            // when testFramework support is enabled
            if (app.wizard.testFrameworkSupport) {
                // check dependencies
                let jsonDependencies = app.fn.npm.getOwnPropertyValue(
                    app.config.testFrameworks[app.wizard.testFramework][app.wizard.testFrameworkVersion],
                    'dependencies'
                );

                if (null !== jsonDependencies) {
                    for ( let jsonDependencyKey in jsonDependencies ) {
                        if ( jsonDependencyKey !== null
                                && jsonDependencies.hasOwnProperty(jsonDependencyKey) ) {

                            let jsonDependencyValue = app.fn.npm.getOwnPropertyValue(jsonDependencies, jsonDependencyKey);

                            if ( jsonDependencyKey === 'preprocessor' ) {
        // TODO!!!
        //                      copyPreprocessorTemplates(app.config.preprocessors[jsonDependencyValue], cb);
                            }
                        }
                    }
                }



                // // create testFramework src path variable with user selected testFramework informations
                // src = [
                //     path.join(
                //         app.config.paths.testFrameworks,
                //         app.wizard.testFramework,
                //         app.wizard.testFrameworkVersion,
                //         app.config.paths.recursive
                //     )
                // ];
            }
            else {
                console.info('copyDependencies skipped!');
            }

            // return copyTemplatesSourcesToProjectFolder(src, null, cb);
            cb();
        },

        /*
         * copyTemplates
         * @param cb
         * <p>Copies the testFramework template for the user selected testFramework type to the default installation directory.
         */
        'copyTemplates' : function (cb) {
            let src = null;

            // when testFramework support is enabled
            if (app.wizard.testFrameworkSupport) {
                // create testFramework src path variable with user selected testFramework informations
                src = [
                    path.join(
                        app.config.paths.testFrameworks,
                        app.wizard.testFramework,
                        app.wizard.testFrameworkVersion,
                        app.config.paths.recursive
                    )
                ];
            }
            else {
                console.info('copyTemplates skipped!');
            }

            return app.fn.template.copyTemplatesSourcesToProjectFolder(src, null, cb);
        }
    };
};
