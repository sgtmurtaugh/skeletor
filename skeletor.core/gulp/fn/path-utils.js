'use strict';

let gulp;
let plugins;
let app;

module.exports = function ( _gulp, _plugins, _app ) {
    gulp = _gulp;
    plugins = _plugins;
    app = _app;

    return {

        /**
         * absolutePath
         * TODO
         * @param {string} paths
         */
        'absolutePath': function (...paths) {
            let absPath = null;

            if ( app.fn.typechecks.isNotEmpty(...paths) ) {
                absPath = app.modules.path.join(app.core.paths.root, ...paths);
            }
            return absPath;
        },

        /**
         * _absolutePath
         * TODO
         * @param {string} relativeParentPath
         * @param {string} paths
         * @private
         */
        '_absolutePathForParent': function (relativeParentPath, ...paths) {
            let absPath = null;

            if ( app.fn.typechecks.isEmpty(relativeParentPath) ) {
                absPath = this.absolutePath( paths );
            }
            else
            if ( app.fn.typechecks.isNotEmpty(...paths) ) {
                let newPaths = paths.slice();
                newPaths.unshift(relativeParentPath);

                absPath = app.modules.path.join(app.core.paths.root, ...newPaths);
            }
            else {
                absPath = app.modules.path.join(app.core.paths.root, relativeParentPath);
            }
            return absPath;
        },

        /**
         * distFolder
         * TODO
         * @param paths
         * @returns {string}
         */
        'distFolder': function (...paths) {
            return this._absolutePathForParent(app.core.paths.dist, ...paths);
        },

        /**
         * distAssetsFolder
         * TODO
         * @param paths
         * @returns {string}
         */
        'distAssetsFolder': function (...paths) {
            return this.distFolder(app.config.paths.assets, ...paths);
        },

        /**
         * srcFolder
         * TODO
         * @param paths
         * @returns {string}
         */
        'srcFolder': function (...paths) {
            return this._absolutePathForParent(app.core.paths.src, ...paths);
        },

        /**
         * srcAssetsFolder
         * TODO
         * @param paths
         * @returns {string}
         */
        'srcAssetsFolder': function (...paths) {
            return this.srcFolder(app.config.paths.assets, ...paths);
        },
    }
};
