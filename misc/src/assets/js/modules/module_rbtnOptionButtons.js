//START module_rbtnOptionButtons
/*!
 * @name module_rbtnOptionButtons
 * @author @boelenbe
 * Bereitet das HTML entsprechend für die alternative Darstellung vor
 * */
;(function($) {
    if (!$.kn) {
        $.kn = {};
    };
    $.kn.rbtnOptionButtons = function(el, options) {
        // To avoid scope issues, use 'base' instead of 'this'
        // to reference this class from internal events and functions.
        var base = this;
        // Access to jQuery and DOM versions of element
        base.$el = $(el);
        base.el = el;
        // Add a reverse reference to the DOM object
        base.$el.data("kn.rbtnOptionButtons", base);
        base.init = function() {
            base.options = $.extend({}, $.kn.rbtnOptionButtons.defaultOptions, options);

            var spans = base.$el.find("> span");
            var inputs = spans.find("> input");
            var labels = spans.find("> label");

            base.$el.addClass("rbtnOptionButtons");
            $(".btn__next__rbtnOption").prop("disabled", "disabled");
            labels.removeClass("ffw_invisible");

            if(base.options.jslog) {
                console.log("Modul initialisiert.");
            }

            //Check Radiobuttons by Click on Span
            spans.on(base.options.eventForSpan, function(e) {
               $(this).find("> input").prop("checked", true);
               $(".btn__next__rbtnOption").removeAttr("disabled");
               spans.removeClass(base.options.cssClassActiveSpan);
               $(this).addClass(base.options.cssClassActiveSpan);
            });

        },
        // Run initializer
        base.init();
    };

    $.kn.rbtnOptionButtons.defaultOptions = {
        cssClassActiveSpan: "active",
        eventForSpan: "click",
        jslog: true
    };

    //Search Reset
    $.fn.rbtnOptionButtons = function(options) {
        return this.each(function() {(new $.kn.rbtnOptionButtons(this, options));
        });
    };

})(jQuery);
//END module_rbtnOptionButtons


//Init
$(document).ready (function() {
    $(".rbtn__verzweigung").parents(".ffw_segmentInstance:not(.rbtnOptionButtons)").rbtnOptionButtons();
});

