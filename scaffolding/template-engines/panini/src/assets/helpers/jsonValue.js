// TODO: Das Plugin JSONPath funktioniert nicht ohne npm install aufgerufen zu haben....
// var JSONPath = require('jsonpath-plus');
let typeChecks = require('../../gulp/functions/type-checks');

/**
 * jsonValue
 * @param jsonObject
 * @param jsonKey
 * @param options
 * <p>
 */
module.exports = function(jsonObject, jsonKey, options) {
    let METHOD = "jsonValue(jsonObject, jsonKey, options)";

    if ( arguments.length < 3 ) {
        throw METHOD + " [ERROR] Es muessen ein JSON Objekt und der JSON Key uebergeben werden.";
    }
    else {
        if ( !typeChecks.isTypeObject(jsonObject) ) {
            throw METHOD + " [ERROR] Der JSON Objekt Parameter ist kein Object.";
        }
        else {
            if ( jsonKey.length < 1 ) {
                throw METHOD + " [ERROR] Der JSON Key Parameter ist leer.";
            }
            else {

                let jsonPath;

                if ( ! typeChecks.isTypeArray(jsonKey) ) {
                    jsonPath = jsonKey.split(".");
                }
                else {
                    jsonPath = jsonKey;
                }

                return getNestedJSON(jsonObject, jsonPath);
            }
        }
    }
};

function getNestedJSON(jsonObject, jsonPath) {
    let jsonValue = null;


    if (typeChecks.isTypeObject(jsonObject)) {
        if (typeChecks.isTypeArray(jsonPath)) {
            jsonValue = jsonObject;
            if ( jsonValue !== null ) {
                jsonPath.forEach(function(jsonKey) {
                    if (jsonValue.hasOwnProperty(jsonKey)) {
                        jsonValue = jsonValue[jsonKey];
                    }
                    else {
                         jsonValue = null;
                         return false;
                    }
                });
            }
        }
    }
    return jsonValue;
}