'use strict';

import svgsg    from 'svg-sprite';
import glob     from 'glob';
import fs       from 'fs';
import path     from 'path';
import mkdirp   from 'mkdirp';

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
    gulp.task( 'generate-svg-sprites', generateSVGSprites );
};

/**
 * generateSVGSprites
 * Task-Function
 * Determines all sprite folders inside the sprite-src folder and
 * runs the generateSprite function on each of them.
 * @param done
 */
function generateSVGSprites( done ) {
    let spriter = svgsg(
        app.config.vendor["svg-sprite"]
    );

    let folders = app.fn.npm.getFolders( app.config.vendor.svgsg.sprite_src );

    if ( null !== folders ) {
        folders.forEach( function ( folder ) {
            if ( null !== folder ) {
                let cwd = path.join( app.config.vendor.svgsg.sprite_src, folder );
                let files = glob.glob.sync( '**/*.svg', { cwd: cwd } );

                if ( null !== files ) {
                    files.forEach( function( file ) {
                        if ( null !== file ) {
                            spriter.add(
                                path.resolve( path.join( cwd, file ) ),
                                file,
                                fs.readFileSync( path.join( cwd, file ), { encoding: 'utf-8' } )
                            );
                        }
                    });
                }

                return generateSVGSprite(
                    spriter,
                    folder,
                    app,
                    done
                );
            }
        });
    }
    done();
}

/**
 * TODO
 * generateSVGSprite
 * Creates and runs the Node-Sprite-Generator on the given folder.
 * Only PNG files will be used for the sprite. The output is a sprite PNG and a
 * SASS source file with all containing image informations.
 * @param spriter
 * @param folder
 * @param app
 * @returns {*}
 */
function generateSVGSprite( spriter, folder, app ) {
    // return new Promise( function( resolve, reject ) {
        console.log( 'Start generating SVG-sprite for \'' + folder + '\' ...' );
        console.log( 'path-info: ' + app.config.vendor.svgsg.sprite_prefix + folder + app.config.vendor.svgsg.sprite_suffix + '.svg' );


// var sprite_config = loadConfig( 'sprite.config' );
// if ( null == sprite_config ) {
//     sprite_config = {};
// }
//         sprite_config.sprite = config.vendor.svgsg.sprite_prefix + folder + config.vendor.svgsg.sprite_suffix + '.svg';

        spriter.compile( function( err, result, cssData ) {
            if ( null === err ) {
                for ( let type in result.css ) {
                    mkdirp.sync( path.dirname( result.css[type].path ) );
                    fs.writeFileSync( result.css[type].path, result.css[type].contents );
                    console.log( 'SVG-Sprite for \'' + folder + '\' generated!' );
                }
            }
            else {
                console.log( 'SVG-Sprite generation failed.' + err );
                console.log( err );
            }
        });
        // resolve();
    // });
}
