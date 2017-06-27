'use strict';

import fs       from 'fs';
import path     from 'path';

var typechecks = require('./type-checks');

module.exports = {

    'concatPaths': function (pathSnippets) {
        let concatPath = null;

        // String
        if ( typechecks.isTypeString(pathSnippets) ) {
            concatPath = pathSnippets;
        }
        else
        // Array mit String
        if ( typechecks.isTypeArray(pathSnippets) ) {
            // String konkatenieren
            for (let snippet of pathSnippets) {
                if (snippet !== null) {
                    // Wenn weder der bereits gefuellte concatPath mit '/' oder '\' endet und das aktuelle snippet
                    // auch nicht mit '/' oder '\' anfaengt, dann ein '/' an den Pfad haengen.
                    if (concatPath !== null) {
                        if (!concatPath.endsWith('/') || !concatPath.endsWith('\\')
                            && !snippet.startsWith('/') || !snippet.startsWith('\\')) {

                            concatPath += '/';
                        }
                        concatPath += snippet;
                    }
                    else {
                        concatPath = snippet;
                    }
                }
            }
        }
        else {
            console.log("Der uebergebene pathSnippet Parameter ist weder ein String noch ein Array. Verwende null!");
        }
        return concatPath;
    },


    'getFolders': function (dir) {
        return fs.readdirSync(dir)
            .filter(function (file) {
                return fs.statSync(path.join(dir, file)).isDirectory();
            });
    }

};
