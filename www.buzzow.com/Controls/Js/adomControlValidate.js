/* common stuff */
Number.prototype.formatMoney = function (c, d, t) {
    var n = this, c = isNaN(c = Math.abs(c)) ? 2 : c, d = d == undefined ? "," : d, t = t == undefined ? "." : t, s = n < 0 ? "-" : "", i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

var defaults = {
    appRoot: '',
    dimmingColor: '#ffffff',
    techIssueSupportNotifiedTitle: 'Problem!',
    techIssueSupportNotifiedMessage: 'We experienced a technical issue processing your request.  Support has been notified and will address this issue as soon as possible.  We apologize for the inconvenience.'
};

var AdomNotify = {
    tooltip: null
};


var AdomJs = {

    closeModal: function (selector) {
        if ($(selector).overlay().isOpened()) {
            $(selector).overlay().close();
        }

        return false;
    },
    showWaiting: function () {
        $('#messageModaLoading').show();
        $('#messageModalMessagePanel').hide();
        $('.messageModal').overlay().load();
    },
    hideWaiting: function () {
        AdomJs.closeModal('.messageModal');
    },
    showMessage2: function (adomOpt) {
        if (adomOpt != null
            && adomOpt.title != null && adomOpt.title.length > 0
            && adomOpt.message != null && adomOpt.message.length > 0) {

            var title = $('#defaultMessageModalTitle');
            var icon = $('#messageModalMessagePanel i');
            if (adomOpt.success) {
                title.removeClass('error');
                icon.removeClass('icon-exclamation');
                icon.addClass('icon-ok-circle');
            } else {
                title.addClass('error');
                icon.addClass('icon-exclamation');
                icon.removeClass('icon-ok-circle');
            }
            title.html(adomOpt.title);

            $('#defaultMessageModalMessage').html(adomOpt.message);

            $('#messageModaLoading').hide();
            $('#messageModalMessagePanel').show();

            if (!$('.messageModal').overlay().isOpened()) {
                $('.messageModal').overlay().load();
            }
            $('#messageModalOkButton').focus();
        }
    },

    showMessage: function (adomOpt) {

        var opts = {
            pnotify_text: adomOpt.message
        };

        if (adomOpt.title != null) {
            opts.pnotify_title = adomOpt.title;
        }

        if (adomOpt.customClass != null) {
            opts.pnotify_addclass = adomOpt.customClass;
        }

        if (adomOpt.width != null) {
            opts.pnotify_width = adomOpt.width;
        }

        if (adomOpt.iconClass != null) {
            opts.pnotify_notice_icon = 'ui-icon ' + adomOpt.iconClass;
        }

        if (adomOpt.delay != null) {
            opts.pnotify_delay = adomOpt.delay;
        } else {
            opts.pnotify_hide = false;
        }

        if ((adomOpt.postionTargetId != null || adomOpt.postionTarget != null) && adomOpt.postionPosition != null) {

            var target = null;

            if (adomOpt.postionTargetId != null) {
                target = $('#' + adomOpt.postionTargetId);
            }

            if (adomOpt.postionTarget != null) {
                target = $(adomOpt.postionTarget);
            }

            if (target != null) {
                var offset = target.offset();

                var top = offset.top;
                var left = offset.left;

                if (adomOpt.postionPosition == 'topLeft') {
                    left += target.width();
                }

                if (adomOpt.postionVertOffset != null) {
                    top += adomOpt.postionVertOffset;
                }

                if (adomOpt.postionHorzOffset != null) {
                    left += adomOpt.postionHorzOffset;
                }

                opts.pnotify_before_open = function (pnotify) {
                    pnotify.pnotify({
                        pnotify_before_open: null
                    });
                    return false;
                }
            }
        }

        var notify = $.pnotify(opts);

        notify.css({
            "top": top - notify.height(),
            "left": left
        });

        notify.pnotify_display();

        if (adomOpt.forceReturn != null) {

            return adomOpt.forceReturn;
        }
    },

    markWithClass: function (selector, className, addIt) {
        var control = $(selector);

        if (control != null) {
            if (addIt) {
                control.addClass(className);
            } else {
                control.removeClass(className);
            }
        }
    },

    stripeTable: function (selector) {
        $(selector).each(function () {
            var i = 0;
            $(this).find('tr').each(function () {
                if (i % 2) {
                    $(this).addClass('even');
                }
                i++;
            });
        });
    },

    showToolTip: function (event) {

        var pPopMessage = AdomJs.getPPopMessage(event.data.title, event.data.message, true);

        var opts = {
            pnotify_text: pPopMessage,
            pnotify_width: '350px',
            pnotify_addclass: 'customPPop',
            pnotify_hide: false,
            pnotify_closer: false,
            pnotify_history: false,
            pnotify_animate_speed: 100,
            pnotify_opacity: .9,
            //            pnotify_notice_icon: event.data.iconClass,
            // Setting stack to false causes Pines Notify to ignore this notice when positioning.
            pnotify_stack: false,
            pnotify_after_init: function (pnotify) {
                // Remove the notice if the user mouses over it.
                pnotify.mouseout(function () {
                    pnotify.pnotify_remove();
                });
            },
            pnotify_before_open: function (pnotify) {
                // This prevents the notice from displaying when it's created.
                pnotify.pnotify({
                    pnotify_before_open: null
                });
                return false;
            }
        };

        AdomNotify.tooltip = $.pnotify(opts);
        AdomNotify.tooltip.pnotify_display();
    },

    moveToolTip: function (event) {
        if (AdomNotify.tooltip != null) {
            AdomNotify.tooltip.css({ 'top': event.clientY + 25, 'left': event.clientX - 100 });
        }
    },

    killToolTip: function (event) {

        if (AdomNotify.tooltip != null) {
            AdomNotify.tooltip.pnotify_remove();
        }
    },

    validateAllControls2: function (adomOpt) {
        var allValid = true;
        if (adomOpt.validationResultSelector != null && adomOpt.validationResultSelector.length > 0) {
            $(adomOpt.validationResultSelector).html("");
        }

        var targetSelector = (adomOpt.targetSelector != null && adomOpt.targetSelector.length > 0) ? adomOpt.targetSelector + " " : "";
        $(targetSelector + '.adomVal').each(function (index) {
            var valid = AdomJs.validateControlEmpty(this, adomOpt.evenIfEmpty, adomOpt.waitForAjaxCalls, adomOpt.validationResultSelector);

            if (!valid) {
                allValid = false;
            }
        });

        return allValid;
    },

    validateAllControls: function (adomOpt) {

        var allValid = true;
        var targetSelector = (adomOpt.targetSelector != null && adomOpt.targetSelector.length > 0) ? adomOpt.targetSelector + " " : "";
        $(targetSelector + '.adomVal').each(function (index) {
            var valid = AdomJs.validateControlEmpty(this, adomOpt.evenIfEmpty, adomOpt.waitForAjaxCalls);

            if (!valid) {
                allValid = false;
            }
        });

        if (!allValid && adomOpt.postionTarget != null) {

            var postionHorzOffset = -120;
            if (adomOpt.postionHorzOffset != null) {
                postionHorzOffset = adomOpt.postionHorzOffset;
            }

            var postionVertOffset = 0;
            if (adomOpt.postionVertOffset != null) {
                postionVertOffset = adomOpt.postionVertOffset;
            }

            var postionPosition = 'topLeft';
            if (adomOpt.postionPosition != null) {
                postionPosition = adomOpt.postionPosition;
            }

            var pPopMessage = AdomJs.getPPopMessage(validateMessages.problemsFoundTitle, validateMessages.correctHighlightedMessage, true);

            AdomJs.showMessage({ width: '350px', customClass: 'customPPop', message: pPopMessage, delay: 3000,
                postionTarget: adomOpt.postionTarget, postionTargetId: adomOpt.postionTargetId, postionPosition: postionPosition, postionHorzOffset: postionHorzOffset, postionVertOffset: postionVertOffset, forceReturn: false
            });
        }

        return allValid;
    },

    getPPopMessage: function (title, message, isProblem) {
        var iconClass = "customPopNotifyIconContainer";

        if (isProblem) {
            iconClass = "customPopProblemIconContainer";
        }

        var pPopMessage = "<table cellpadding=\"0\" cellspacing=\"0\">" +
            "<tr>" +
            "    <td><div class=\"" + iconClass + "\"></div></td>" +
            "    <td class=\"customPPopIconVertSeparator\"></td>" +
            "    <td>" +
            "        <div class=\"customPPopProblemsTitle customProblemsTitle\">" + title + "</div>" +
            "        <div class=\"customPPopProblemsMessage customProblemsMessage\">" + message + "</div>" +
            "    </td>" +
            "</tr>" +
            "</table>";

        return pPopMessage;
    },

    getFieldDescription: function (target) {
        var fieldDescription = "Field";
        
        if (target != null) {
            var targetSlideLabel = $("[slidetarget='" + target.attr("id") + "']");
            fieldDescription = (targetSlideLabel != null) ? targetSlideLabel.text() : fieldDescription;
        }

        return fieldDescription;
    },

    updateValidationResult: function (errorMessage, validationResultSelector) {
        if (errorMessage != null && errorMessage.length > 0
            && validationResultSelector != null && validationResultSelector.length > 0) {
            var validationResultTarget = $(validationResultSelector);
            
            if (validationResultTarget != null) {
                validationResultTarget.append(errorMessage);
            }
        }
    },

    validateControl: function (control) {
        return AdomJs.validateControlEmpty(control, true, false, null);
    },

    validateControlEmpty: function (control, evenIfEmpty, waitForAjaxCalls, validationResultSelector) {
        var hasError = false;
        var errorMessage = '';

        var obj = $(control);
        var req = AdomJs.getAttributeBool('req', obj);
        var targetValue = AdomJs.getValue(obj);
        var fieldDescription = AdomJs.getFieldDescription(obj);

        if (evenIfEmpty || targetValue != '') {
            if (req) {
                if (targetValue == '') {
                    errorMessage = validateMessages.fieldRequiredMessage;
                    AdomJs.updateValidationResult("<li><span class='fieldName'>'" + fieldDescription + "'</span> is required.</li>", validationResultSelector);
                    hasError = true;
                }
            }

            if (!hasError) {
                var minLen = obj.attr('minLen');
                if (minLen != null) {
                    var minLenInteger = parseInt(minLen);

                    if (targetValue.length < minLenInteger) {

                        errorMessage = validateMessages.minCharsP1 + (minLen - 1).toString() + validateMessages.minCharsP2;
                        hasError = true;
                    }
                }
            }

            if (!hasError) {

                var valUsPhone = AdomJs.getAttributeBool('valUsPhone', obj);

                if (valUsPhone && targetValue.length > 0) {

                    var reformat = AdomJs.getAttributeBool('reformatPhone', obj);

                    var isValid = AdomJs.getPhoneIsValid(targetValue);

                    if (isValid) {

                        if (reformat) {

                            var strippedUsPhone = AdomJs.getStrippedUsPhone(targetValue);

                            var formatted = strippedUsPhone.substring(0, 3) + '-' + strippedUsPhone.substring(3, 6) + '-' + strippedUsPhone.substring(6, 10);
                            obj.val(formatted);
                        }
                    } else {
                        AdomJs.updateValidationResult("<li><span class='fieldName'>'" + fieldDescription + "'</span>" + validateMessages.incorrectPhone + "</li>", validationResultSelector);
                        errorMessage = validateMessages.incorrectPhone;
                        hasError = true;
                    }
                }
            }

            if (!hasError) {

                var valEmail = AdomJs.getAttributeBool('valEmail', obj);

                if (valEmail) {
                    var uid = obj.attr('toid');

                    if (uid != null) {
                        uid = encodeURIComponent(uid);
                    } else {
                        uid = '';
                    }

                    $.ajax({
                        type: "POST",
                        url: "/Controls/ControlsService.asmx/ValidateEmail",
                        data: "{email: '" + encodeURIComponent(targetValue) + "',controlId: '" + encodeURIComponent(obj.attr('id')) + "' }",
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        async: !waitForAjaxCalls,
                        success: function (msg) {
                            if (msg.d.Status.HasProblem) {
                                errorMessage = msg.d.Status.LatestStatusMessage.Message;
                                hasError = true;
                                var valObj = $('#' + msg.d.Entity);

                                AdomJs.setValidationDisplay(hasError, valObj);
                            }
                        },
                        error: function (xhr, status, error) { AdomJs.ajaxFailed(xhr, status, error, 'ValidateEmail'); }
                    });
                }

                if (!hasError) {
                    var valUnique = AdomJs.getAttributeBool('valUnique', obj);
                    var uniqueTypeTag = obj.attr("uniqueTypeTag");

                    if (valUnique && uniqueTypeTag != null && uniqueTypeTag.length > 0) {
                        var uniquetypetag = obj.attr('uniquetypetag');

                        var uid = obj.attr('toid');

                        if (uid != null) {
                            uid = encodeURIComponent(uid);
                        } else {
                            uid = '';
                        }

                        $.ajax({
                            type: "POST",
                            url: "/Controls/ControlsService.asmx/ValidateUnique",
                            data: "{isUniqueTypeConfigTag: '" + uniquetypetag + "', encodedValue: '" + encodeURIComponent(targetValue) + "'," +
                            " controlId: '" + encodeURIComponent(obj.attr('id')) + "', idString: '" + uid + "'}",
                            contentType: "application/json; charset=utf-8",
                            dataType: "json",
                            async: !waitForAjaxCalls,
                            success: function (msg) {
                                if (msg.d.Status.HasProblem) {
                                    errorMessage = msg.d.Status.LatestStatusMessage.Message;
                                    hasError = true;
                                    var valObj = $('#' + msg.d.Entity);

                                    AdomJs.setValidationDisplay(hasError, valObj);
                                }
                            },
                            error: function (xhr, status, error) { AdomJs.ajaxFailed(xhr, status, error, 'ValidateUnique'); }
                        });
                    }
                }
            }

            AdomJs.setValidationDisplay(hasError, obj);
        }

        return !hasError;
    },

    getPosition: function (e) {
        e = e || window.event;
        var cursor = { x: 0, y: 0 };
        if (e.pageX || e.pageY) {
            cursor.x = e.pageX;
            cursor.y = e.pageY;
        } else {
            cursor.x = e.clientX +
            (document.documentElement.scrollLeft ||
            document.body.scrollLeft) -
            document.documentElement.clientLeft;
            cursor.y = e.clientY +
            (document.documentElement.scrollTop ||
            document.body.scrollTop) -
            document.documentElement.clientTop;
        }
        return cursor;
    },

    clearValueAndValidationDisplay: function (obj, disableControl) {
        obj.val('');
        AdomJs.clearValidationDisplay(obj);
        if (disableControl != null && disableControl) {
            obj.prop("disabled", true);
        }
    },

    clearValueOptionsValidationDisplayAndDisable: function (obj) {
        obj.val('');
        AdomJs.clearValidationDisplay(obj);
        obj.empty();
        obj.prop("disabled", true);
        obj.attr('req', false);
    },

    clearValidationDisplay: function (obj) {
        var valIcon = $('#' + obj.attr('id') + 'Icon');
        obj.removeClass('adomError');
        obj.removeClass('adomOk');

        valIcon.removeClass('adomErrorIcon');
        valIcon.removeClass('adomOkIcon');
    },

    setErrorIfEmpty: function (obj) {
        if (obj == null || obj.val().length == 0) {
            var valIcon = $('#' + obj.attr('id') + 'Icon');
            obj.addClass('adomError');
            obj.removeClass('adomOk');

            valIcon.addClass('adomErrorIcon');
            valIcon.removeClass('adomOkIcon');
        }
    },

    setValidationDisplay: function (hasError, obj) {

//        var validationMarkup;
        var valIcon = $('#' + obj.attr('id') + 'Icon');
        var suppressVisuals = (obj.attr('sv') == 't');
//        var suppressHoverVisuals = (obj.attr('shv') == 't');

//        obj.unbind('mouseover');
//        obj.unbind('mousemove');
//        obj.unbind('mouseout');
//
//        valIcon.unbind('mouseover');
//        valIcon.unbind('mousemove');
//        valIcon.unbind('mouseout');

        if (hasError) {

            if (!suppressVisuals) {

                obj.addClass('adomError');
                obj.removeClass('adomOk');

                valIcon.addClass('adomErrorIcon');
                valIcon.removeClass('adomOkIcon');
            }
//            if (!suppressHoverVisuals) {
//                obj.bind("mouseover", { iconClass: 'problemInfoIcon', title: validateMessages.problemFoundTitle, message: errorMessage }, AdomJs.showToolTip);
//                obj.bind("mousemove", AdomJs.moveToolTip);
//                obj.bind("mouseout", AdomJs.killToolTip);
//
//                valIcon.bind("mouseover", { iconClass: 'problemInfoIcon', title: validateMessages.problemFoundTitle, message: errorMessage }, AdomJs.showToolTip);
//                valIcon.bind("mousemove", AdomJs.moveToolTip);
//                valIcon.bind("mouseout", AdomJs.killToolTip);
//            }
        } else {

            if (!suppressVisuals) {
                obj.addClass('adomOk');
                obj.removeClass('adomError');
                valIcon.addClass('adomOkIcon');
                valIcon.removeClass('adomErrorIcon');
            }

//            if (!suppressHoverVisuals) {
//                AdomJs.killToolTip();
//            }
        }

//        $(validationMarkup).insertAfter(obj);

        //        document.getElementById('debugTextarea').value += obj.attr('id') + " = " + errorMessage + "\n";
    },

    ajaxFailed: function (xhr, status, error, errorSource) {
        try {
            $.get(defaults.appRoot + 'adom/track-issue/'
                + 'error-source/' + ((errorSource != null && errorSource.length > 0) ? encodeURIComponent(errorSource) : 'null')
                + '/xhr-status/' + ((xhr != null && xhr.length > 0 && xhr.status != null && xhr.status.length > 0) ? encodeURIComponent(xhr.status) : 'null')
                + '/status/' + ((status != null && status.length > 0) ? encodeURIComponent(status) : 'null')
                + '/error/' + ((error != null && error.length > 0) ? encodeURIComponent(error) : 'null') + '/');
            AdomJs.showMessage2({ success: false, title: defaults.techIssueSupportNotifiedTitle, message: defaults.techIssueSupportNotifiedMessage });
        }
        catch (err) { /* alert(err); */ }
    },

    getPhoneIsValid: function (phoneString) {

        var phoneIsValid = false;

        phoneValString = AdomJs.getStrippedUsPhone(phoneString);

        // IF NOT EXACTLY TEN DIGITS, IT IS INVALID
        if (phoneValString.length == 10) {
            var firstDigit = phoneValString.substring(0, 1);
            // IF IT STARTS WITH '0' OR '1' IT IS INVALID
            if (firstDigit != '0' && firstDigit != '1') {

                var areaCode = phoneValString.substring(0, 3);

                // INVALID AREACODES
                if (areaCode != '900' && areaCode != '976' && areaCode != '555') {

                    phoneIsValid = true;
                }
            }
        }

        return phoneIsValid;
    },

    getStrippedUsPhone: function (phoneString) {

        // DISCARD NON-NUMERIC CHARACTERS
        var strippedUsPhone = phoneString.replace(/[^0-9]/g, '');


        // DISCARD A LEADING '1' FROM NUMBERS ENTERED LIKE 1-800-555-1212
        if (strippedUsPhone.substring(0, 1) == '1') {
            strippedUsPhone = strippedUsPhone.substring(1);
        }

        return strippedUsPhone;
    },

    getAttributeBool: function (attributeName, obj) {

        var attributeBool = false;

        var attributeValue = obj.attr(attributeName);

        if (attributeValue != null && attributeValue == 't') {
            attributeBool = true;
        }

        return attributeBool;
    },

    hide: function (adomOpts) {
        $(adomOpts.targetClass).css({ visibility: 'hidden' });
    },

    show: function (adomOpts) {
        $(adomOpts.targetClass).css({ visibility: 'visible' });
    },

    getURLParameter: function (name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
    },

    getValue: function (obj) {
        if (obj.is('select')) {
            var value = $("option:selected", obj).text();
        } else {
            var value = obj.val();
        }

        return value;
    }
};