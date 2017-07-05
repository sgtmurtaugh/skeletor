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
        gulp.series(
            app.fn.spriteGenerator.copySpriteGeneratorTemplates,
            app.fn.spriteGenerator.addNPMSpriteGeneratorSupport
        )
    );
};
