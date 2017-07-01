var path = require('path');

var gulp;
var plugins;
var app;

module.exports = function ( _gulp, _plugins, _app ) {
    gulp = _gulp;
    plugins = _plugins;
    app = _app;

    return {

        /*
         * copyTemplatesSourcesToProjectFolder
         * @param src
         * @param dest
         * @param cb
         * @return {*}
         * <p>Copy given src to target destination and replaces all 'clickdummy-creator-placeholder'
         * placeholder in file- and dirnames and inside files.
         */
        'copyTemplatesSourcesToProjectFolder' : function (src, dest, cb) {
            if (null !== src) {
                // set default destination (src folder inside projectFolder)
                if (null === dest) {
                    dest = path.join(
                        app.wizard.projectFolder,
                        app.config.paths.src
                    );
                }

                return gulp.src(
                    src,
                    { dot: true }
                )
                .pipe(
                    plugins.rename(function (file) {
                        if (file.basename.match( app.const.REGEX_PLACEHOLDER_CLICKDUMMY_CREATOR )) {
                            file.basename = file.basename.replace(
                                app.const.REGEX_PLACEHOLDER_CLICKDUMMY_CREATOR,
                                app.wizard.name
                            );
                        }

                        if (file.dirname.match( app.const.REGEX_PLACEHOLDER_CLICKDUMMY_CREATOR )) {
                            file.dirname = file.dirname.replace(
                                app.const.REGEX_PLACEHOLDER_CLICKDUMMY_CREATOR,
                                app.wizard.name
                            );
                        }

                        return file;
                    })
                )
                .pipe(
                    plugins.replace(
                        app.const.PLACEHOLDER_CLICKDUMMY_CREATOR,
                        app.wizard.name,
                        { skipBinary: true }
                    )
                )
                .pipe(
                    gulp.dest(dest)
                );
            }
            cb();
        }
    };
};
