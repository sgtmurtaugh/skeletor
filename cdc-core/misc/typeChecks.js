/**
 * Title:         KBS, IntelliJ IDEA<br>
 * Copyright:     Copyright (c) 2017<br>
 * Company:       Knappschaft-Bahn-See<br>
 * Author:        ckraus<br>
 * Version:       $Revision: 1<br>
 * Modified by:   $Author: ckraus<br>
 * Date:          $Date: 2017-08-31 09:52<br>
 * <p/>
 * <p>Diese Methoden helfen bei der Ueberpruefung von Variablen und deren Werten.</p>
 *
 * <p><em>Hinweis:</em>
 * Da diese Util Methoden sehr oft verwendet werden, sollte das Logging nur waehrend der Entwicklungsphase benutzt
 * werden, aber danach sollten alle Ausgaben auskommentiert werden!</p>
 */

'use strict';

formular.utils.typeChecks = {};


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
formular.utils.typeChecks.getType = function (obj) {
    var type = 'object';

    if ('undefined' === typeof obj) {
        type = 'undefined';
    }
    else
    if (null === obj) {
        type = 'null';
    }
    else {
        if (Array.isArray(obj)) {
            type = 'array';
        }
        else
        if ('boolean' === typeof obj
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
};

/**
 * isArray
 * @param obj
 * @return {boolean}
 * <p>Delegates to <code>getType(obj)</code> and returns true if the returned type is 'array' otherwise false.
 */
formular.utils.typeChecks.isArray = function (obj) {
    // log.enter('formular.utils.typeChecks.isArray', obj);
    var bIs = ('array' === formular.utils.typeChecks.getType(obj));
    // log.return('formular.utils.typeChecks.isArray', bIs);
    return bIs;
};

/**
 * isBoolean
 * @param obj
 * @return {boolean}
 * <p>Delegates to <code>getType(obj)</code> and returns true if the returned type is 'boolean' otherwise false.
 */
formular.utils.typeChecks.isBoolean = function (obj) {
    // log.enter('formular.utils.typeChecks.isBoolean', obj);
    var bIs = ('boolean' === formular.utils.typeChecks.getType(obj));
    // log.return('formular.utils.typeChecks.isBoolean', bIs);
    return bIs;
};

/**
 * isEmpty
 * @param obj
 * @return {boolean}
 * <p>Checks the value depending on the type of the parameter object. Returns true, if the obj is null/undefined, an
 * empty Array or an empty String, otherwise true will be returned.
 */
formular.utils.typeChecks.isEmpty = function (obj) {
    // log.enter('formular.utils.typeChecks.isEmpty', obj);
    var bIsEmpty = false;

    if (formular.utils.typeChecks.isNull(obj)
            || formular.utils.typeChecks.isUndefined(obj)) {

        bIsEmpty = true;
    }
    else
    if (formular.utils.typeChecks.isArray(obj)) {
        bIsEmpty = (obj.length === 0);
    }
    else
    if (formular.utils.typeChecks.isString(obj)) {
        bIsEmpty = (obj.trim().length === 0);
    }

    // log.return('formular.utils.typeChecks.isEmpty', bIsEmpty);
    return bIsEmpty;
};

/**
 * isFunction
 * @param obj
 * @return {boolean}
 * <p>Delegates to <code>getType(obj)</code> and returns true if the returned type is 'function' otherwise false.
 */
formular.utils.typeChecks.isFunction = function (obj) {
    // log.enter('formular.utils.typeChecks.isFunction', obj);
    var bIs = ('function' === formular.utils.typeChecks.getType(obj));
    // log.return('formular.utils.typeChecks.isFunction', bIs);
    return bIs;
};

/**
 * isJSONString
 * @param obj
 * @return {boolean}
 * <p>Delegates to <code>getType(obj)</code> and checks for type 'string'. If true a JSON parse tests the object. When no exeption is thrown true will be returned otherwise false.
 * Attention: Numbers, booleans and null will also return true - these are valid JSON values!
 */
formular.utils.typeChecks.isJSONString = function (obj) {
    // log.enter('formular.utils.typeChecks.isJSONString', obj);
    var bIs = false;

    if ('string' === formular.utils.typeChecks.getType(obj)) {
        try {
            JSON.parse(obj);
            bIs = true;
        }
        catch (e) {
            // ignore error
        }
    }

    // log.return('formular.utils.typeChecks.isJSONString', bIs);
    return bIs;
};

/**
 * isNotEmpty
 * @param obj
 * @return {boolean}
 * <p>Delegates to isEmpty and returns the inverted value.
 */
formular.utils.typeChecks.isNotEmpty = function (obj) {
    // log.enter('formular.utils.typeChecks.isNotEmpty', obj);
    var bNotEmpty = (! formular.utils.typeChecks.isEmpty(obj));
    // log.return('formular.utils.typeChecks.isNotEmpty', bNotEmpty);
    return bNotEmpty;
};

/**
 * isNotEmptyString
 * @param obj
 * @return {boolean}
 * <p>Checks the value depending on the type of the parameter object. Returns true, if the obj is null/undefined, an
 * empty Array or an empty String, otherwise true will be returned.
 */
formular.utils.typeChecks.isNotEmptyString = function (obj) {
    // log.enter('formular.utils.typeChecks.isNotEmptyString', obj);
    var bIsNotEmptyString = false;

    if (formular.utils.typeChecks.isString(obj)
            && !formular.utils.typeChecks.isEmpty(obj)) {

        bIsNotEmptyString = true;
    }

    // log.return('formular.utils.typeChecks.isNotEmptyString', bIsNotEmptyString);
    return bIsNotEmptyString;
};

/**
 * isNull
 * @param obj
 * @return {boolean}
 * <p>Delegates to <code>getType(obj)</code> and returns true if the returned type is 'null' otherwise false.
 */
formular.utils.typeChecks.isNull = function (obj) {
    // log.enter('formular.utils.typeChecks.isNull', obj);
    var bIs = ('null' === formular.utils.typeChecks.getType(obj));

    // log.return('formular.utils.typeChecks.isNull', bIs);
    return bIs;
};

/**
 * isNumeric
 * @param obj
 * @returns {boolean}
 * <p>Checks the value for numeric type.
 */
formular.utils.typeChecks.isNumeric = function (obj) {
    // log.enter('formular.utils.typeChecks.isNumeric', obj);
    var bIs = ((!isNaN(parseFloat(obj)))
                    && isFinite(obj));

    // log.return('formular.utils.typeChecks.isNumeric', bIs);
    return bIs;
};

/**
 * isObject
 * @param obj
 * @return {boolean}
 * <p>Delegates to <code>getType(obj)</code> and returns true if the returned type is 'object' otherwise false.
 */
formular.utils.typeChecks.isObject = function (obj) {
    // log.enter('formular.utils.typeChecks.isObject', obj);
    var bIs = ('object' === formular.utils.typeChecks.getType(obj));
    // log.return('formular.utils.typeChecks.isObject', bIs);
    return bIs;
};

/**
 * isOther
 * @param obj
 * @return {boolean}
 * <p>Delegates to <code>getType(obj)</code> and returns true if the returned type is 'other' otherwise false.
 */
formular.utils.typeChecks.isOther = function (obj) {
    // log.enter('formular.utils.typeChecks.isOther', obj);
    var bIs = ('other' === formular.utils.typeChecks.getType(obj));
    // log.return('formular.utils.typeChecks.isOther', bIs);
    return bIs;
};

/**
 * isString
 * @param obj
 * @return {boolean}
 * <p>Delegates to <code>getType(obj)</code> and returns true if the returned type is 'string' otherwise false.
 */
formular.utils.typeChecks.isString = function (obj) {
    // log.enter('formular.utils.typeChecks.isString', obj);
    var bIs = ('string' === formular.utils.typeChecks.getType(obj));
    // log.return('formular.utils.typeChecks.isString', bIs);
    return bIs;
};


/**
 * isSymbol
 * @param obj
 * @return {boolean}
 * <p>Delegates to <code>getType(obj)</code> and returns true if the returned type is 'symbol' otherwise false.
 */
formular.utils.typeChecks.isSymbol = function (obj) {
    // log.enter('formular.utils.typeChecks.isSymbol', obj);
    var bIs = ('symbol' === formular.utils.typeChecks.getType(obj));
    // log.return('formular.utils.typeChecks.isSymbol', bIs);
    return bIs;
};
/**
 * isUndefined
 * @param obj
 * @return {boolean}
 * <p>Delegates to <code>getType(obj)</code> and returns true if the returned type is 'undefined' otherwise false.
 */
formular.utils.typeChecks.isUndefined = function (obj) {
    // log.enter('formular.utils.typeChecks.isUndefined', obj);
    var bIs = ('undefined' === formular.utils.typeChecks.getType(obj));
    // log.return('formular.utils.typeChecks.isUndefined', bIs);
    return bIs;
};
