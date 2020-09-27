'use strict';

let gulp;
let plugins;
let app;

module.exports = function ( _gulp, _plugins, _app ) {
    gulp = _gulp;
    plugins = _plugins;
    app = _app;

    return {

        /**
         * addInstance
         * TODO
         * @param {string} key
         * @param {*} instance
         * @param {boolean} override [false]
         */
        'addInstance': function (key, instance, override = false) {
            if ( app.fn.typechecks.isEmpty(key) ) {
                app.logger.warning( 'the given key param is empty/undefined.' );
            }
            else
            if ( app.fn.typechecks.isEmpty(instance) ) {
                app.logger.warning( 'the given key param is empty/undefined.' );
            }
            else {
                // when instance already exists and the boolean flag override is true, reset the instance
                if ( null !== app.instances[key] && override ) {
                    app.logger.warning( `instance with given key >>${key.cyan}<< already exists and will be replaced by the new instance.` );
                }
                app.instances[key] = instance;
            }
        },

        /**
         * requireModule
         * TODO
         * @param {string} moduleNames
         */
        'requireModule': function (...moduleNames) {
            let module = null;

            if (app.fn.typechecks.isNotEmpty(moduleNames)) {
                // app.modules.underscore.each(moduleName, function (element, index, list) {
                for (let moduleName of moduleNames) {
                    let moduleKey = moduleName;

                    // if camel-case is installed, camelcase the current moduleKey
                    if ( null !== app.modules.camelCase ) {
                        moduleKey = app.modules.camelCase.camelCase(moduleKey);
                    }

                    // if module isn't already loaded, require it and store it in global app.modules
                    if (!app.modules[moduleKey]) {
                        try {
                            module = app.modules[moduleKey] = require(moduleName);
                        }
                        catch (e) {
                            app.logger.error(`${'failed'.red} to register npm module '${moduleKey.red}'. is the package name included or is it misspelled?`);
                        }
                    }
                }
            }
            // return last required module
            return module;
        }

    }
};
