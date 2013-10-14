var AdomLogin = {
    changePasswordToken : null,
    loginUser: function () {
        var valid = AdomJs.validateAllControls2({ evenIfEmpty: true, waitForAjaxCalls: true, validationResultSelector: ".formErrorPanel" });
        if (valid) {
            AdomJs.showWaiting();
            $.ajax({
                type: "POST",
                url: "/login/login-user/user-name/" + encodeURIComponent($("#userNameTextBox_textBox").val()) +
                    "/password/" + encodeURIComponent($("#passwordTextBox_textBox").val()) +
                    "/gmt-offset/" + -((new Date).getTimezoneOffset() / 60),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                async: true,
                success: function (msg) {
                    if (msg.Success) {
                        var redirect = AdomJs.getURLParameter("rp");
                        window.location = (redirect != null && redirect.length > 0) ? redirect : '/';
                        
                    } else {
                        AdomJs.showMessage2({ success: false, title: "Problem!", message: msg.Message });
                    }
                },
                error: function (xhr, status, error) { AdomJs.ajaxFailed(xhr, status, error, 'loginUser'); }
            });
        }
        return false;
    },

    logoutUser: function (resultContainerSelector) {
        AdomJs.showWaiting();
        $.ajax({
            type: "POST",
            url: "/login/logout-user",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: true,
            success: function (msg) {
                if (msg.Success) {
                    $(resultContainerSelector).html(msg.Message);
                    AdomJs.hideWaiting();
                } else {
                    AdomJs.showMessage2({ success: false, title: "Problem!", message: msg.Message });
                }
            },
            error: function (xhr, status, error) { AdomJs.ajaxFailed(xhr, status, error, 'logoutUser'); }
        });

        return false;
    },

    recoverUserName: function () {
        var valid = AdomJs.validateAllControls2({ evenIfEmpty: true, waitForAjaxCalls: true, validationResultSelector: ".formErrorPanel" });
        if (valid) {
            AdomJs.showWaiting();
            $.ajax({
                type: "POST",
                url: "/login/recover-user-name/email/" + encodeURIComponent($("#emailTextBox_textBox").val()) + "/",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                async: true,
                success: function (msg) {
                    AdomJs.showMessage2({ success: msg.Success, title: (msg.Success) ? "Success!" : "Problem!", message: msg.Message });
                    if (msg.Success) {
                        $("#emailTextBox_textBox").val('');
                        $('#forgotUserNameFormTable').slidinglabels();
                    }
                },
                error: function(xhr, status, error) {
                     AdomJs.ajaxFailed(xhr, status, error, 'recoverUserName');
                }
            });
        }
        return false;
    },

    recoverPassword: function () {
        var valid = AdomJs.validateAllControls2({ evenIfEmpty: true, waitForAjaxCalls: true, validationResultSelector: ".formErrorPanel" });
        if (valid) {
            AdomJs.showWaiting();
            $.ajax({
                type: "POST",
                url: "/login/start-password-recovery/user-name/" + encodeURIComponent($("#userNameTextBox_textBox").val()) + "/",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                async: true,
                success: function (msg) {
                    AdomJs.showMessage2({ success: msg.Success, title: (msg.Success) ? "Success!" : "Problem!", message: msg.Message });
                    if (msg.Success) {
                        $("#userNameTextBox_textBox").val('');
                        $('#forgotPasswordFormTable').slidinglabels();
                    }
                },
                error: function(xhr, status, error) {
                    AdomJs.ajaxFailed(xhr, status, error, 'recoverPassword');
                }
            });
        }
        return false;
    },
    
    changePassword: function () {
        var newPasswordTextBox = $("#newPasswordTextBox_textBox");
        var confirmPasswordTextBox = $("#confirmNewPasswordTextBox_textBox");
        var userNameTextBox = $("#userNameTextBox_textBox");
        var valid = AdomJs.validateAllControls2({ evenIfEmpty: true, waitForAjaxCalls: true, validationResultSelector: ".formErrorPanel" });
        if (valid) {
            valid = (newPasswordTextBox.val() == confirmPasswordTextBox.val());
            
            if (!valid) {
                AdomJs.updateValidationResult("Passwords do not match.", ".formErrorPanel");
            }
            AdomJs.setValidationDisplay(!valid, newPasswordTextBox);
            AdomJs.setValidationDisplay(!valid, confirmPasswordTextBox);

        }
        if (valid) {
            AdomJs.showWaiting();
            $.ajax({
                type: "POST",
                url: "/login/change-password/"
                    + "token/" + ((AdomLogin.changePasswordToken != null) ? AdomLogin.changePasswordToken : "null") + "/"
                    + "user-name/" + encodeURIComponent(userNameTextBox.val()) + "/"
                    + "password/" + encodeURIComponent(confirmPasswordTextBox.val()) + "/",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                async: true,
                success: function (msg) {
                    AdomJs.showMessage2({ success: msg.Success, title: (msg.Success) ? "Success!" : "Problem!", message: msg.Message });

                    if (msg.Success) {
                        userNameTextBox.val('');
                        newPasswordTextBox.val('');
                        confirmPasswordTextBox.val('');
                        $('#changePasswordForm').slidinglabels();
                    }
                },
                error: function (xhr, status, error) {
                    AdomJs.ajaxFailed(xhr, status, error, 'recoverPassword');
                }
            });
        }
        return false;
    }

};