'use strict';

import npmApplication from './npmApplication';

export default class skeletor extends npmApplication {

    /**
     * Constructor
     * @param gulp
     * @param plugins
     */
    constructor(gulp, plugins, cwd) {
        super(gulp, plugins, cwd);
    }

    /**
     * @private
     * TODO
     */
    _initModules = () =>  {
console.log('##### skeleton.initModules #######');
        super._initModules();

        // this.modules['arraySort'] = require('array-sort');
        // this.modules['camelCase'] = require('camel-case');
        // this.modules['colors'] = require('colors');
        // this.modules['config'] = require('config');
        // this.modules['flat'] = require('flat');
        // this.modules['fs'] = require('fs');
        // this.modules['jsYaml'] = require('js-yaml');
        // this.modules['lodash'] = require('lodash');
        // this.modules['logging'] = require('console-logging');
        // this.modules['requireDir'] = require('require-dir');
        // this.modules['rimraf'] = require('rimraf');
        // this.modules['underscore'] = require('underscore');
        // this.modules['yargs'] = require('yargs');
    }

    run = () => {
        console.log('skeletor!')
    }
}
