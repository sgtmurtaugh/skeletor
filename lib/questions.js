'use strict';

/**
 * exports
 */
module.exports = function(inq, config) {
    let questions = [];

    /**
     * 1. Clone Name (name)
     */
    questions.push({
        name: 'name',
        message: 'Enter new clone name:',
        type: 'input',
        validate: function (name) {
            return ( name !== null && name.trim() !== '' );
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
            return ( directory !== null && directory.trim() !== '' );
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
        default: true,
        when: function (answers) {
            return hasFrameworkSupport(answers);
        }
    });


    /**
     * 4. Framework (framework)
     */
    questions.push({
        name: 'framework',
        message: 'Choose Framework:',
        type: 'list',
        choices: function (answers) {
            let choices = [];
            let frameworks = config.frameworks;

            for (let frameworkKey in frameworks) {
                if (frameworkKey !== null) {
                    choices.push({
                        name: frameworkKey
                    });
                }
            }

            return choices;
        },
        when: function (answers) {
            let bShowFrameworkQuestion = answers.frameworkSupport;
            // if true, at least one framework is configured
            if (bShowFrameworkQuestion) {
                // when more than one framework is configured prompt question
                // otherwise autoselect the only configured one.
                let keys = Object.keys(config.frameworks);
                bShowFrameworkQuestion = (keys.length > 1);

                if (!bShowFrameworkQuestion) {
                    // autoselect only configured one
                    answers.framework = keys[0];
                }
            }
            return bShowFrameworkQuestion;
        }
    });

    /**
     * 5. Framework Version (frameworkVersion)
     */
    questions.push({
        name: 'frameworkVersion',
        message: 'Choose Framework Version:',
        type: 'list',
        choices: function (answers) {
            let choices = [];
            let framework = config.frameworks[answers.framework];

            for (let versionKey in framework) {
                if ( versionKey !== null ) {
                    choices.push({
                        name: answers.framework + ' ' + versionKey,
                        value: versionKey
                    });
                }
            }

            return choices;
        },
        validate: function (frameworkVersion) {
            return (frameworkVersion !== null && frameworkVersion.length > 0);
        },
        when: function (answers) {
            let bShowFrameworkVersionQuestion = answers.frameworkSupport;
            // if true, at least one framework is configured
            if (bShowFrameworkVersionQuestion) {
                // when more than one framework is configured prompt question
                // otherwise autoselect the only configured one.
                let keys = Object.keys(config.frameworks[answers.framework]);
                bShowFrameworkVersionQuestion = (keys.length > 1);

                if (!bShowFrameworkVersionQuestion) {
                    // autoselect only configured one
                    answers.frameworkVersion = keys[0];
                }
            }
            return bShowFrameworkVersionQuestion;
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
            let bHasPreprocessorSupport = false;

            // prompt this question only when the frameworkSupport is true and the preprocessorSupport is configured.
            if ( ! answers.frameworkSupport ) {
                bHasPreprocessorSupport = hasPreprocessorsSupport(answers);
            }
            return bHasPreprocessorSupport;
        }
    });


    /**
     * 7. Preprocessor (preprocessor)
     */
    questions.push({
        name: 'preprocessor',
        message: 'Choose Preprocessor:',
        type: 'list',
        choices: function (answers) {
            let choices = [];
            let preprocessors = config.preprocessors;

            for (let preprocessorKey in preprocessors) {
                if ( preprocessorKey !== null ) {
                    choices.push({
                        name: preprocessorKey
                    });
                }
            }

            return choices;
        },
        validate: function (preprocessors) {
            return (preprocessors !== null && preprocessors.length > 0);
        },
        when: function (answers) {
            let bShowPreprocessorQuestion = answers.preprocessorSupport;
            // if true, at least one preprocessor is configured
            if (bShowPreprocessorQuestion) {
                // when more than one preprocessor is configured prompt question
                // otherwise autoselect the only configured one.
                let keys = Object.keys(config.preprocessors);
                bShowPreprocessorQuestion = (keys.length > 1);

                if (!bShowPreprocessorQuestion) {
                    // autoselect only configured one
                    answers.preprocessor = keys[0];
                }
            }
            return bShowPreprocessorQuestion;
        }
    });


    /**
     * 8. Sprite Generator Support (spriteGeneratorSupport)
     */
    questions.push({
        name: 'spriteGeneratorSupport',
        message: 'Install Sprite Generators:',
        type: 'confirm',
        default: true,
        when: function (answers) {
            return hasSpriteGeneratorSupport(answers);
        }
    });


    /**
     * 9. Sprite Generator List (spriteGenerators)
     */
    questions.push({
        name: 'spriteGenerators',
        message: 'Choose Sprite Generators:',
        type: 'checkbox',
        choices: function (answers) {
            let choices = [];
            let spriteGenerators = config.spritegenerators;

            for (let spriteGeneratorsKey in spriteGenerators) {
                if ( spriteGeneratorsKey !== null ) {
                    choices.push({
                        name: spriteGeneratorsKey
                    });
                }
            }

            return choices;
        },
        validate: function (spriteGenerators) {
            return (spriteGenerators !== null && spriteGenerators.length > 0);
        },
        when: function (answers) {
            let bShowSpriteGeneratorQuestion = answers.spriteGeneratorSupport;
            // if true, at least one preprocessor is configured
            if (bShowSpriteGeneratorQuestion) {
                // when more than one preprocessor is configured prompt question
                // otherwise autoselect the only configured one.
                let keys = Object.keys(config.spritegenerators);
                bShowSpriteGeneratorQuestion = (keys.length > 1);

                if (!bShowSpriteGeneratorQuestion) {
                    // autoselect only configured one
                    answers.spriteGenerators = keys[0];
                }
            }
            return bShowSpriteGeneratorQuestion;
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


    /**
     * hasFrameworkSupport
     * @param answers
     * @return {boolean}
     */
    function hasFrameworkSupport(answers) {
        let bShowFrameworkQuestion = answers.frameworkSupport;
        if ( bShowFrameworkQuestion === undefined ) {
            // default
            bShowFrameworkQuestion = false;

            let jsonFrameworks = config.frameworks;
            if (jsonFrameworks !== null) {
                for ( let frameworkKey in jsonFrameworks ) {
                    if ( frameworkKey !== null ) {
                        let jsonFramework = jsonFrameworks[frameworkKey];
                        for ( let frameworkVersionKey in jsonFramework ) {
                            if ( frameworkVersionKey !== null
                                    && jsonFramework[frameworkVersionKey] !== null ) {

                                bShowFrameworkQuestion = true;
                                break;
                            }
                        }
                    }

                    // break loop when at least one defined framework with version can be found
                    if (bShowFrameworkQuestion) break;
                }
            }
        }
        return bShowFrameworkQuestion;
    }

    /**
     * hasPreprocessorsSupport
     * @param answers
     * @return {boolean}
     */
    function hasPreprocessorsSupport(answers) {
        let bShowPreprocessorsQuestion = answers.preprocessorSupport;
        if ( bShowPreprocessorsQuestion === undefined ) {
            // default
            bShowPreprocessorsQuestion = false;

            let jsonPreprocessors = config.preprocessors;
            if (jsonPreprocessors !== null) {

                for ( let preprocessorsKey in jsonPreprocessors ) {
                    if ( preprocessorsKey !== null ) {
                        let jsonPreprocessor = jsonPreprocessors[preprocessorsKey];

                        for ( let preprocessorKey in jsonPreprocessor ) {
                            if ( preprocessorKey !== null ) {
                                bShowPreprocessorsQuestion = true;
                                break;
                            }
                        }
                    }

                    // break loop when at least one defined framework with version can be found
                    if ( bShowPreprocessorsQuestion ) break;
                }
            }
        }
        return bShowPreprocessorsQuestion;
    }

    /**
     * hasSpriteGeneratorSupport
     * @param answers
     * @return {boolean}
     */
    function hasSpriteGeneratorSupport(answers) {
        let bShowSpriteGeneratorQuestion = answers.spriteGeneratorSupport;
        if ( bShowSpriteGeneratorQuestion === undefined ) {
            // default
            bShowSpriteGeneratorQuestion = false;

            let jsonSpriteGenerators = config.spritegenerators;
            if (jsonSpriteGenerators !== null) {
                for ( let spriteGeneratorKey in jsonSpriteGenerators ) {
                    if ( spriteGeneratorKey !== null ) {
                        bShowSpriteGeneratorQuestion = true;
                        break;
                    }
                }
            }
        }
        return bShowSpriteGeneratorQuestion;
    }

};
