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

formular.utils.typechecks = {};


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
formular.utils.typechecks.getType = function (obj) {
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
formular.utils.typechecks.isArray = function (obj) {
    // log.enter('formular.utils.typechecks.isArray', obj);
    var bIs = ('array' === formular.utils.typechecks.getType(obj));
    // log.return('formular.utils.typechecks.isArray', bIs);
    return bIs;
};

/**
 * isBoolean
 * @param obj
 * @return {boolean}
 * <p>Delegates to <code>getType(obj)</code> and returns true if the returned type is 'boolean' otherwise false.
 */
formular.utils.typechecks.isBoolean = function (obj) {
    // log.enter('formular.utils.typechecks.isBoolean', obj);
    var bIs = ('boolean' === formular.utils.typechecks.getType(obj));
    // log.return('formular.utils.typechecks.isBoolean', bIs);
    return bIs;
};

/**
 * isEmpty
 * @param obj
 * @return {boolean}
 * <p>Checks the value depending on the type of the parameter object. Returns true, if the obj is null/undefined, an
 * empty Array or an empty String, otherwise true will be returned.
 */
formular.utils.typechecks.isEmpty = function (obj) {
    // log.enter('formular.utils.typechecks.isEmpty', obj);
    var bIsEmpty = false;

    if (formular.utils.typechecks.isNull(obj)
            || formular.utils.typechecks.isUndefined(obj)) {

        bIsEmpty = true;
    }
    else
    if (formular.utils.typechecks.isArray(obj)) {
        bIsEmpty = (obj.length === 0);
    }
    else
    if (formular.utils.typechecks.isString(obj)) {
        bIsEmpty = (obj.trim().length === 0);
    }

    // log.return('formular.utils.typechecks.isEmpty', bIsEmpty);
    return bIsEmpty;
};

/**
 * isFunction
 * @param obj
 * @return {boolean}
 * <p>Delegates to <code>getType(obj)</code> and returns true if the returned type is 'function' otherwise false.
 */
formular.utils.typechecks.isFunction = function (obj) {
    // log.enter('formular.utils.typechecks.isFunction', obj);
    var bIs = ('function' === formular.utils.typechecks.getType(obj));
    // log.return('formular.utils.typechecks.isFunction', bIs);
    return bIs;
};

/**
 * isJSONString
 * @param obj
 * @return {boolean}
 * <p>Delegates to <code>getType(obj)</code> and checks for type 'string'. If true a JSON parse tests the object. When no exeption is thrown true will be returned otherwise false.
 * Attention: Numbers, booleans and null will also return true - these are valid JSON values!
 */
formular.utils.typechecks.isJSONString = function (obj) {
    // log.enter('formular.utils.typechecks.isJSONString', obj);
    var bIs = false;

    if ('string' === formular.utils.typechecks.getType(obj)) {
        try {
            JSON.parse(obj);
            bIs = true;
        }
        catch (e) {
            // ignore error
        }
    }

    // log.return('formular.utils.typechecks.isJSONString', bIs);
    return bIs;
};

/**
 * isNotEmpty
 * @param obj
 * @return {boolean}
 * <p>Delegates to isEmpty and returns the inverted value.
 */
formular.utils.typechecks.isNotEmpty = function (obj) {
    // log.enter('formular.utils.typechecks.isNotEmpty', obj);
    var bNotEmpty = (! formular.utils.typechecks.isEmpty(obj));
    // log.return('formular.utils.typechecks.isNotEmpty', bNotEmpty);
    return bNotEmpty;
};

/**
 * isNotEmptyString
 * @param obj
 * @return {boolean}
 * <p>Checks the value depending on the type of the parameter object. Returns true, if the obj is null/undefined, an
 * empty Array or an empty String, otherwise true will be returned.
 */
formular.utils.typechecks.isNotEmptyString = function (obj) {
    // log.enter('formular.utils.typechecks.isNotEmptyString', obj);
    var bIsNotEmptyString = false;

    if (formular.utils.typechecks.isString(obj)
            && !formular.utils.typechecks.isEmpty(obj)) {

        bIsNotEmptyString = true;
    }

    // log.return('formular.utils.typechecks.isNotEmptyString', bIsNotEmptyString);
    return bIsNotEmptyString;
};

/**
 * isNull
 * @param obj
 * @return {boolean}
 * <p>Delegates to <code>getType(obj)</code> and returns true if the returned type is 'null' otherwise false.
 */
formular.utils.typechecks.isNull = function (obj) {
    // log.enter('formular.utils.typechecks.isNull', obj);
    var bIs = ('null' === formular.utils.typechecks.getType(obj));

    // log.return('formular.utils.typechecks.isNull', bIs);
    return bIs;
};

/**
 * isNumeric
 * @param obj
 * @returns {boolean}
 * <p>Checks the value for numeric type.
 */
formular.utils.typechecks.isNumeric = function (obj) {
    // log.enter('formular.utils.typechecks.isNumeric', obj);
    var bIs = ((!isNaN(parseFloat(obj)))
                    && isFinite(obj));

    // log.return('formular.utils.typechecks.isNumeric', bIs);
    return bIs;
};

/**
 * isObject
 * @param obj
 * @return {boolean}
 * <p>Delegates to <code>getType(obj)</code> and returns true if the returned type is 'object' otherwise false.
 */
formular.utils.typechecks.isObject = function (obj) {
    // log.enter('formular.utils.typechecks.isObject', obj);
    var bIs = ('object' === formular.utils.typechecks.getType(obj));
    // log.return('formular.utils.typechecks.isObject', bIs);
    return bIs;
};

/**
 * isOther
 * @param obj
 * @return {boolean}
 * <p>Delegates to <code>getType(obj)</code> and returns true if the returned type is 'other' otherwise false.
 */
formular.utils.typechecks.isOther = function (obj) {
    // log.enter('formular.utils.typechecks.isOther', obj);
    var bIs = ('other' === formular.utils.typechecks.getType(obj));
    // log.return('formular.utils.typechecks.isOther', bIs);
    return bIs;
};

/**
 * isString
 * @param obj
 * @return {boolean}
 * <p>Delegates to <code>getType(obj)</code> and returns true if the returned type is 'string' otherwise false.
 */
formular.utils.typechecks.isString = function (obj) {
    // log.enter('formular.utils.typechecks.isString', obj);
    var bIs = ('string' === formular.utils.typechecks.getType(obj));
    // log.return('formular.utils.typechecks.isString', bIs);
    return bIs;
};


/**
 * isSymbol
 * @param obj
 * @return {boolean}
 * <p>Delegates to <code>getType(obj)</code> and returns true if the returned type is 'symbol' otherwise false.
 */
formular.utils.typechecks.isSymbol = function (obj) {
    // log.enter('formular.utils.typechecks.isSymbol', obj);
    var bIs = ('symbol' === formular.utils.typechecks.getType(obj));
    // log.return('formular.utils.typechecks.isSymbol', bIs);
    return bIs;
};
/**
 * isUndefined
 * @param obj
 * @return {boolean}
 * <p>Delegates to <code>getType(obj)</code> and returns true if the returned type is 'undefined' otherwise false.
 */
formular.utils.typechecks.isUndefined = function (obj) {
    // log.enter('formular.utils.typechecks.isUndefined', obj);
    var bIs = ('undefined' === formular.utils.typechecks.getType(obj));
    // log.return('formular.utils.typechecks.isUndefined', bIs);
    return bIs;
};
