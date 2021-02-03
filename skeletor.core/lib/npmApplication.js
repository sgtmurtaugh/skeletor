'use strict';

let path = require('path');

export default class npmApplication {

    _initialized = false;
// TODO : extract app json to config file. location ./ or ./conf/default etc...

    config = null;
    core = {};
    //     'paths': {
    //         'root': __dirname,
    //         'gulpConfig': path.join(path.resolve(__dirname), '..', 'gulp', 'conf'),
    //         'gulpTasks': path.join(path.resolve(__dirname), '..', 'gulp', 'tasks'),
    //         'gulpFunctions': path.join(path.resolve(__dirname), '..', 'gulp', 'fn'),
    //
    //         'config': 'conf',
    //         'dist': 'dist',
    //         'src': 'src',
    //     },
    // };
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
     * @param cwd
     */
    constructor(gulp, plugins, cwd) {
        this.gulp = gulp;
        this.plugins = plugins;
        this.core.paths = {
            'root': cwd,

            'gulpConfig': path.join(cwd, 'gulp', 'conf'),
            'gulpTasks': path.join(cwd, 'gulp', 'tasks'),
            'gulpFunctions': path.join(cwd, 'gulp', 'fn'),

            'config': 'conf',
            'dist': 'dist',
            'src': 'src',
        };

        // initializes the specific app
        this._init();
    }

    /**
     * @private
     */
    _init = () => {
        if (!this._initialized) {
            // preset evironment variables
            this._preInitConfigEnvironmentVariables();

            // initialize and add required modules
            this._initModules();

            // init additional objects
            this._initAdditionalObjects();

            /* ### logger is now avaible ### */

            // load all gulpFunctions
            this._loadGulpFunctions();

            // load dynamically all tasks
            this._initGulpTasks();

            // postset environment variables
            this._postInitConfigEnvironmentVariables();

            // set initialized flag to true
            this._initialized = true;

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
    _preInitConfigEnvironmentVariables = () => {
        // set NODE_CONFIG_DIR for module config to ./config/:./gulp/conf
        process.env.NODE_CONFIG_DIR = this.core.paths.gulpConfig
            + this.modules.path.delimiter
            + this.core.paths.config;
    }

    /**
     * @private
     * TODO
     */
    _postInitConfigEnvironmentVariables = () => {
//        this.fn.env.setEnvironment( this.modules.yargs.argv._ );
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
    _initModules = () => {
console.log('##### npmApplication.initModules #######');

        this.modules['arraySort'] = require('array-sort');
        this.modules['colors'] = require('colors');
        this.modules['config'] = require('config');
        this.modules['flat'] = require('flat');
        this.modules['fs'] = require('fs');
        this.modules['is-root'] = require('is-root');
        this.modules['jsYaml'] = require('js-yaml');
        this.modules['logging'] = require('console-logging');
        this.modules['requireDir'] = require('require-dir');
        this.modules['yargs'] = require('yargs');
        this.modules['underscore'] = require('underscore');

        // TODO convert typechecks to npm module
        this.modules['typechecks'] = require('./typechecks');
    }

    /**
     * @private
     * TODO
     */
    _initAdditionalObjects = () => {
        // link shortcuts
        this._linkShortcuts();

        // initialize app config
        this._initAppConfig();

        // initalize app logger;
        this._initLogger();

        this.instances.logger.debug('successful '.green + 'initialized additional objects.' );
    }

    /**
     * @returns {{}}
     * @private
     * TODO
     */
    _linkShortcuts = () => {
        // Add shortcut for functions
        this.fn['_'] = this.modules['underscore'];
        this.fn['typechecks'] = this.modules['typechecks'];
    }

    /**
     * @returns {{}}
     * @private
     * TODO
     */
    _initAppConfig = () => {
        // link loaded config module to additional alias 'this.config'
        this.config = this.modules.config;

        // now the config module can be loaded and returned
        return this.config;
    }

    /**
     * @private
     * TODO
     */
    _initLogger = () => {
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
    _loadGulpFunctions = () => {
        this.fn = this.modules['underscore'].extend(this.fn,
            require( this.core.paths.gulpFunctions )(this.gulp, this.plugins, this));
        this.logger.debug('successful '.green + 'loaded gulp functions.' );
    }

    /**
     * loads all defined task configurations (@link this.fn.tasks.loadTaskConfigs) and registers them in gulp (@link this.fn.tasks.registerTasks)
     * @private
     */
    _initGulpTasks = () => {
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
                    let folderKey = key.replace(this.config.get('foptions.flatten.delimiter'), this.modules.path.sep);
                    this.logger.warning('failed'.red + ' to register gulp tasks >>' + `${folderKey}`.red + '<<');
                });
            }
        }
        this.logger.info('finished'.green + ' registered gulp tasks.' + ` ${Object.keys(unregisteredTasks).length} tasks failed.`.yellow );
    }

    /**
     * runs application
     */
    run = () => {
        console.log('NPMApplication!')
    }

}
