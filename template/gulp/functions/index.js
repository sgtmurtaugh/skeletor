var fs = require('fs');
var path = require('path');

var configs  = require('./config-utils');
var tasks  = require('./task-utils');
var typechecks  = require('./type-checks');


module.exports = {
    'fs' : fs,
    'path' : path,

    'config' : configs,
    'tasks' : tasks,
    'typechecks' : typechecks
};
