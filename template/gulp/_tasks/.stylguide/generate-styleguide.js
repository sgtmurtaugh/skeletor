// import sherpa   from 'style-sherpa';
//
// var gulp;
// var plugins;
// var app;
// let self;
//
// module.exports = function ( _gulp, _plugins, _app ) {
//     gulp = _gulp;
//     plugins = _plugins;
//     app = _app;
//     self = app.fn.tasks.taskname(__filename);
//
//     // // Pruefen, ob alle Tasks bereits definiert und registriert wurden
//     // app.fn.tasks.ensureTaskDependencies(gulp, plugins, app, app.tasks, []);
//     //
//     // // Task definieren
//     // gulp.task( 'generate-styleguide', generateStyleGuide );
//
//     // Sub-Tasks lookup
//     let self_tasks = app.fn.tasks.lookupDependentTasknames(app.tasks, self);
//
//     // if necessary - register depending tasks
//     app.fn.tasks.registerDependingTasks(gulp, plugins, app, app.tasks, self_tasks);
//
//     // define task
//     gulp.task( self,
//         generateStyleGuide
//     );
// };
//
// /**
//  * generateStyleGuide
//  * Task-Function
//  * @param done
//  * Generate a style guide from the Markdown content and HTML template in styleguide/
//  */
// function generateStyleGuide(done) {
//     sherpa(
//         'src/styleguide/index.md',
//         {
//             output: app.config.paths.dist + '/styleguide.html',
//             template: 'src/styleguide/template.html'
//         },
//         done
//     );
// }
