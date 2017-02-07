'use strict';

import gulp     from 'gulp';
import plugins  from 'gulp-load-plugins';
import fs       from 'fs';
import path     from 'path';
import yargs    from 'yargs';
import nsg      from 'node-sprite-generator';
import svgsg    from 'svg-sprite';
import promise  from 'es6-promise';
import browser  from 'browser-sync';


// Load all Gulp plugins into one variable
const $ = plugins();

// Promise Definition for Tasks without Streams or existing Promises
const Promise = promise.Promise;

// Check for --production flag
const PRODUCTION = !!(yargs.argv.production);

// Load settings from settings.yml
// const { COMPATIBILITY, PORT, UNCSS_OPTIONS, PATHS } = loadConfig();
const config = loadConfig();



/* ==============================
 *  # Functions
 * ============================== */

/* ------------------------------
 *  ## Helper Functions
 * ------------------------------ */

/**
 * Load the JSON Config
 */
function loadConfig() {
  // let ymlFile = fs.readFileSync('config.yml', 'utf8');
  // return yaml.load(ymlFile);

  let configFile = fs.readFileSync('config.json', 'utf-8');
  return JSON.parse(configFile);
}

/**
 * Determines all folders of a given directory
 */
function getFolders(dir) {
  return fs.readdirSync(dir)
      .filter(function (file) {
        return fs.statSync(path.join(dir, file)).isDirectory();
      });
}

/* ------------------------------
 *  ## Sprite Functions
 * ------------------------------ */

/**
 * Task-Function
 * Determines all sprite folders inside the sprite-src folder and
 * runs the generateSprite function on each of them.
 */
function generateSprites(done) {
  var folders = getFolders(config.nsg.sprite_src);
  folders.forEach( function (folder) {
    return generateSprite(folder);
  });
  done();
}

/**
 * Creates and runs the Node-Sprite-Generator on the given folder.
 * Only PNG files will be used for the sprite. The output is a sprite PNG and a
 * SASS source file with all containing image informations.
 * @param folder
 * @returns {*}
 */
function generateSprite(folder) {
  return new Promise(function(resolve, reject) {
    console.log('Start generating sprite for \'' + folder + '\' ...');
    nsg({
      src: [
        path.join(config.nsg.sprite_src, folder, '**/*.png')
      ],
      spritePath: path.join(config.nsg.sprite_target, config.nsg.sprite_prefix + folder + config.nsg.sprite_suffix + '.png'),
      stylesheet: 'scss',
      stylesheetPath: path.join(config.nsg.stylesheet_target, config.nsg.stylesheet_prefix + folder + config.nsg.stylesheet_suffix + '.scss'),
      stylesheetOptions: {
        prefix: '',
        spritePath: './'
      },
      compositor: 'jimp',
      layout: 'packed',
      layoutOptions: {
        padding: 30
      }
    }, function (err) {
        if (null == err) {
            console.log('Sprite for \'' + folder + '\' generated!');
        }
        else {
            console.log('Sprite generation failed.' + err);
            console.log(err);
        }
    });
    resolve();
  });
}


/**
 * Task-Function
 * Determines all sprite folders inside the sprite-src folder and
 * runs the generateSprite function on each of them.
 */
function generateSVGSprites(done) {
    var spriter = svgsg({
        log: 'debug',
        dest: config.svgsg.sprite_target
    });

    var folders = getFolders(config.svgsg.sprite_src);
    folders.forEach( function (folder) {
        return generateSVGSprite(spriter, folder);
    });
    done();
}

/**
 * TODO
 * Creates and runs the Node-Sprite-Generator on the given folder.
 * Only PNG files will be used for the sprite. The output is a sprite PNG and a
 * SASS source file with all containing image informations.
 * @param spriter
 * @param folder
 * @returns {*}
 */
function generateSVGSprite(spriter, folder) {
  return new Promise(function(resolve, reject) {
    console.log('Start generating SVG-sprite for \'' + folder + '\' ...');
//TODO
    svgsg.compile({
      css: {
        sprite: config.svgsg.sprite_prefix + folder + config.svgsg.sprite_suffix + '.svg',
        layout: 'packed',
        dimensions: true,
        render: {
            css: true,
            scss: true
        }
      }
    }, function(error, result, cssData) {
      if (null == err) {
        for (var type in result.css) {
          console.log('type: ' + type);
          console.log('path: ' + result.css[type].path);
          // TODO
          //mkdirp.sync(path.dirname(result.css[type].path));
          //fs.writeFileSync(result.css[type].path, result.css[type].contents);

          console.log('SVG-Sprite for \'' + folder + '\' generated!');
        }
      }
      else {
        console.log('SVG-Sprite generation failed.' + err);
        console.log(err);
      }
    });
    resolve();
  });
}

/* ------------------------------
 *  ## SASS Functions
 * ------------------------------ */

/**
 * Compile Sass into CSS
 * In production, the CSS is compressed
 */
function generateSASS() {
  return gulp.src(config.paths.src.sass)
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      includePaths: config.paths.src.sass
    })
      .on('error', $.sass.logError))
    .pipe($.autoprefixer({
      browsers: config.deployment.autoprefixer.compatibility
    }))
    // Comment in the pipe below to run UnCSS in production
    //.pipe($.if(PRODUCTION, $.uncss(UNCSS_OPTIONS)))
    .pipe($.if(PRODUCTION, $.cssnano()))
    .pipe($.if(!PRODUCTION, $.sourcemaps.write()))
    .pipe(gulp.dest(config.paths.dist.css))
    .pipe(browser.reload({ stream: true }));
}



