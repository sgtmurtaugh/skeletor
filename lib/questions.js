'use strict';

/**
 * exports
 */
module.exports = function(config) {
    var questions = [];

    /**
     * 1. Clone Name (name)
     */
    questions.push({
        name: 'name',
        message: 'Enter new clone name:',
        type: 'input',
        validate: function (name) {
            return ( name != null
            && name.trim() != '' );
        }
    });


    /**
     * 2. Installation Directory (directory)
     */
    questions.push({
        name: 'directory',
        message: 'Enter installation path:',
        type: 'input',
        validate: function (directory) {
            return ( directory != null
            && directory.trim() != '' );
        },
        default: '../test'
    });


    /**
     * 3. Framework Support (frameworkSupport)
     */
    questions.push({
        name: 'frameworkSupport',
        message: 'Install web framework:',
        type: 'confirm',
        default: true
    });


    /**
     * 4. Framework (framework)
     */
    questions.push({
        name: 'framework',
        message: 'Choose Framework:',
        type: 'list',
        choices: [{
            name: 'bootstrap',
            value: 'bootstrap'
        }, {
            name: 'foundation',
            value: 'foundation',
            checked: true
        }, {
            name: 'none',
            value: null
        }],
        // default: 'foundation',
        // validate: function (framework) {
        //     return (framework != null && framework.length > 0);
        // },
        when: function (answers) {
            return answers.frameworkSupport;
        }
    });

    /**
     * 4a. Bootstrap Version (frameworkVersion)
     */
    questions.push({
        name: 'frameworkVersion',
        message: 'Choose Bootstrap Version:',
        type: 'list',
        choices: [{
            name: 'v3.x',
            value: 'v3.x',
            checked: true
        }, {
            name: 'v4.x',
            value: 'v4.x'
        }],
        // default: 'v3.x',
        validate: function (frameworkVersion) {
            return (frameworkVersion != null && frameworkVersion.length > 0);
        },
        when: function (answers) {
            return answers.framework == 'bootstrap';
        }
    });


    // /**
    //  * 5a. Bootstrap Installation (bootstrap)
    //  */
    // questions.push({
    //     name: 'bootstrapTypes',
    //     message: 'Install Bootstrap for:',
    //     // type: 'confirm',
    //     // default: true,
    //     // when: function (answers) {
    //     //     if ( answers.frameworkSupport == true && answers.framework == 'bootstrap' ) {
    //     //         answers['bootstrap'] = true;
    //     //     }
    //     //     return (answers.framework == 'bootstrap' && !answers['bootstrap']);
    //     // }
    //     choices: [{
    //         name: 'apps',
    //         value: 'apps'
    //     }, {
    //         name: 'emails',
    //         value: 'emails'
    //
    //     }, {
    //         name: 'sites',
    //         value: 'sites',
    //         checked: 'true'
    //     }],
    //     //default: 'sites',
    //     validate: function (foundation) {
    //         return (foundation != null && foundation.length > 0);
    //     },
    //     when: function (answers) {
    //         return answers.framework == 'foundation';
    //     }
    // });


    /**
     * 4b. Foundation Version (frameworkVersion)
     */
    questions.push({
        name: 'frameworkVersion',
        message: 'Choose Foundation Version:',
        type: 'list',
        // choices: function (config) {
        //     if ( null != config ) {
        //         config.framework.foundation[]
        //     }
        // },
        choices: [{
            name: 'v6.x',
            value: 'v6.x',
            checked: true
        }],
        // default: 'v6.x',
        validate: function (frameworkVersion) {
            return (frameworkVersion != null && frameworkVersion.length > 0);
        },
        when: function (answers) {
            return answers.framework == 'foundation';
        }
    });


    /**
     * 5b. Foundation Installation (foundation)
     */
    questions.push({
        name: 'foundation',
        message: 'Install Foundation for:',
        type: 'checkbox',
        choices: [{
            name: 'apps',
            value: 'apps'
        }, {
            name: 'emails',
            value: 'emails'

        }, {
            name: 'sites',
            value: 'sites',
            checked: 'true'
        }],
        // default: 'sites',
        validate: function (foundation) {
            return (foundation != null && foundation.length > 0);
        },
        when: function (answers) {
            return answers.framework == 'foundation';
        }
    });


    /**
     * 6. Preprocessor Support (preprocessorSupport)
     */
    questions.push({
        name: 'preprocessorSupport',
        message: 'Install Preprocessors:',
        type: 'confirm',
        default: true,
        when: function (answers) {
            return ( ! answers.frameworkSupport ) || ( null == answers.framework);
        }
    });


    /**
     * 7. Preprocessors (preprocessors)
     */
    questions.push({
        name: 'preprocessors',
        message: 'Choose Preprocessors:',
        type: 'checkbox',
        choices: [{
            name: 'less',
            value: 'less'
        }, {
            name: 'sass',
            value: 'sass',
            checked: 'true'
        }],
        // default: 'sass',
        validate: function (preprocessors) {
            return (preprocessors != null && preprocessors.length > 0);
        },
        when: function (answers) {
            return answers.preprocessorSupport;
        }
    });


    /**
     * 8. Sprite Generator Support (spriteGeneratorSupport)
     */
    questions.push({
        name: 'spriteGeneratorSupport',
        message: 'Install Sprite Generators:',
        type: 'confirm',
        default: true
    });


    /**
     * 9. Sprite Generator List (spriteGenerators)
     */
    questions.push({
        name: 'spriteGenerators',
        message: 'Choose Sprite Generators:',
        type: 'checkbox',
        choices: [{
            name: 'node-sprite-generator',
            value: 'nsg',
            checked: true
        },{
            name: 'svg-sprite',
            value: 'svg'
        }],
        // default: 'nsg',
        validate: function (spriteGenerators) {
            return (spriteGenerators != null && spriteGenerators.length > 0);
        },
        when: function (answers) {
            return answers.spriteGeneratorSupport;
        }
    });


    /**
     * 10. Dependencies Installation (installDependencies)
     */
    questions.push({
        name: 'installDependencies',
        message: 'Install Project Dependencies after cloning:',
        type: 'confirm',
        default: false
    });

    return questions;
};
