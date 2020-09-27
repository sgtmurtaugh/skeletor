'use strict';

let gulp;
let plugins;
let app;


/**
 *
 * @type {string}
 */
const ENV_DEVELOPMENT = 'development';
/**
 *
 * @type {string}
 */
const ENV_PRODUCTION = 'production';
/**
 *
 * @type {string}
 */
const ENV_QA = 'qa';

/**
 *
 * @type {string}
 */
const ENV_STAGING = 'staging';
/**
 *
 * @type {string}
 */
const ENV_TEST = 'test';

module.exports.ENV_DEV = ENV_DEVELOPMENT;
module.exports.ENV_PROD = ENV_PRODUCTION;
module.exports.ENV_QA = ENV_QA;
module.exports.ENV_STAGING = ENV_STAGING;
module.exports.ENV_TEST = ENV_TEST;

module.exports = function ( _gulp, _plugins, _app ) {
    gulp = _gulp;
    plugins = _plugins;
    app = _app;

    return {

        /**
         * isDevelopment
         * TODO
         */
        'isDevelop': function () {
            return this.isEnvironment(ENV_DEVELOPMENT);
        },

        /**
         * isProduction
         * TODO
         */
        'isProduction': function () {
            return this.isEnvironment(ENV_PRODUCTION);
        },

        /**
         * isQA
         * TODO
         */
        'isQA': function () {
            return this.isEnvironment(ENV_QA);
        },

        /**
         * isStaging
         * TODO
         */
        'isStaging': function () {
            return this.isEnvironment(ENV_STAGING);
        },

        /**
         * isTest
         * TODO
         */
        'isTest': function () {
            return this.isEnvironment(ENV_TEST);
        },

        /**
         * isUndefined
         * TODO
         */
        'isUndefined': function () {
            return app.fn.typechecks.isEmpty( this.getEnvironment() );
        },

        /**
         * isEnvironment
         * TODO
         * @param {string} expectedEnvironment
         * @return boolean
         */
        'isEnvironment': function (expectedEnvironment) {
            let bIsEnvironment = false;

            if (app.fn.typechecks.isNotEmpty(expectedEnvironment)) {
                let currentEnv = this.getEnvironment();
                if (app.fn.typechecks.isNotEmpty(currentEnv)) {
                    bIsEnvironment = currentEnv.toLowerCase() === expectedEnvironment.toLowerCase();
                }
            }
            return bIsEnvironment;
        },

        /**
         * getEnvironment
         * TODO
         * @return string
         */
        'getEnvironment': function () {
            return process.env.NODE_ENV;
        },

        /**
         * setEnvironment
         * TODO
         * @param {string} environment ['']
         */
        'setEnvironment': function (environment= '') {
            if (app.fn.typechecks.isNotEmpty( environment )) {
                app.logger.info('set environment by param: '.cyan + environment);
                process.env.NODE_ENV = environment;
            }

            // if environment var is not set, then check config or finally default fallback
            if ( app.fn.typechecks.isEmpty( process.env.NODE_ENV ) ) {
                if ( app.config.has( 'environment' ) ) {
                    process.env.NODE_ENV = app.config.get( 'environment' );
                    app.logger.info( 'set environment by config: '.cyan + process.env.NODE_ENV );
                }
                else
                if ( app.config.has('env.default') ) {
                    process.env.NODE_ENV = app.config.get('env.default');
                    app.logger.info( 'set default environment to app default: '.cyan + process.env.NODE_ENV );
                }
                else {
                    app.logger.warn( 'no environment definition found!'.yellow );
                }
            }
        },
    }
}