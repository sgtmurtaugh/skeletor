'use strict';

import NPMApplication from './NPMApplication';

export default class skeletor extends NPMApplication {

    /**
     * Constructor
     * @param gulp
     * @param plugins
     */
    constructor(gulp, plugins) {
        super(gulp, plugins);
    }

    /**
     * @private
     * TODO
     */
    initModules() {
        super.initModules();

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

    run() {
        console.log('skeletor!')
    }
}
