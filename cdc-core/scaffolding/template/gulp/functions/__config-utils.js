var fs = require('fs');
var path = require('path');

var requireDir = require('require-dir');

module.exports = {

    'loadConfig': function (file) {
        let json = null;
        if (null !== file) {
            let configFile = fs.readFileSync(file, 'utf-8');

            if (null !== configFile) {
                json = JSON.parse(configFile);
            }
        }
        return json;
    },


    'loadConfigs': function (recursive) {
        if (recursive === undefined || recursive === null) {
            recursive = true;
        }

        return requireDir('../conf', {recurse: recursive});
    },


    'getFolders': function (dir) {
        return fs.readdirSync(dir)
            .filter(function (file) {
                return fs.statSync(path.join(dir, file)).isDirectory();
            });
    }

};