/* ------------------------------
 *  ## JavaScript Functions
 * ------------------------------ */

/**
 * Combine JavaScript into one file
 * In production, the file is minified
 */
function generateJavascript() {
  return gulp.src(config.paths.src.javascript)
    .pipe($.sourcemaps.init())
    .pipe($.babel())
    .pipe($.concat('app.js'))
    .pipe($.if(PRODUCTION, $.uglify()
      .on('error', e => { console.log(e); })
    ))
    .pipe($.if(!PRODUCTION, $.sourcemaps.write()))
    .pipe(gulp.dest(config.paths.dist.javascript));
}



/* ------------------------------
 *  ## Copy Functions
 * ------------------------------ */

/**
 * Copy images to the "dist" folder.
 * In production, the images are compressed
 */
function copyImages() {
  return gulp.src(['src/assets/img/{icons,sprites}/**/*', '!src/assets/img/sprites-src'])
    .pipe($.if(PRODUCTION, $.imagemin({
      progressive: true
    })))
    .pipe(gulp.dest('dist/assets/img'));
}


/* ------------------------------
 *  ## Browser Functions
 * ------------------------------ */

/**
 * Start a server with BrowserSync to preview the site in
 * @param done
 */
function startServer(done) {
  browser.init({
    server: config.paths.dist,
    port: config.development.server.port
  });
  done();
}

/**
 * Reload the browser with BrowserSync
 */
function reloadServer(done) {
  browser.reload();
  done();
}

/**
 * Watch for changes to static assets, pages, Sass, and JavaScript
 * @param done
 */
function watch(done) {
//TODO
//   gulp.watch(PATHS.assets, copy);
//   gulp.watch('src/pages/**/*.html').on('change', gulp.series(pages, browser.reload));
//   gulp.watch('src/{layouts,partials}/**/*.html').on('change', gulp.series(resetPages, pages, browser.reload));
//   gulp.watch('src/assets/scss/**/*.scss', sass);
//   gulp.watch('src/assets/js/**/*.js').on('change', gulp.series(javascript, browser.reload));
  gulp.watch('src/assets/img/**/*').on('change', gulp.series(copyImages, browser.reload));
  // gulp.watch('src/styleguide/**').on('change', gulp.series(styleGuide, browser.reload));
  done();
}



/* ==============================
 *  # Tasks
 * ============================== */

/**
 * Task: generate-sprites
 * runs: generateSprites function
 */
gulp.task('generate-sprites',
    generateSprites
);

/**
 * Task: generate-svg-sprites
 * runs: generateSVGSprites function
 */
gulp.task('generate-svg-sprites',
    generateSVGSprites
);

/**
 * Task: generate-sass
 * runs: generateSASS function
 */
gulp.task('generate-sass',
    generateSASS
);

/**
 * Task: generate-javascript
 * runs: generateJavascript function
 */
gulp.task('generate-javascript',
    generateJavascript
);

/**
 * Task: copy-images
 * runs: copyImages function
 */
gulp.task('copy-images',
    copyImages
);

/**
 * Task: built
 * runs: generate-sass task, generate-javascript task, copy-images task
 */
gulp.task('built',
    gulp.parallel(
        'generate-sass',
        'generate-javascript',
        'copy-images'
    )
);

/**
 * Task: run-server
 * runs: startServer function, watch function
 */
gulp.task('run-server',
    gulp.series(
        startServer,
        watch
    )
);

/**
 * Task: default
 * runs: built task, run-server task
 */
gulp.task('default',
    gulp.series(
        'built',
        'run-server'
    )
);





// import panini   from 'panini';
// import rimraf   from 'rimraf';
// import sherpa   from 'style-sherpa';
// import fs       from 'fs';
//
// // Build the "dist" folder by running all of the below tasks
// gulp.task('build',
//  gulp.series(clean, gulp.parallel(pages, sass, javascript, images, copy), styleGuide));
//
// // Delete the "dist" folder
// // This happens every time a build starts
// function clean(done) {
//   rimraf(PATHS.dist, done);
// }
//
// // Copy files out of the assets folder
// // This task skips over the "img", "js", and "scss" folders, which are parsed separately
// function copy() {
//   return gulp.src(PATHS.assets)
//     .pipe(gulp.dest(PATHS.dist + '/assets'));
// }
//
// // Copy page templates into finished HTML files
// function pages() {
//   return gulp.src('src/pages/**/*.{html,hbs,handlebars}')
//     .pipe(panini({
//       root: 'src/pages/',
//       layouts: 'src/layouts/',
//       partials: 'src/partials/',
//       data: 'src/data/',
//       helpers: 'src/helpers/'
//     }))
//     .pipe(gulp.dest(PATHS.dist));
// }
//
// // Load updated HTML templates and partials into Panini
// function resetPages(done) {
//   panini.refresh();
//   done();
// }
//
// // Generate a style guide from the Markdown content and HTML template in styleguide/
// function styleGuide(done) {
//   sherpa('src/styleguide/index.md', {
//     output: PATHS.dist + '/styleguide.html',
//     template: 'src/styleguide/template.html'
//   }, done);
// }
//
