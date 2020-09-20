var renderTag = require('../renderTag');
var htmlAttrs = require('../htmlAttrs');

/**
 * renderInput
 * @param input
 * @param options
 * <p>.
 */
module.exports = function(input, options) {
    let METHOD = "renderInput(input, options)";
    let validAttrs = [];

    if ( null !== options ) {
        let type = 'text';

        if ( input.hasOwnProperty('type') ) {
            type = input['type'];
        }

// if (type==="checkbox") {
//     console.log('arguments');
//     console.log(arguments);
// }

        let jsonKey = 'components.form.input.'+type;
        let allowedAttrs = htmlAttrs(jsonKey, input);

        if ( allowedAttrs === null
                || allowedAttrs.length < 1 ) {
            console.log('Es konnten zu dem JSON Key "' + jsonKey + '" keine Eintraege mittels htmlAttr ermittelt werden.');
        }
        else {
            for ( let attrKey of allowedAttrs ) {
                if ( input.hasOwnProperty(attrKey) ) {
                    let attrValue = input[attrKey];

                    if ( attrValue !== null
                            && attrValue.toString().trim().length > 0 ) {

                        validAttrs[attrKey] = attrValue;
                    }
                }
            }
        }
    }

    return renderTag('input', validAttrs, input, options);
};
