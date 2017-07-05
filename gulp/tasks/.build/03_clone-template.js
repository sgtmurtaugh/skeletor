var gulp;
var plugins;
var app;
var self;

module.exports = function ( _gulp, _plugins, _app ) {
    gulp = _gulp;
    plugins = _plugins;
    app = _app;
    self = app.fn.tasks.taskname(__filename);

    // Pruefen, ob alle Tasks bereits definiert und registriert wurden
    app.fn.tasks.ensureTaskDependencies(gulp, plugins, app, app.tasks, []);

    // Task definieren
    gulp.task( self,
        cloneTemplate
    );
};

/**
 * cloneTemplate
 * @param cb
 * @return {*}
 * <p>When a clone with the given name doesn't exists, the sources will be copied to the destination folder.
 * Furthermore all 'clickdummy-creator-placeholder'-placeholders will be replaced in files and file- / folder-names by
 * the clone name.
 */
function cloneTemplate(cb) {
// TODO!!!! At the moment directories can be overwritten
    app.fn.fs.access(app.wizard.projectFolder, function(err, stat) {
        if (err !== null) {
            // EACCES: Permission denied
            // EADDRINUSE: Address already in use
            // ECONNREFUSED: Connection refused
            // ECONNRESET: Connection reset by peer
            // EEXIST: File exists
            // EISDIR: Is a directory
            // EMFILE: Too many open files in system
            // ENOENT: No such file or directory
            // ENOTDIR: Not a directory
            // ENOTEMPTY: Directory not empty
            // EPERM: Operation not permitted
            // EPIPE: Broken pipe
            // ETIMEDOUT: Operation timed out

            if (err.code === 'EEXIST') {
                cb(new Error(messages(app.wizard.name).projectExists));
            }
        }
    });

    let src = [
        app.fn.path.join(
            app.config.paths.template,
            app.config.paths.recursive
        )
    ];

    return app.fn.template.copyTemplatesSourcesToProjectFolder(src, app.wizard.projectFolder, cb);
}
