//$(".resTable tr:even").addClass('even');  
var AdomMaintTableData = {
    selectedId: '',
    currentUpdateCriteria: null,
    numberMeetingCriteria: 0,
    searchHeight: 0,
    limitedResults: 0,
    tempTarget: null,
    baseIcsLink: ''
};

var PageNotify = {
    single: null
};

var AdomMaintTableJs = {

    sort: function (propertyName, asc) {

        $('#targetCommandHiddenField').val('SORT');
        $('#targetPropertiesHiddenField').val(propertyName + '|' + asc);
        $('#form1').submit();
    },

    refresh: function (key) {

        $('#targetCommandHiddenField').val('REFRESH');
        $('#targetPropertiesHiddenField').val(key);
        $('#form1').submit();
    },

    highlight: function () {

        if ($(this).find(":nth-child(1)").is('td')) {
            $(this).addClass("highlight");
        }
    },

    unHighlight: function () {

        $(this).removeClass("highlight");
    },

    deleteSelected: function (adomOpt) {

        var ids = AdomMaintTableJs.getIds({ target: adomOpt.targetTableId + ' tr.selected' });
        $('#confirmDeleteNumberLabel').html(ids.length.toString());

        AdomMaintTableJs.deleteIds({ ids: ids, postionTarget: adomOpt.postionTarget })

        return false;
    },

    deleteSpecific: function (adomOpt) {

        var ids = new Array();
        ids[0] = adomOpt.targetId;

        AdomMaintTableJs.deleteIds({ ids: ids, postionTarget: adomOpt.postionTarget })

        return false;
    },


    deleteIds: function (adomOpt) {

        $('#confirmDeleteNumberLabel').html(adomOpt.ids.length.toString());

        if (adomOpt.ids.length > 0) {
            $("#confirmDeletePanel").dialog({
                resizable: false,
                height: 140,
                modal: true,
                buttons: {
                    "Delete item(s)": function () {

                        $('#targetCommandHiddenField').val('DELETE');
                        var idsString = AdomMaintTableJs.getAsString(adomOpt.ids);

                        $('#targetPropertiesHiddenField').val(idsString);

                        $('#form1').submit();

                        $(this).dialog("close");
                    },
                    Cancel: function () {
                        $(this).dialog("close");
                    }
                }
            });
        } else {
            AdomJs.showMessage({ iconClass: 'problemInfoIcon', title: 'Nothing selected', message: 'Please select item(s) first', delay: 3000,
                postionTarget: adomOpt.postionTarget, postionPosition: 'topLeft', postionHorzOffset: -20, forceReturn: false
            });
        }

        return false;
    },

    selectAll: function (adomOpt) {
        $(adomOpt.targetId)
        .each(function () {
            if ($(this).find(":nth-child(1)").is('td') && !$(this).hasClass("selected")) {
                $(this).addClass("selected");
            }
        });
    },

    deselectAll: function (adomOpt) {

        $(adomOpt.targetId)
        .each(function () {
            if ($(this).hasClass("selected")) {
                $(this).removeClass("selected");
            }
        });
    },

    click: function (event) {

        if ($(this).find(":nth-child(1)").is('td')) {
            if (event.data.allowMulti == null || !event.data.allowMulti) {
                $(event.data.cssClass).removeClass('selected');
            }

            if ($(this).hasClass("selected")) {
                $(this).removeClass("selected");
            } else {
                $(this).addClass("selected");
            }
        }
    },

    moveSelected: function (adomOpt) {
        var rowCount = $(adomOpt.target + ' tr').length;

        if (rowCount > 0) {
            $(adomOpt.target + ' tr:last').after($(adomOpt.source + ' tr.selected'));
        } else {
            $(adomOpt.target).append($(adomOpt.source + ' tr.selected'));
        }

        $(adomOpt.target + ' tr').removeClass('selected');

        AdomMaintTableJs.reBuildIds({ targetTableId: adomOpt.target, targetHidden: adomOpt.targetHidden });
        AdomMaintTableJs.reBuildIds({ targetTableId: adomOpt.source, targetHidden: adomOpt.sourceHidden });
    },

    moveAll: function (adomOpt) {
        $(adomOpt.target).append($(adomOpt.source + ' tr'));
        $(adomOpt.target + ' tr').removeClass('selected');
        AdomMaintTableJs.reBuildIds({ targetTableId: adomOpt.target, targetHidden: adomOpt.targetHidden });
        AdomMaintTableJs.reBuildIds({ targetTableId: adomOpt.source, targetHidden: adomOpt.sourceHidden });
    },

    reBuildIds: function (adomOpt) {

        var ids = AdomMaintTableJs.getIds({ target: adomOpt.targetTableId + ' tr' });
        var idsString = AdomMaintTableJs.getAsString(ids);

        $(adomOpt.targetHidden).val(idsString);
    },

    getAsString: function (array) {
        var string = '';

        if (array != null) {

            var aLength = array.length;

            for (var i = 0, len = aLength; i < len; ++i) {

                string += array[i] + '|';
            }
        }

        return string;
    },

    getIds: function (adomOpt) {
        var ids = [];

        var index = 0;
        $(adomOpt.target)
        .each(function () {
            var iid = $(this).attr("iid");
            ids[index] = iid;
            index++;
        });

        return ids;
    },

    redirectWithId: function (adomOpt) {

        if (adomOpt.path.length > 0) {

            var selectedId = null;
            var errorCommunicated = false;
            if (adomOpt.idTarget != null) {

                selectedId = $(adomOpt.idTarget).attr("iid");

            } else if (adomOpt.targetTableId != null) {

                var ids = AdomMaintTableJs.getIds({ target: adomOpt.targetTableId + ' tr.selected' });

                if (ids.length == 1) {

                    selectedId = ids[0];

                } else if (ids.length > 1) {
                    errorCommunicated = true;
                    AdomJs.showMessage({ iconClass: 'problemInfoIcon', title: 'Too many selected', message: 'Please limit your selection to one item', delay: 3000,
                        postionTarget: adomOpt.postionTarget, postionPosition: 'topLeft', postionHorzOffset: -20, forceReturn: false
                    });
                }
            }

            if (selectedId != null && selectedId.length > 0) {
                var path = adomOpt.path.replace(new RegExp('{id}', 'g'), selectedId);
                //var path = adomOpt.path.replace(new RegExp('{id}', 'g'), selectedId).replace(new RegExp('\\|', 'g'), '/');

                if (adomOpt.returnPathKey != null && adomOpt.returnPathKey.length > 0 && adomOpt.returnPath != null && adomOpt.returnPath.length > 0) {

                    path = AdomMaintTableJs.buildUrl(path, adomOpt.returnPathKey, adomOpt.returnPath);
                }

                if (adomOpt.newWindow != null && adomOpt.newWindow) {
                    AdomMaintTableJs.openWindowPath(path, null);
                } else {
                    window.location = path;
                }
            } else {

                if (!errorCommunicated) {
                    AdomJs.showMessage({ iconClass: 'problemInfoIcon', title: 'Nothing selected', message: 'Please select an item first', delay: 3000,
                        postionTarget: adomOpt.postionTarget, postionPosition: 'topLeft', postionHorzOffset: -20, forceReturn: false
                    });
                }
            }
        }

        return false;
    },

    redirect: function (path, returnPathKey, returnPath) {
        if (path.length > 0) {

            if (returnPathKey != null && returnPathKey.length > 0 && returnPath != null && returnPath.length > 0) {

                path = AdomMaintTableJs.buildUrl(path, returnPathKey, returnPath);
            }

            window.location = path;
        }

        return false;
    },

    buildUrl: function (path, key, value) {
        if (path.length > 0 && key.length > 0 && key.length > 0) {

            var url = '';

            var index = path.indexOf('?');

            if (index > 0) {
                url = path + '&' + key + '=' + value;
            } else {
                url = path + '?' + key + '=' + value;
            }

            return url;
        }
    },

    setHtml: function (adomOpt) {
        if (adomOpt.targetClass != null && adomOpt.targetClass.length > 0) {

            var target = $(adomOpt.targetClass);

            var newHtml = '';

            if (adomOpt.newHtml != null) {
                newHtml = adomOpt.newHtml;
            }

            target.html(newHtml);

        }
    },

    search: function () {
        var searchHeight = 300;

        if (AdomMaintTableData.searchHeight > 0) {
            searchHeight = AdomMaintTableData.searchHeight;
        }

        $("#searchPanel").dialog({
            resizable: true,
            minWidth: 420,
            height: searchHeight,
            modal: true,
            closeOnEscape: false,
            buttons: {
                "Show These Records": function () {

                    var ready = AdomMaintTableJs.isObjectCriteriaReady(true);
                    if (ready) {
                        if (AdomMaintTableJs.currentUpdateCriteria != null) {
                            $('#targetCommandHiddenField').val('FILTER');
                            $('#targetPropertiesHiddenField').val(AdomMaintTableJs.currentUpdateCriteria[0] + '*|*' +
                        AdomMaintTableJs.currentUpdateCriteria[1] + '*|*' + AdomMaintTableJs.currentUpdateCriteria[2] + '*|*' +
                        AdomMaintTableJs.currentUpdateCriteria[3]);

                            $('#form1').submit();
                        }

                        //                        $(this).dialog("close");
                    }

                },
                Cancel: function () {
                    //                    var ready = AdomMaintTableJs.isObjectCriteriaReady(true);
                    //                    if (ready) {
                    $(this).dialog("close");
                    //                    }
                }
            },
            open: function (event, ui) {
                //AdomMaintTableJs.updateCount();
            }
            //            beforeClose: function (event, ui) {

            //                var ready = AdomMaintTableJs.isObjectCriteriaReady(true);

            //                if (!ready) {
            //                    event.preventDefault();
            //                }
            //            }
        });

        return false;
    },

    updateCount: function () {

        if (typeof valueIdByExpressionIds != 'undefined') {
            var result = '';
            var tags = '';
            var expressionIds = '';
            var statedValues = '';

            for (var tagExpressionId in valueIdByExpressionIds) {
                var tagExpressionIdArray = tagExpressionId.split("|");
                var tag = tagExpressionIdArray[0];
                var expressionId = tagExpressionIdArray[1];
                var selectedExpressionId = $('#' + expressionId).val();
                var valueId = valueIdByExpressionIds[tagExpressionId];
                var sendValue = false;
                var statedValue = '';

                if (valueId.length > 0) {

                    statedValue = $('#' + valueId).val();
                    if (statedValue.length > 0) {
                        sendValue = true;
                    }
                } else {

                    statedValue = 'NULL';
                    sendValue = true;
                }

                if (sendValue) {

                    tags += tag + '|';
                    expressionIds += selectedExpressionId + '|';
                    statedValues += encodeURIComponent(statedValue) + '|';
                    //result += tag + ' - ' + selectedExpressionId + ' - ' + statedValue + '\n';
                }
                //alert(result);
            }

            var updateCriteria = new Array()
            updateCriteria[0] = objectTag;
            updateCriteria[1] = tags;
            updateCriteria[2] = expressionIds;
            updateCriteria[3] = statedValues;

            if (!AdomMaintTableJs.areArraysEqual(updateCriteria, AdomMaintTableJs.currentUpdateCriteria)) {

                AdomMaintTableJs.currentUpdateCriteria = updateCriteria;

                $.ajax({
                    type: "POST",
                    url: "/Controls/ControlsService.asmx/CriteriaCount",
                    data: "{objectTag: '" + objectTag + "', tags: '" + tags + "', expressionIds: '" + expressionIds + "', statedValues: '" + statedValues + "'}",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    async: false,
                    success: function (msg) {
                        AdomMaintTableData.numberMeetingCriteria = msg.d;
                        $('#numberMeetingCriteriaLabel').html(AdomMaintTableJs.addCommas(msg.d));
                        //$('#numberMeetingCriteriaLabel').html(AdomMaintTableJs.addCommas('5000000'));
                        AdomMaintTableJs.assessObjectCounts();
                    },
                    error: function (xhr, status, error) { AdomJs.ajaxFailed(xhr, status, error, 'CriteriaCount') }
                });
            }
        }
    },

    updateCriteriaDescription: function () {

        if (typeof valueIdByExpressionIds != 'undefined') {

            $('#criteriaObjectTitleDescLabel').html(objectTag);
            $('#criteriaObjectDescLabel').html(objectTag);
            $('#criteriaObjectTotalLabel').html(AdomMaintTableJs.addCommas(totalObjectCount));
            $('#criteriaMaxDisplayCountLabel').html(AdomMaintTableJs.addCommas(maxObjectCount));
            var message = '';
            var allCriteria = '';
            var first = true;

            for (var tagExpressionId in valueIdByExpressionIds) {
                var criteria = '';
                var tagExpressionIdArray = tagExpressionId.split("|");
                var expressionId = tagExpressionIdArray[1];
                var selectedExpressionId = $('#' + expressionId).val();
                var valueId = valueIdByExpressionIds[tagExpressionId];
                var sendValue = false;
                var statedValue = '';

                var displayName = $("#" + expressionId.replace('_list', '_label')).html();
                displayName = displayName.replace(':', '');
                //alert(expressionId);

                var expressionText = $("#" + expressionId + " option[value='" + selectedExpressionId + "']").text();

                if (!first) {
                    criteria += ' and ';
                }

                criteria += displayName + ' ' + expressionText;

                var addCriteria = false;

                if (valueId.length > 0) {

                    statedValue = $('#' + valueId).val();

                    if (statedValue.length > 0) {

                        criteria += ' "' + statedValue + '"';
                        addCriteria = true;
                    }
                } else {

                    if (selectedExpressionId.toLowerCase() != 'ade6d31d-7f30-43ea-ad44-061974d418e0') {
                        addCriteria = true;
                    }
                }

                if (addCriteria) {

                    allCriteria += criteria;
                    first = false;
                }
            }

            if (allCriteria.length == 0) {
                allCriteria = "none";
            }

            var message = "Displaying ";

            var numberMeetingCriteria = AdomMaintTableData.numberMeetingCriteria;

            if (AdomMaintTableData.limitedResults > 0) {
                message = "Criteria yeilded too many results displaying top ";
                numberMeetingCriteria = AdomMaintTableData.limitedResults;
            }

            message += AdomMaintTableJs.addCommas(numberMeetingCriteria) +
            ' of ' + AdomMaintTableJs.addCommas(totalObjectCount) + ' / Criteria: ' + allCriteria + ' / <a id="changeCriteria" href="#" onclick="return AdomMaintTableJs.search();">change</a>';

            $('#searchCriteriaPanel').html(message);
        }
    },

    areArraysEqual: function (array1, array2) {
        var equal = true;

        if (array1 == null && array2 == null) {

            // Both Null 
        } else {

            if (array1 != null && array2 != null) {

                equal = array1.length == array2.length; // if array sizes mismatches, then we assume, that they are not equal
                if (equal) {
                    $.each(array1, function (foo, val) {
                        if (!equal) return false;
                        if ($.inArray(val, array2) == -1) {
                            equal = false;
                        } else {
                            equal = true;
                        }
                    });
                }

            } else {

                //One null other is not                
                equal = false;
            }
        }

        return equal;
    },

    addCommas: function (numberString) {
        numberString += '';
        x = numberString.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
    },

    assessObjectCounts: function () {
        if (AdomMaintTableData.numberMeetingCriteria > maxObjectCount) {
            $('#numberMeetingCriteriaLabel').addClass('criteriaObjectNotReady');
        } else {
            $('#numberMeetingCriteriaLabel').removeClass('criteriaObjectNotReady');
        }
    },

    isObjectCriteriaReady: function (showErrorIfNotReady) {
        var isObjectCriteriaReady = false;
        if (AdomMaintTableData.numberMeetingCriteria > maxObjectCount) {
            if (showErrorIfNotReady) {
                AdomJs.showMessage({ iconClass: 'problemInfoIcon', title: 'Too many selected', message: 'Number meeting criteria cannot exceed Max display.<br/> Please add more criteria.',
                    delay: 5000, postionTargetId: 'numberMeetingCriteriaLabel', postionPosition: 'topLeft', postionHorzOffset: -20, forceReturn: false
                });
            }
        } else {
            isObjectCriteriaReady = true;
        }

        return isObjectCriteriaReady;
    },

    sendCommand: function (commandControlName, propertyControlName, command, prop) {

        $('#' + commandControlName).val(command);
        $('#' + propertyControlName).val(prop);
        $('#form1').submit();
    },

    openWindow: function (anchor, options) {
        var path = $(anchor).attr('href');
        return AdomMaintTableJs.openWindowPath(path, options);
    },

    openWindowPath: function (path, options) {
        var args = '';
        var name = '';

        if (options != null) {
            name = options.name;

            if (typeof (options) == 'undefined') { var options = new Object(); }
            if (typeof (options.name) == 'undefined') { options.name = 'win' + Math.round(Math.random() * 100000); }

            if (typeof (options.height) != 'undefined' && typeof (options.fullscreen) == 'undefined') {
                args += "height=" + options.height + ",";
            }

            if (typeof (options.width) != 'undefined' && typeof (options.fullscreen) == 'undefined') {
                args += "width=" + options.width + ",";
            }

            if (typeof (options.fullscreen) != 'undefined') {
                args += "width=" + screen.availWidth + ",";
                args += "height=" + screen.availHeight + ",";
            }

            if (typeof (options.center) == 'undefined') {
                options.x = 0;
                options.y = 0;
                args += "screenx=" + options.x + ",";
                args += "screeny=" + options.y + ",";
                args += "left=" + options.x + ",";
                args += "top=" + options.y + ",";
            }

            if (typeof (options.center) != 'undefined' && typeof (options.fullscreen) == 'undefined') {
                options.y = Math.floor((screen.availHeight - (options.height || screen.height)) / 2) - (screen.height - screen.availHeight);
                options.x = Math.floor((screen.availWidth - (options.width || screen.width)) / 2) - (screen.width - screen.availWidth);
                args += "screenx=" + options.x + ",";
                args += "screeny=" + options.y + ",";
                args += "left=" + options.x + ",";
                args += "top=" + options.y + ",";
            }

            if (typeof (options.scrollbars) != 'undefined') { args += "scrollbars=1,"; }
            if (typeof (options.menubar) != 'undefined') { args += "menubar=1,"; }
            if (typeof (options.locationbar) != 'undefined') { args += "location=1,"; }
            if (typeof (options.resizable) != 'undefined') { args += "resizable=1,"; }
        }

        var win = window.open(path, name, args);

        return false;
    }
};