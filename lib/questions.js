'use strict';

/**
 * exports
 */
module.exports = function() {
    var questions = [];

    questions.push({
        name: 'name',
        message: 'Enter new clone name:',
        type: 'input',
        validate: function (name) {
            return ( name != null
            && name.trim() != '' );
        }
    });

    questions.push({
        name: 'directory',
        message: 'Enter installation path:',
        type: 'input',
        validate: function (directory) {
            return ( directory != null
            && directory.trim() != '' );
        },
        default: '../'
    });

    questions.push({
        name: 'frameworkSupport',
        message: 'Install web framework:',
        type: 'confirm',
        default: true
    });

    questions.push({
        name: 'framework',
        message: 'Choose Framework:',
        type: 'list',
        choices: [{
            name: 'bootstrap',
            value: 'bootstrap'
        }, {
            name: 'foundation',
            value: 'foundation'

        }],
        default: 'foundation',
        validate: function (framework) {
            return (framework != null && framework.length > 0);
        },
        when: function (answers) {
            return answers.frameworkSupport;
        }
    });

    questions.push({
        name: 'bootstrap',
        message: 'Install Bootstrap:',
        type: 'confirm',
        default: true,
        when: function (answers) {
            if ( answers.frameworkSupport == true && answers.framework == 'bootstrap' ) {
                answers['bootstrap'] = true;
            }
            return (answers.framework == 'bootstrap' && !answers['bootstrap']);
        }
    });

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
        default: 'sites',
        validate: function (foundation) {
            return (foundation != null && foundation.length > 0);
        },
        when: function (answers) {
            return answers.framework == 'foundation';
        }
    });

    questions.push({
        name: 'installDependencies',
        message: 'Install Project Dependencies after cloning:',
        type: 'confirm',
        default: false
    });

    return questions;
};
