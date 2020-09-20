'use strict';

let path = require('path');

export default class NPMApplication {

    initialized = false;
// TODO : extract app json to config file. location ./ or ./conf/default etc...

    config = null;
    core = {
        'paths': {
            'root': path.join(path.resolve(__dirname), '..'),
            'gulpConfig': path.join(path.resolve(__dirname), '..', 'gulp', 'conf'),
            'gulpTasks': path.join(path.resolve(__dirname), '..', 'gulp', 'tasks'),
            'gulpFunctions': path.join(path.resolve(__dirname), '..', 'gulp', 'fn'),

            'config': 'conf',
            'dist': 'dist',
            'src': 'src',
        },
    };
    fn = {};
    instances = {
        'logger': console
    };
    logger = console;
    modules = {
        'path': path
    };
    tasks= {};


    /**
     * Constructor
     * @param gulp
     * @param plugins
     */
    constructor(gulp, plugins) {
        this.gulp = gulp;
        this.plugins = plugins;

        // initializes the specific app
        this.init();
    }

    /**
     * @private
     */
    init() {
        if (!this.initialized) {
            // preset evironment variables
            this._preInitConfigEnvironmentVariables();

            // initialize and add required modules
            this.initModules();

            // init additional objects
            this.initAdditionalObjects();

            /* ### logger is now avaible ### */

            // load all gulpFunctions
            this._loadGulpFunctions();

            // load dynamically all tasks
            this.initGulpTasks();

            // postset environment variables
            this._postInitConfigEnvironmentVariables();

            // set initialized flag to true
            this.initialized = true;

            // optional log output for 'must have' objects

            // this.fn.log.traceObject( 'this.config', this.config );
            // this.fn.log.traceObject( 'this.fn', this.fn );
            // this.fn.log.traceObject( 'this.tasks', this.tasks );
        }
        else {
            this.instances.logger.log('class already initialized!');
        }
    }

    /**
     * @private
     * TODO
     */
    _preInitConfigEnvironmentVariables() {
        // set NODE_CONFIG_DIR for module config to ./config/:./gulp/conf
        process.env.NODE_CONFIG_DIR = this.core.paths.gulpConfig
            + this.modules.path.delimiter
            + this.core.paths.config;
    }

    /**
     * @private
     * TODO
     */
    _postInitConfigEnvironmentVariables() {
        this.fn.env.setEnvironment( this.modules.yargs.argv._ );
        // TODO: cleanup
        // if ( !!(this.modules.yargs.argv.production) ) {
        //     process.env.NODE_ENV = 'production';
        //     this.logger.info('set environment by console param: '.cyan + process.env.NODE_ENV);
        // }
        //
        // // if environment var is not set, then check config or finally default fallback
        // if ( this.fn.typechecks.isEmpty( process.env.NODE_ENV ) ) {
        //     if ( this.config.has( 'environment' ) ) {
        //         process.env.NODE_ENV = this.config.get( 'environment' );
        //         this.logger.info( 'set default environment: '.cyan + process.env.NODE_ENV );
        //     }
        //     else {
        //         process.env.NODE_ENV = this.config.get('env.default');
        //         this.logger.info( 'set default environment to app default: '.cyan + process.env.NODE_ENV );
        //     }
        // }
    }

    /**
     * @private
     * TODO
     */
    initModules() {
        this.modules['colors'] = require('colors');
        this.modules['config'] = require('config');
        this.modules['flat'] = require('flat');
        this.modules['fs'] = require('fs');
        this.modules['jsYaml'] = require('js-yaml');
        this.modules['logging'] = require('console-logging');
        this.modules['requireDir'] = require('require-dir');
        this.modules['underscore'] = require('underscore');
        this.modules['yargs'] = require('yargs');

        // TODO convert typechecks to npm module
        this.modules['typechecks'] = require('./typechecks');
        // Add shortcut for typecheck functions
        this.fn['typechecks'] = this.modules['typechecks'];
    }

    /**
     * @private
     * TODO
     */
    initAdditionalObjects() {
        // initialize app config
        this.initAppConfig();

        // initalize app logger;
        this.initLogger();

        this.instances.logger.debug('successful '.green + 'initialized additional objects.' );
    }

