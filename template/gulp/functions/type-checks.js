'use strict';
    
module.exports = {


    /**
     * getType
     * @param obj
     * @return {string}
     * <p>Checks the type of the given parameter. Returns the following values:
     * <dl>
     *  <dt>'array'</dt>
     *  <dd>If the param is not null and the method <code>Array.isArray()</code> returns true the String 'array' is returned.</dd>
     *
     *  <dt>'function'</dt>
     *  <dd>If the param is a function the String 'object' is returned.</dd>
     *
     *  <dt>'number'</dt>
     *  <dd>If the param is numeric the String 'number' is returned.</dd>
     *
     *  <dt>'null'</dt>
     *  <dd>If the param is null the String 'null' is returned.</dd>
     *
     *  <dt>'object'</dt>
     *  <dd>If the param is null or of type Object the String 'object' is returned.</dd>
     *
     *  <dt>'other'</dt>
     *  <dd>If the param is not null and not one of the types Array, Object and String the value 'other' is returned.</dd>
     *
     *  <dt>'string'</dt>
     *  <dd>If the param is null or of type String the String 'string' is returned.</dd>
     *
     *  <dt>'undefined'</dt>
     *  <dd>If the param is undefined the String 'undefined' is returned.</dd>
     * </dl>
     * <p>The private method doesn't make use of the log mechanism!
     */
    'getType': function (obj) {
        let type = 'object';

        if ('undefined' === typeof obj) {
            type = 'undefined';
        }
        else if (null === obj) {
            type = 'null';
        }
        else {
            if (Array.isArray(obj)) {
                type = 'array';
            }
            else if ('boolean' === typeof obj
                || 'function' === typeof obj
                || 'number' === typeof obj
                || 'object' === typeof obj
                || 'string' === typeof obj
                || 'symbol' === typeof obj) {

                type = (typeof obj);
            }
            else {
                type = 'other';
            }
        }
        return type;
    },

    /**
     * isArray
     * @param obj
     * @return {boolean}
     * <p>Delegates to <code>getType(obj)</code> and returns true if the returned type is 'array' otherwise false.
     */
    'isArray': function (obj) {
        // log.enter('module.exports.isArray', obj);
        let bIs = ('array' === module.exports.getType(obj));
        // log.return('module.exports.isArray', bIs);
        return bIs;
    },

    /**
     * isBoolean
     * @param obj
     * @return {boolean}
     * <p>Delegates to <code>getType(obj)</code> and returns true if the returned type is 'boolean' otherwise false.
     */
    'isBoolean': function (obj) {
        // log.enter('module.exports.isBoolean', obj);
        let bIs = ('boolean' === module.exports.getType(obj));
        // log.return('module.exports.isBoolean', bIs);
        return bIs;
    },

    /**
     * isEmpty
     * @param obj
     * @return {boolean}
     * <p>Checks the value depending on the type of the parameter object. Returns true, if the obj is null/undefined, an
     * empty Array or an empty String, otherwise true will be returned.
     */
    'isEmpty': function (obj) {
        // log.enter('module.exports.isEmpty', obj);
        let bIsEmpty = false;

        if (module.exports.isNull(obj)
            || module.exports.isUndefined(obj)) {

            bIsEmpty = true;
        }
        else if (module.exports.isArray(obj)) {
            bIsEmpty = (obj.length === 0);
        }
        else if (module.exports.isString(obj)) {
            bIsEmpty = (obj.trim().length === 0);
        }

        // log.return('module.exports.isEmpty', bIsEmpty);
        return bIsEmpty;
    },

    /**
     * isFunction
     * @param obj
     * @return {boolean}
     * <p>Delegates to <code>getType(obj)</code> and returns true if the returned type is 'function' otherwise false.
     */
    'isFunction': function (obj) {
        // log.enter('module.exports.isFunction', obj);
        let bIs = ('function' === module.exports.getType(obj));
        // log.return('module.exports.isFunction', bIs);
        return bIs;
    },

    /**
     * isJSONString
     * @param obj
     * @return {boolean}
     * <p>Delegates to <code>getType(obj)</code> and checks for type 'string'. If true a JSON parse tests the object. When no exeption is thrown true will be returned otherwise false.
     * Attention: Numbers, booleans and null will also return true - these are valid JSON values!
     */
    'isJSONString': function (obj) {
        // log.enter('module.exports.isJSONString', obj);
        let bIs = false;

        if ('string' === module.exports.getType(obj)) {
            try {
                JSON.parse(obj);
                bIs = true;
            }
            catch (e) {
                // ignore error
            }
        }

        // log.return('module.exports.isJSONString', bIs);
        return bIs;
    },

    /**
     * isNotEmpty
     * @param obj
     * @return {boolean}
     * <p>Delegates to isEmpty and returns the inverted value.
     */
    'isNotEmpty': function (obj) {
        // log.enter('module.exports.isNotEmpty', obj);
        let bNotEmpty = (!module.exports.isEmpty(obj));
        // log.return('module.exports.isNotEmpty', bNotEmpty);
        return bNotEmpty;
    },

    /**
     * isNotEmptyString
     * @param obj
     * @return {boolean}
     * <p>Checks the value depending on the type of the parameter object. Returns true, if the obj is null/undefined, an
     * empty Array or an empty String, otherwise true will be returned.
     */
    'isNotEmptyString': function (obj) {
        // log.enter(''isNotEmptyString', obj);
        let bIsNotEmptyString = false;

        if (module.exports.isString(obj)
            && !module.exports.isEmpty(obj)) {

            bIsNotEmptyString = true;
        }

        // log.return('module.exports.isNotEmptyString', bIsNotEmptyString);
        return bIsNotEmptyString;
    },

    /**
     * isNull
     * @param obj
     * @return {boolean}
     * <p>Delegates to <code>getType(obj)</code> and returns true if the returned type is 'null' otherwise false.
     */
    'isNull': function (obj) {
        // log.enter('module.exports.isNull', obj);
        let bIs = ('null' === module.exports.getType(obj));

        // log.return('module.exports.isNull', bIs);
        return bIs;
    },

    /**
     * isNumeric
     * @param obj
     * @returns {boolean}
     * <p>Checks the value for numeric type.
     */
    'isNumeric': function (obj) {
        // log.enter('module.exports.isNumeric', obj);
        let bIs = ((!isNaN(parseFloat(obj)))
            && isFinite(obj));

        // log.return('module.exports.isNumeric', bIs);
        return bIs;
    },

    /**
     * isObject
     * @param obj
     * @return {boolean}
     * <p>Delegates to <code>getType(obj)</code> and returns true if the returned type is 'object' otherwise false.
     */
    'isObject': function (obj) {
        // log.enter('module.exports.isObject', obj);
        let bIs = ('object' === module.exports.getType(obj));
        // log.return('module.exports.isObject', bIs);
        return bIs;
    },

    /**
     * isOther
     * @param obj
     * @return {boolean}
     * <p>Delegates to <code>getType(obj)</code> and returns true if the returned type is 'other' otherwise false.
     */
    'isOther': function (obj) {
        // log.enter('module.exports.isOther', obj);
        let bIs = ('other' === module.exports.getType(obj));
        // log.return('module.exports.isOther', bIs);
        return bIs;
    },

    /**
     * isString
     * @param obj
     * @return {boolean}
     * <p>Delegates to <code>getType(obj)</code> and returns true if the returned type is 'string' otherwise false.
     */
    'isString': function (obj) {
        // log.enter('module.exports.isString', obj);
        let bIs = ('string' === module.exports.getType(obj));
        // log.return('module.exports.isString', bIs);
        return bIs;
    },


    /**
     * isSymbol
     * @param obj
     * @return {boolean}
     * <p>Delegates to <code>getType(obj)</code> and returns true if the returned type is 'symbol' otherwise false.
     */
    'isSymbol': function (obj) {
        // log.enter('module.exports.isSymbol', obj);
        let bIs = ('symbol' === module.exports.getType(obj));
        // log.return('module.exports.isSymbol', bIs);
        return bIs;
    },

    /**
     * isUndefined
     * @param obj
     * @return {boolean}
     * <p>Delegates to <code>getType(obj)</code> and returns true if the returned type is 'undefined' otherwise false.
     */
    'isUndefined': function (obj) {
        // log.enter('module.exports.isUndefined', obj);
        let bIs = ('undefined' === module.exports.getType(obj));
        // log.return('module.exports.isUndefined', bIs);
        return bIs;
    }

};