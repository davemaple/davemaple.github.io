(function ($) {
    $.fn.slidinglabels = function (options) {

        var defaults = {
            className: "slideLabel",
            leftPosition: "5px",
            yAdjustment: 1,
            axis: "y",
            speed: "fast"
        };

        var options = $.extend(defaults, options);
        var itemwrapper = this.find("." + defaults.className + "");
        var labels = itemwrapper.find("label");
        return labels.each(function () {
            obj = $(this);
            var targetId = obj.attr('slideTarget');
            var parent = obj.parents("." + defaults.className + "");
            parent.css({
                position: "relative"
            });

            var target = $(("#" + targetId));

            var targetHeight = target.outerHeight()
            var labelHeight = obj.outerHeight()

            var offset;
            if (target.is('textarea')) {
                offset = labelHeight / 2;
            } else {
                offset = Math.ceil((targetHeight - labelHeight) / 2);
            }
            //document.getElementById('debugTextarea').value += targetId + " = t:" + targetHeight + " l: " + labelHeight + "\n";

            var input = $(this).next();

            obj.css({
                position: "absolute",
                top: offset + "px",
                left: defaults.leftPosition,
                display: "inline",
                "z-index": 99
            });

            var inputval = $(this).next().val();
            var labelwidth = $(this).width();
            var labelmove = labelwidth + defaults.yAdjustment + "px";
            var labelheight = $(this).height() + defaults.yAdjustment;
            if (((input.is('input') || input.is('textarea')) && inputval !== "")
					|| (input.is('select') && $("option:selected", input)
							.text() != '')) {
                if (defaults.axis == "x") {
                    obj.stop().animate({
                        left: "-" + labelmove
                    }, 1)
                } else {
                    //                    document.getElementById('debugTextarea').value += inputval + "\n";
                    if (defaults.axis == "y") {
                        obj.stop().animate({
                            top: "-" + labelheight
                        }, 1)
                    }
                }
            }
            $("input, textarea, select").bind('change focus', function () {
                var label = $(this).prev("label");
                var width = label.width();
                var height = label.height() + defaults.yAdjustment;
                var adjustUp = height + "px";
                if ($(this).is('select')) {
                    var value = $("option:selected", this).text();
                } else {
                    var value = $(this).val();
                }
                if (value == "") {
                    if (defaults.axis == "x") {
                        label.stop().animate({
                            left: "-" + adjust
                        }, defaults.speed)
                    } else {
                        if (defaults.axis == "y") {
                            label.stop().animate({
                                top: "-" + adjustUp
                            }, defaults.speed)
                        }
                    }
                } else {
                    if (defaults.axis == "x") {
                        label.css({
                            left: "-" + adjust
                        })
                    } else {
                        if (defaults.axis == "y") {
                            label.css({
                                top: "-" + adjustUp
                            })
                        }
                    }
                }
            }).bind('change blur', function () {
                var label = $(this).prev("label");
                if ($(this).is('select')) {
                    var value = $("option:selected", this).text();
                } else {
                    var value = $(this).val();
                }
                if (value == "") {
                    if (defaults.axis == "x") {
                        label.stop().animate({
                            left: defaults.leftPosition
                        }, defaults.speed)
                    } else {
                        if (defaults.axis == "y") {

                            var target = $(this);
                            var offset;

                            if (target.is('textarea')) {
                                offset = label.outerHeight() / 2;
                            } else {
                                offset = Math.ceil((target.outerHeight() - label.outerHeight()) / 2);
                            }

                            var input = $(this).next();

                            label.stop().animate({
                                top: offset + "px"
                            }, defaults.speed)
                        }
                    }
                }
            })
        })
    }
})(jQuery);
