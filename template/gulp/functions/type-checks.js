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
     * isTypeArray
     * @param obj
     * @return {boolean}
     * <p>Delegates to <code>getType(obj)</code> and returns true if the returned type is 'array' otherwise false.
     */
    'isTypeArray': function (obj) {
        return ('array' === this.getType(obj));
    },

    /*
     * isTypeFunction
     * @param obj
     * @return {boolean}
     * <p>Delegates to <code>getType(obj)</code> and returns true if the returned type is 'function' otherwise false.
     */
    'isTypeFunction': function (obj) {
        return ('function' === this.getType(obj));
    },

    /*
     * isTypeObject
     * @param obj
     * @return {boolean}
     * <p>Delegates to <code>getType(obj)</code> and returns true if the returned type is 'object' otherwise false.
     */
    'isTypeObject': function isTypeObject(obj) {
        return ('object' === this.getType(obj));
    },

    /*
     * isTypeOther
     * @param obj
     * @return {boolean}
     * <p>Delegates to <code>getType(obj)</code> and returns true if the returned type is 'other' otherwise false.
     */
    'isTypeOther': function isTypeOther(obj) {
        return ('other' === this.getType(obj));
    },

    /*
     * isTypeString
     * @param obj
     * @return {boolean}
     * <p>Delegates to <code>getType(obj)</code> and returns true if the returned type is 'string' otherwise false.
     */
    'isTypeString': function isTypeString(obj) {
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
        if (this.isTypeArray(obj)) {
            return (obj.length === 0);
        }
        else
        if (this.isTypeString(obj)) {
            return (obj.trim().length === 0);
        }
        return false;
    }

};
