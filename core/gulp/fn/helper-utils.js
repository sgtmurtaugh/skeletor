'use strict';

let typechecks = require('../../lib/typechecks');

module.exports = {

    /*
     * getMergedArray
     * @param obj1
     * @param obj2
     * @return {Array}
     * <p>TODO
     */
    'getMergedArray': function (obj1, obj2) {
        let mergedArray = [];

        if (typechecks.isNotEmpty(obj1)) {
            if (typechecks.isArray(obj1)) {
                mergedArray = mergedArray.concat(obj1);
            }
            else {
                mergedArray.push(obj1);
            }
        }

        if (typechecks.isNotEmpty(obj2)) {
            if (typechecks.isArray(obj2)) {
                mergedArray = mergedArray.concat(obj2);
            }
            else {
                mergedArray.push(obj2);
            }
        }

        return mergedArray;
    },

};
