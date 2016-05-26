jQuery(function () {
    function fullsize() {
        var maxHeight = 700;
        var height = jQuery(window).height();

        if (height > 700) {
            height = 700;
        }

        jQuery('.topSection').css({
            height: height
        });
    }

    jQuery(window).resize(function () {
        fullsize();
    });
    fullsize();
});
jQuery("input,select").focus(function () {
    jQuery(this).prev('.errorname').css({'top': '-26px', 'color': '#fff'})
})
jQuery(".slidingLabel").each(function () {
    if (jQuery(this).find("input,select").val().trim().length == 0) {
        jQuery(this).find('.errorname').css({'top': '7px', 'color': '#333'})
    }
    else {
        jQuery(this).find('.errorname').css({'top': '-26px', 'color': '#fff'})
    }
});

jQuery(".slidingLabel").click(function () {
    jQuery(this).find('.errorname').css({'top': '-26px', 'color': '#fff'})
    jQuery(this).find("input").focus();

});
jQuery("input").focusout(function () {
    if (jQuery(this).val().trim().length == 0)
        jQuery(this).prev('.errorname').css({'top': '7px', 'color': '#333'})
})
jQuery("select").focusout(function () {
    if (jQuery(this).val().trim().length == 0)
        jQuery(this).prev('.errorname').css({'top': '7px', 'color': '#333'})
})
function isValidLfsn(lfsn) {
    return /^[0-9]{4}$/.test(lfsn);
}

function isValidUSZip(sZip) {
    return /^\d{5}(-\d{4})?$/.test(sZip);
}
function isValidEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
function allLetter(inputtxt) {
    if (inputtxt.length == 0)
        return false;
    var letters = /^[A-Za-z]+$/;

    return /^[A-Za-z]+$/.test(inputtxt);
}
function validateForm() {
    var x = document.forms["zipform"]["zip"].value;
    if (x.trim() == null || x.trim() == "") {
        jQuery("input").addClass('errorLabel');
        jQuery("label").addClass('errorLabel1');
        return false;
    } else if (!isValidUSZip(x)) {
        jQuery("input").addClass('errorLabel');
        jQuery("label").addClass('errorLabel1');
        return false;
    } else {
        return true;
    }
}


function validateForm2() {
    var error = 0;
    var check1 = check2 = check3 = check4 = check5 = true;
    var x1 = document.forms["detailform"]["amount"];
    var x2 = document.forms["detailform"]["fname"];
    var x3 = document.forms["detailform"]["lname"];
    var x4 = document.forms["detailform"]["email"];
    var x5 = document.forms["detailform"]["lfssn"];

    if (x1.value.trim() == null || x1.value.trim() == "") {
        jQuery(x1).addClass('errorLabel');
        jQuery(x1).prev().addClass('errorLabel1');
        error++;
    } else {
        jQuery(x1).removeClass('errorLabel');
        jQuery(x1).prev().removeClass('errorLabel1');
    }

    if (!allLetter(x2.value.trim())) {
        jQuery(x2).addClass('errorLabel');
        jQuery(x2).prev().addClass('errorLabel1');
        error++;
    } else {
        jQuery(x2).removeClass('errorLabel');
        jQuery(x2).prev().removeClass('errorLabel1');
    }

    if (!allLetter(x3.value.trim())) {
        jQuery(x3).addClass('errorLabel');
        jQuery(x3).prev().addClass('errorLabel1');
        error++;
    } else {
        jQuery(x3).removeClass('errorLabel');
        jQuery(x3).prev().removeClass('errorLabel1');
    }

    if (!isValidEmail(x4.value.trim())) {
        jQuery(x4).addClass('errorLabel');
        jQuery(x4).prev().addClass('errorLabel1');
        error++;
    } else {
        jQuery(x4).removeClass('errorLabel');
        jQuery(x4).prev().removeClass('errorLabel1');
    }

    if (!isValidLfsn(x5.value.trim())) {
        jQuery(x5).addClass('errorLabel');
        jQuery(x5).prev().addClass('errorLabel1');
        error++;
    } else {
        jQuery(x5).removeClass('errorLabel');
        jQuery(x5).prev().removeClass('errorLabel1');
    }

    if ($('input.chkbox1').is(':checked')) {
        jQuery('.chckBoxValidate').removeClass('errorLabel');
    } else {
        jQuery('.chckBoxValidate').addClass('errorLabel');
        error++;

    }

    if (error > 0) {
        return false;
    } else {
        return true;
    }
}