'use strict';

import nsg      from 'node-sprite-generator';
import path     from 'path';

var gulp;
var plugins;
var app;

module.exports = function ( _gulp, _plugins, _app ) {
    gulp = _gulp;
    plugins = _plugins;
    app = _app;

    // Pruefen, ob alle Tasks bereits definiert und registriert wurden
    app.fn.tasks.ensureTaskDependencies(gulp, plugins, app, app.tasks, []);

    // Task definieren
    gulp.task( 'generate-sprites', generateSprites );
};

/**
 * generateSprites
 * Task-Function
 * @param done
 * Determines all sprite folders inside the sprite-src folder and
 * runs the generateSprite function on each of them.
 */
function generateSprites( done ) {
    let folders = app.fn.npm.getFolders( app.config.vendor['node-sprite-generator'].sprite.src );
    folders.forEach( function ( folder ) {
        return generateSprite( folder, app );
    });
    done();
}

/**
 * generateSprite
 * Creates and runs the Node-Sprite-Generator on the given folder.
 * Only PNG files will be used for the sprite. The output is a sprite PNG and a
 * SASS source file with all containing image informations.
 * @param folder
 * @param app
 * @returns {*}
 */
function generateSprite( folder, app ) {
    return new Promise( function( resolve, reject ) {
        console.log( 'Start generating sprite for \'' + folder + '\' ...' );
        nsg({
            src: [
                path.join( app.config.vendor['node-sprite-generator'].sprite.src, folder, '**/*.png' )
            ],
            spritePath: path.join( app.config.vendor['node-sprite-generator'].sprite.target, app.config.vendor['node-sprite-generator'].sprite.prefix + folder + app.config.vendor['node-sprite-generator'].sprite.suffix + '.png' ),
            stylesheet: 'scss',
            stylesheetPath: path.join( app.config.vendor['node-sprite-generator'].stylesheet.target, app.config.vendor['node-sprite-generator'].stylesheet.prefix + folder + app.config.vendor['node-sprite-generator'].stylesheet.suffix + '.scss' ),
            stylesheetOptions: {
                prefix: app.config.vendor['node-sprite-generator'].stylesheet.varPrefix + (app.config.vendor['node-sprite-generator'].stylesheet.varPrefixWithFilename ? ( folder + app.config.vendor['node-sprite-generator'].stylesheet.varPrefixWithFilenameSuffix ) : ''),
                spritePath: './'
            },
            compositor: 'jimp',
            layout: 'packed',
            layoutOptions: {
                padding: 30
            }
        }, function ( err ) {
            if ( null === err ) {
                console.log( 'Sprite for \'' + folder + '\' generated!' );
            }
            else {
                console.log( 'Sprite generation failed.' + err );
                console.log( err );
            }
        });
        resolve();
    });
}