    /**
     * @returns {{}}
     * @private
     * TODO
     */
    initAppConfig() {
        // link loaded config module to additional alias 'this.config'
        this.config = this.modules.config;

        // now the config module can be loaded and returned
        return this.config;
    }

    /**
     * @private
     * TODO
     */
    initLogger() {
        let logger = this.modules.logging.logger;

        if ( null !== logger ) {
            const PROP_LOGLEVEL = 'logger.logLevel';

            if ( this.config.has( PROP_LOGLEVEL ) ) {
                let logLevel = this.config.get( PROP_LOGLEVEL ).toUpperCase();
                logger.setLevel( logLevel );
                logger.debug('successful '.green + 'set logger logLevel: ' + logLevel );
            }

            logger.debug('successful '.green + 'logger initialized.' );

            // add logger shortcut in this. this is an exception! all other objects are stored under this.instances... but the method definitions are loaded
            this.logger = logger;
        }
    }

    /**
     * loads all defined gulp functions @link this.const.paths.gulpFunctions
     * @private
     */
    _loadGulpFunctions() {
        this.fn = this.modules['underscore'].extend(this.fn,
            require( this.core.paths.gulpFunctions )(this.gulp, this.plugins, this.app));
        this.logger.debug('successful '.green + 'loaded gulp functions.' );
    }

    /**
     * loads all defined task configurations (@link this.fn.tasks.loadTaskConfigs) and registers them in gulp (@link this.fn.tasks.registerTasks)
     * @private
     */
    initGulpTasks() {
        // load task files
        this.tasks = this.fn.tasks.loadTaskConfigs();
        // this.fn.log.traceObject( 'this.tasks', this.tasks );

        let unregisteredTasks = Object.assign({}, this.tasks);

        // register gulp tasks
        if ( this.fn.typechecks.isNotEmpty( unregisteredTasks ) ) {
            let pass = 0;
            const maxPasses = this.fn.json.countKeys( unregisteredTasks, true );

            // register defined gulp tasks
            while ( this.fn.typechecks.isNotEmpty( unregisteredTasks ) ) {
                this.fn.tasks.registerTasks( unregisteredTasks );
                pass++;

                if ( pass > maxPasses ) {
                    break;
                }
            }

            // if unregisteredTasks is still not empty, remove all remaining entries from initially loaded this.tasks!
            if ( this.fn.typechecks.isNotEmpty( unregisteredTasks ) ) {
                let flattenedUnregisteredAppTask = this.modules.flat.flatten(unregisteredTasks, this.config.get('options.flatten'));

                // iter over unregisteredTasks
                this.modules.underscore.each(flattenedUnregisteredAppTask, function (value, key, list) {
                    // remove task from this.tasks
                    if ( this.tasks.hasOwnProperty(key) ) {
                        this.logger.debug(`remove unregistered task from initialized task list. task: '${key}'`);
                        delete this.tasks[key];
                    }

                    // format flattened key to path
                    let folderKey = key.replace(this.config.get('options.flatten.delimiter'), this.modules.path.sep);
                    this.logger.warning('failed'.red + ' to register gulp tasks >>' + `${folderKey}`.red + '<<');
                });
            }
        }
        this.logger.info('finished'.green + ' registered gulp tasks.' + ` ${Object.keys(unregisteredTasks).length} tasks failed.`.yellow );
    }

    /**
     * getter for the app object
     * @returns {{core: {paths: {gulpTasks: *, gulpConfig: *, src: string, root: Promise<void> | void | Q.Promise<any>, dist: string, config: string, gulpFunctions: *}}, instances: {logger: Console}, fn: {}, config: null, modules: {path: *}, tasks: {}}}
     */
    get app() {
        return {
            'config': this.config,
            'core': this.core,
            'fn': this.fn,
            'instances': this.instances,
            'modules': this.modules,
            'tasks': this.tasks
        };
    }

    /**
     * runs application
     */
    run() {
        console.log('NPMApplication!')
    }

}
