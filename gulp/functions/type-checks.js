'use strict';

module.exports = {

    /*
     * getType
     * @param obj
     * @return {string}
     * <p>Checks the type of the given parameter. Returns four different values:
     * <dl>
     *  <dt>'array'</dt>
     *  <dd>If the obj is not null and the method <code>Array.isArray()</code> returns true the String 'array' is returned.</dd>
     *
     *  <dt>'object'</dt>
     *  <dd>If the obj is null or of type Object the String 'object' is returned.</dd>
     *
     *  <dt>'other'</dt>
     *  <dd>If the obj is not null and not one of the types Array, Object and String the value 'other' is returned.</dd>
     *
     *  <dt>'string'</dt>
     *  <dd>If the obj is null or of type String the String 'string' is returned.</dd>
     * </dl>
     */
    'getType': function (obj) {
        let type = 'object';

        if (null !== obj) {
            if (Array.isArray(obj)) {
                type = 'array';
            }
            else
            if (typeof obj === 'string') {
                type = 'string';
            }
            else
            if (typeof obj === 'function') {
                type = 'function';
            }
            else
            if (typeof obj !== 'object') {
                type = 'other';
            }
        }
        return type;
    },

    /*
     * isArray
     * @param obj
     * @return {boolean}
     * <p>Delegates to <code>getType(obj)</code> and returns true if the returned type is 'array' otherwise false.
     */
    'isArray': function (obj) {
        return ('array' === this.getType(obj));
    },

    /*
     * isFunction
     * @param obj
     * @return {boolean}
     * <p>Delegates to <code>getType(obj)</code> and returns true if the returned type is 'function' otherwise false.
     */
    'isFunction': function (obj) {
        return ('function' === this.getType(obj));
    },

    /*
     * isObject
     * @param obj
     * @return {boolean}
     * <p>Delegates to <code>getType(obj)</code> and returns true if the returned type is 'object' otherwise false.
     */
    'isObject': function isObject(obj) {
        return ('object' === this.getType(obj));
    },

    /*
     * isOther
     * @param obj
     * @return {boolean}
     * <p>Delegates to <code>getType(obj)</code> and returns true if the returned type is 'other' otherwise false.
     */
    'isOther': function isOther(obj) {
        return ('other' === this.getType(obj));
    },

    /*
     * isString
     * @param obj
     * @return {boolean}
     * <p>Delegates to <code>getType(obj)</code> and returns true if the returned type is 'string' otherwise false.
     */
    'isString': function isString(obj) {
        return ('string' === this.getType(obj));
    },

    /*
     * isEmpty
     * @param obj
     * @return {boolean}
     * <p>Checks the value depending on the type of the parameter object. Returns true, if the obj is null/'undefined', an
     * empty Array or an empty String, otherwise true will be returned.
     */
    'isEmpty': function (obj) {
        if (null === obj
            || obj === 'undefined') {
            return true;
        }
        else
        if (this.isArray(obj)) {
            return (obj.length === 0);
        }
        else
        if (this.isString(obj)) {
            return (obj.trim().length === 0);
        }
        return false;
    }

};
