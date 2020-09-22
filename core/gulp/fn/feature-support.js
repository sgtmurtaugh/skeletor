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
         * <p>Delegates to separate feature specific addFeature-Methods
         */
        'addNPMSupport' : function (cb) {
            // when feature support is enabled
            if (app.wizard.featureSupport) {
                // and features selected
                if (!app.fn.typechecks.isEmpty(app.wizard.features)) {
                    return app.fn.json.addMultipleNPMEntriesToPackageConfiguration(
                        app.config.features,
                        app.wizard.features,
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
         * <p>TODO
         */
        'copyDependencies' : function (cb) {
            cb();
        },

        /*
         * copyTemplates
         * @param cb
         * <p>Copies the feature templates for the user selected feature types to the default installation
         * directory.
         */
        'copyTemplates' : function (cb) {
            let src = null;
    
            // when feature support is enabled
            if (app.wizard.featureSupport) {
                src = [];
    
                // for each feature add concatenated src path
                for (let feature of app.wizard.features) {
                    // add src folder for the current feature
                    src.push(
                        path.join(
                            app.config.paths.features,
                            feature,
                            app.config.paths.recursive
                        )
                    );
                }
            }
            else {
                console.info('copyTemplates skipped!');
            }
    
            return app.fn.template.copyTemplatesSourcesToProjectFolder(src, null, cb);
        }
    
    };
};
