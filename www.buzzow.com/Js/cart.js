
$(document).ready(function () {
//    buzzowCart.setCart(true);
//    var val = AdomJs.getURLParameter('showCart');
//    if (val != null && val == 't') {
//        buzzowCart.showDomCart();
//    }

    window.addEventListener('keypress', function (event) {
        if (event.which == 102 && event.ctrlKey && event.altKey) { // Ctrl + Alt + f
            buzzowCart.fillForm();
        }
    });
});

/* CartItem */
function CartItem(itemId, productId, quantity) {
    this.itemId = itemId;
    this.productId = productId;
    this.quantity = quantity;
}

/* WribbitCart */
var buzzowCart = {

    cart: null,
    orderKey: null,
    baseUrl: "/",

    getButtonContainer: function () {
        return $('<div class="buttonContainer"></div>').empty()
		.append($('<a class="continueButton" href="." onclick="$(\'a.close\').click(); return false;"></a>'))
		.append($('<div id="cart_ssl"></div>'))
		.append($('<a class="checkoutButton" href="." onclick="buzzowCart.goToGoogleCheckout(); return false;"></a>'));
    },

    buildCheckoutOptions: function () {
        $('#cartDetails div.content_wrap').empty().append($('<div class="lil_wrib"></div>')).append($('<div id="checkoutIssue" /><div id="checkoutButtonContainer" /><div id="checkoutInfo">' + this.getCheckoutInfo() + '</div>'));
        $('#checkoutButtonContainer').append($('<h1>Click to select a secure payment option:</h1>'))
		.append($('<a id="cardCheckoutButton" href="' + this.baseUrl + '/checkout?cardApprove=t" />'))
		.append($('<div id="clearChoice"> -or use- </div>'))
		.append($('<a id="googleCheckoutButton" href="." onclick="buzzowCart.goToGoogleCheckout(); return false;" />'));
    },

    getCheckoutInfo: function () {
        return '<img src="http://frogstatic.com/img/ssl_lock.png" />'
				+ 'Upon selecting a payment option you will be transfered to a <strong>Secure Sockets Layer (SSL)</strong> 256-bit AES encrypted payment page. '
				+ 'SSL proctects confidential information using cryptography. Sensitive data is encrypted across public networks to protect your identity. '
				+ 'We <span class="underline">never store your credit card data</span> in our database or in our records. '
				+ 'If you have questions or concerns please call us at (855) 974-2248.';
    },

    goToGoogleCheckout: function () {
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: this.baseUrl + '/rest/cart/go-to-google-checkout',
            success: function (data, textStatus) {
                if (data.redirect != null) {
                    document.location = data.redirect;
                } else if (data.message != null) {
                    $('#checkoutIssue').empty().append(data.message);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {

            }
        });
    },

    buildDomCart: function () {
        var cartItemCount = 0;
        if (this.cart != null && this.cart.ItemCount > 0) {
            cartItemCount = this.cart.ItemCount;

            //build the cart table
            $('#cartDetails div.content_wrap').html('').append($('<div class="lil_wrib"></div>'));
            var cartTable = $('<table class="borderedTable"></table>');
            $(cartTable).append('<tr class="heading"><td>Item</td><td align="right">Details</td></tr>');

            for (var i = 0; i < $(this.cart.CartItems).length; i++) {
                var cartItem = $(this.cart.CartItems)[i];
                //this.checkQuantityShort(cartItem);
                $(cartTable).append(this.buildCartRow(cartItem));
            }

            $(cartTable).append('<tr><td align="right" colspan="2">' +
			'<table id="cartSummary">' +
			'<tr><td align="right">Subtotal:</td><td align="right" class="money">$' + parseFloat(this.cart.SubTotal).formatMoney(2, '.', ',') + '</td></tr>' +
			'<tr><td align="right">Shipping:</td><td align="right" class="money">$' + parseFloat(this.cart.ShippingTotal).formatMoney(2, '.', ',') + '</td></tr>' +
			'<tr><td align="right">Tax:</td><td align="right" class="money">$' + parseFloat(this.cart.TaxTotal).formatMoney(2, '.', ',') + '</td></tr>' +
			'<tr><td align="right">Grand Total:</td><td align="right" class="money">$' + parseFloat(this.cart.GrandTotal).formatMoney(2, '.', ',') + '</td></tr>' +
			'</table>' +
			'</td></tr><tr><td colspan="2"><div id="cartButtons"><a href="/checkout?cardApprove=t">checkout</a><a href="#" onclick="return AdomJs.closeModal(\'#cartDetails\')">cancel</a></div></td></tr></table>');

            //insert the table into the dom
            $('#cartDetails div.content_wrap').append(cartTable, this.getButtonContainer()).css('padding', '0');
        } else {
            $('#cart a span').css('display', 'none').html('');
            $('#cartDetails div.content_wrap').html('').append($('<div class="lil_wrib"></div><h3>Your Shopping Cart is currently empty.</h3>'), this.getButtonContainer());
        }

        $('#cartLink').html('cart items: ' + cartItemCount);
    },

    showDomCart: function () {
        $("#cartDetails").data("overlay").load();
        return false;
    },

    checkQuantityShort: function (cartItem) {

        if (cartItem.QuantityShort > 0) {
            if (cartItem.QuantityAvailable > 0) {
                alert(cartItem.Name + " is only available in a quantity of " + cartItem.QuantityAvailable + ".");
            } else {
                alert(cartItem.Name + " is no longer available.");
            }

            this.updateItem(new CartItem(cartItem.ItemId, cartItem.ProductId, (cartItem.QuantityShort * -1)));
        }

        return false;
    },

    buildCartRow: function (cartItem) {
        var itemRow = '<tr>';
        itemRow += '<td class="img">';
        itemRow += '<a href="/p/' + cartItem.ProductUrl + '/"><img src="' + cartItem.ImagePath + '" height="100" /></a>';
        itemRow += '</td>';
        itemRow += '<td align="right" class="detail">';
        itemRow += '<strong>' + cartItem.Quantity + '</strong> <a href="/p/' + cartItem.ProductUrl + '/">' + cartItem.Name + '</a><br />';
        itemRow += '$' + parseFloat(cartItem.Quantity * (cartItem.InitialPerItemPrice + cartItem.MonthlyPerItemPrice)).formatMoney(2, '.', ',') + '<br />';

        if (cartItem.Quantity < cartItem.QuantityAvailable) {
            itemRow += '<a href="#" onclick="return buzzowCart.updateItem(\'' + cartItem.ProductId + '\', \'' + cartItem.ItemId + '\', 1);" class="cartChanger">increase quantity <font class="fixed">(+)</font></a><br />';
        }

        if (cartItem.Quantity > 1) {
            itemRow += '<a href="#" onclick="return buzzowCart.updateItem(\'' + cartItem.ProductId + '\', \'' + cartItem.ItemId + '\', -1);" class="cartChanger decrease">decrease quantity <font class="fixed">(-)</font></a><br />';
        }

        itemRow += '<a href="#" onclick="return buzzowCart.updateItem(\'' + cartItem.ProductId + '\', \'' + cartItem.ItemId + '\', -' + cartItem.Quantity + ');" class="cartChanger remove">remove this item <font class="fixed">(X)</font></a><br />';
        itemRow += '</td>';
        itemRow += '</tr>';
        return itemRow;
    },

    setCart: function (async) {
        $.ajax({
            type: "GET",
            url: "/buzzow/cart/get-cart",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: async,
            success: function (msg) {
                buzzowCart.setCartDisplay(msg);
                buzzowCart.buildDomCart();
            },
            error: function (xhr, status, error) { AdomJs.ajaxFailed(xhr, status, error, 'getCart'); }
        });
    },

    checkoutItem: function (productId, itemId) {
        $.ajax({
            type: "POST",
            url: "/buzzow/cart/checkout-item/product/" + productId + "/item/" + itemId + "/",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: true,
            success: function (msg) {
                if (msg != null) {
                    if (msg.Success) {
                        window.location = "/checkout?cardApprove=t";
                    } else {
                        AdomJs.showMessage2({ success: false, title: "Problem!", message: msg.Message });
                    }
                } else {
                    AdomJs.showMessage2({ success: false, title: defaults.techIssueSupportNotifiedTitle, message: defaults.techIssueSupportNotifiedMessage });
                }

            },
            error: function (xhr, status, error) { AdomJs.ajaxFailed(xhr, status, error, 'checkoutItem'); }
        });

        return false;
    },

    updateItem: function (productId, itemId, increment) {
        $.ajax({
            type: "POST",
            url: "/buzzow/cart/update-item/product/" + productId + "/item/" + itemId + "/increment/" + increment + "/",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: true,
            success: function (msg) {
                if (msg != null && msg.WebStatus != null) {
                    if (msg.WebStatus.Success) {
                        buzzowCart.cart = msg.WebCart;
                        buzzowCart.buildDomCart();
                        //AdomJs.showMessage2({ success: true, title: "Success!", message: msg.Message });
                    } else {
                        AdomJs.showMessage2({ success: false, title: "Problem!", message: msg.Message });
                    }
                } else {
                    AdomJs.showMessage2({ success: false, title: defaults.techIssueSupportNotifiedTitle, message: defaults.techIssueSupportNotifiedMessage });
                }

            },
            error: function (xhr, status, error) { AdomJs.ajaxFailed(xhr, status, error, 'updateItem'); }
        });

        return false;
    },

    calculateTaxME: function () {
        var tax = parseFloat(this.cart.SubTotal * 0.05);
        var grandTotal = parseFloat($('#grandtotal').html().replace('$', '')) + tax;
        tax = '$' + tax.formatMoney(2, '.', ',');
        grandTotal = '$' + grandTotal.formatMoney(2, '.', ',');
        $('#taxsum').html(tax);
        $('#grandtotal').html(grandTotal);
        alert('Maine State retail tax of ' + tax + " has been applied to the order.");
    },

    getCurrentQuantity: function (cartItem) {
        var qt = 0;

        if (this.cart != null
    			&& this.cart.CartItems != null) {
            $(this.cart.CartItems).each(function (index, ci) {
                if (cartItem.ItemId == ci.ItemId) {
                    qt = ci.quantity;
                }
            });
        }

        return parseInt(qt);
    },

    fillForm: function () {
        var isCheckoutPage = (window.location.pathname.indexOf('/checkout') >= 0);

        if (isCheckoutPage) {
            $("#firstNameTextBox_textBox").val('Billy');
            $("#lastNameTextBox_textBox").val('Smith');
            $("#phoneTextBox_textBox").val('815-272-5987');
            $("#emailTextBox_textBox").val('oryan@adomsi.com');
            $("#cardFirstNameTextBox_textBox").val('Billy');
            $("#cardLastNameTextBox_textBox").val('Smith');
            $("#cardNumberTextBox_textBox").val('4111-1111-1111-1111');
            $("#cvv2TextBox_textBox").val('123');
            $("#cardExpiresMonthDropDownList_list").val('3').change();
            $("#cardExpirationYearDropDownList_list").val('2015').change();
            $("#addressLine1TextBox_textBox").val('123 Main St');
            $("#addressLine2TextBox_textBox").val('Apt B1');
            $("#cityTextBox_textBox").val('Oswego');
            $("#stateDropDownList_list").val('IL').change();
            $("#zipCodeTextBox_textBox").val('60543');
            $("#zipPlus4TextBox_textBox").val('1234');
            $("#inmateFirstNameTextBox_textBox").val('Becky');
            $("#inmateLastNameTextBox_textBox").val('Smith');
            $("#inmateNumberTextBox_textBox").val('76764545');
            $("#institutionNameTextBox_textBox").val('JO County Female Detention Center');
            $("#institutionPhoneTextBox_textBox").val('8452215544');
            $("#institutionTypeDropDownList_list").val('COUNTY').change();
            $("#institutionAddressTextBox_textBox").val('123 Main St');
            $("#institutionCityTextBox_textBox").val('Oswego');
            $("#institutionCountyTextBox_textBox").val('Kendall');
            $("#institutionStateDropDownList_list").val('IL').change();
            $("#institutionZipCodeTextBox_textBox").val('60543');
            $("#institutionZipPlus4TextBox_textBox").val('9000');
            $('#mainSiteDiv').slidinglabels();
        }
    },

    completeSignup: function () {
        var subject = $('#institutionTypeDropDownList_list').val();

        var countyRequiredVal = 'f';
        if (subject == "COUNTY") {
            countyRequiredVal = 't';
        }
        $("#institutionCountyTextBox_textBox").attr('req', countyRequiredVal);

        var valid = AdomJs.validateAllControls2({ targetSelector: "#inmateDetailsPanel", evenIfEmpty: true, waitForAjaxCalls: true, validationResultSelector: ".formErrorPanel" });

        if (valid) {
            AdomJs.showWaiting();
            $.ajax({
                type: "GET",
                url: "/buzzow/CompleteSignup",
                data: {
                    orderKey: buzzowCart.orderKey,
                    inmateFirstName: encodeURIComponent($("#inmateFirstNameTextBox_textBox").val()),
                    inmateLastName: encodeURIComponent($("#inmateLastNameTextBox_textBox").val()),
                    inmateNumber: encodeURIComponent($("#inmateNumberTextBox_textBox").val()),
                    institutionName: encodeURIComponent($("#institutionNameTextBox_textBox").val()),
                    institutionPhone: encodeURIComponent($("#institutionPhoneTextBox_textBox").val()),
                    institutionType: encodeURIComponent($("#institutionTypeDropDownList_list").val()),
                    institutionAddress1: encodeURIComponent($("#institutionAddressTextBox_textBox").val()),
                    institutionCity: encodeURIComponent($("#institutionCityTextBox_textBox").val()),
                    institutionCounty: encodeURIComponent($("#institutionCountyTextBox_textBox").val()),
                    institutionState: encodeURIComponent($("#institutionStateDropDownList_list").val()),
                    institutionZipCode: encodeURIComponent($("#institutionZipCodeTextBox_textBox").val()),
                    institutionZipPlus4: encodeURIComponent($("#institutionZipPlus4TextBox_textBox").val()),
                },
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                async: true,
                success: function (msg) {
                    if (msg.Success) {
                        buzzowCart.showNextSteps();
                        AdomJs.hideWaiting();
                    } else {
                        AdomJs.showMessage2({ success: false, title: "Problem!", message: msg.Message });
                    }
                },
                error: function (xhr, status, error) { AdomJs.ajaxFailed(xhr, status, error, 'completeSignup'); }
            });
        }
        
        return false;
    },

    authPurchase: function () {
        var valid = AdomJs.validateAllControls2({ targetSelector: "#cardInfoPanel", evenIfEmpty: true, waitForAjaxCalls: true, validationResultSelector: ".formErrorPanel" });

        if (valid) {
            var byPassApprove = AdomJs.getURLParameter("cardApprove") == 't';
            var byPassDeny = AdomJs.getURLParameter("cardDeny") == 't';

            AdomJs.showWaiting();
            $.ajax({
                type: "GET",
                url: "/buzzow/ProcessOrder",
                data: {
                    byPassApprove: byPassApprove,
                    byPassDeny: byPassDeny,
                    userCommittedAmount: encodeURIComponent($("#checkoutAmountHidden").val()),
                    firstName: encodeURIComponent($("#firstNameTextBox_textBox").val()),
                    lastName: encodeURIComponent($("#lastNameTextBox_textBox").val()),
                    phone: encodeURIComponent($("#phoneTextBox_textBox").val()),
                    email: encodeURIComponent($("#emailTextBox_textBox").val()),
                    cardFirstName: encodeURIComponent($("#cardFirstNameTextBox_textBox").val()),
                    cardLastName: encodeURIComponent($("#cardLastNameTextBox_textBox").val()),
                    cardNumber: encodeURIComponent($("#cardNumberTextBox_textBox").val()),
                    cvv2: encodeURIComponent($("#cvv2TextBox_textBox").val()),
                    cardExpiresMonth: encodeURIComponent($("#cardExpiresMonthDropDownList_list").val()),
                    cardExpirationYear: encodeURIComponent($("#cardExpirationYearDropDownList_list").val()),
                    addressLine1: encodeURIComponent($("#addressLine1TextBox_textBox").val()),
                    addressLine2: encodeURIComponent($("#addressLine2TextBox_textBox").val()),
                    city: encodeURIComponent($("#cityTextBox_textBox").val()),
                    state: encodeURIComponent($("#stateDropDownList_list").val()),
                    zipCode: encodeURIComponent($("#zipCodeTextBox_textBox").val()),
                    zipPlus4: encodeURIComponent($("#zipPlus4TextBox_textBox").val())
                },
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                async: true,
                success: function (msg) {
                    if (msg.Approved) {
                        buzzowCart.showInmateDetails();
                        buzzowCart.orderKey = msg.OrderKey;
                        
                        if (msg.TransactionId != null && msg.SubTotal > 0) {

                            var pageTracker = _gat._getTracker("UA-44008305-1");
                            pageTracker._trackPageview();
                            pageTracker._addTrans(
                                  msg.TransactionId, // transaction ID
                                  msg.SubTotal,      // total - required
                                  msg.Tax,           // tax
                                  msg.Shipping,      // shipping
                                  msg.City,          // city
                                  msg.State,         // state or province
                                  msg.Country        // country
                              );

                            $(msg.CartItems).each(function (index, ci) {
                                pageTracker._addItem(
                                  msg.TransactionId, // transaction ID - required
                                  ci.Sku,            // SKU/code - required
                                  ci.Name,           // product name
                                  ci.InitialPerItemPrice + ci.MonthlyPerItemPrice,   // unit price - required
                                  ci.Quantity        // quantity - required
                                );
                            });
                        }

                        AdomJs.showMessage2({ success: true, title: "Success!", message: msg.Message });
                    } else if (msg.ApprovedAmountDiffersFromCartAmount) {
                        buzzowCart.setCart(false);
                        AdomJs.showMessage2({ success: false, title: "Problem!", message: msg.Message });
                    } else {
                        AdomJs.showMessage2({ success: false, title: "Problem!", message: msg.Message });
                    }
                },
                error: function (xhr, status, error) { AdomJs.ajaxFailed(xhr, status, error, 'authPurchase'); }
            });
        }
        
        return false;
    },

    showInmateDetails: function () {
        $('#purchasePanel').hide();
        $('#nextStepsPanel').hide();
        $('#inmateDetailsPanel').show();
        $('#inmateDetailPanel').show();
        $('#inmateDetailPanel').slidinglabels();
        $('.watermark').show();
    },

    showNextSteps: function () {
        $('#purchasePanel').hide();
        $('#inmateDetailsPanel').hide();
        $('.watermark').hide();
        $('#nextStepsPanel').show();
    },

    institutionTypeChange: function () {
        var subject = $('#institutionTypeDropDownList_list').val();

        if (subject == "COUNTY") {
            $('#institutionCountyTextBox_panel').show();
            $('#inmateDetailPanel').slidinglabels();
        } else {
            $('#institutionCountyTextBox_panel').hide();
        }

        return false;
    },

    checkoutInit: function () {
        buzzowCart.setCart(true);
        $('#useDiffNameCheckBox').prop('checked', false);
        buzzowCart.useDiffNameCheckBoxChanged();
        $('#useDiffNameCheckBox').change(function () { buzzowCart.useDiffNameCheckBoxChanged(); });
        $('#firstNameTextBox_textBox').change(function () { buzzowCart.myNameChanged(); });
        $('#lastNameTextBox_textBox').change(function () { buzzowCart.myNameChanged(); });

        var val = AdomJs.getURLParameter('sp');

        if (val != null) {
            if (val == 'id') {
                buzzowCart.showInmateDetails();
            }
            if (val == 'ns') {
                buzzowCart.showNextSteps();
            }
        }

        return false;
    },

    myNameChanged: function () {
        var checked = $('#useDiffNameCheckBox').is(':checked');
        if (!checked) {
            $("#cardFirstNameTextBox_textBox").val($('#firstNameTextBox_textBox').val());
            $("#cardLastNameTextBox_textBox").val($('#lastNameTextBox_textBox').val());
            jQuery('#form1').slidinglabels();
        }
    },

    useDiffNameCheckBoxChanged: function () {
        var checked = $('#useDiffNameCheckBox').is(':checked');
        $("#cardFirstNameTextBox_textBox").attr("disabled", !checked);
        $("#cardLastNameTextBox_textBox").attr("disabled", !checked);
        var cardNamesRequiredVal = 'f';
        if (checked) {
            $("#cardFirstNameTextBox_textBox").val('');
            $("#cardLastNameTextBox_textBox").val('');
            cardNamesRequiredVal = 't';
        } else {
            buzzowCart.myNameChanged();
        }

        $("#cardFirstNameTextBox_textBox").attr('req', cardNamesRequiredVal);
        $("#cardLastNameTextBox_textBox").attr('req', cardNamesRequiredVal);
        AdomJs.clearValidationDisplay($("#cardFirstNameTextBox_textBox"));
        AdomJs.clearValidationDisplay($("#cardLastNameTextBox_textBox"));

        return false;
    },

    applyCouponCode: function () {
        if (buzzowCart.cart != null) {
            var couponCode = $("#couponCodeTextBox_textBox").val();
            
            if (couponCode == null || couponCode.length == 0) {
                buzzowCart.removeCoupon();
            } else {
                buzzowCart.setCouponCode(couponCode);
            }
        }

        return false;
    },

    setCouponCode: function (couponCode) {
        AdomJs.showWaiting();
        $.ajax({
            type: "POST",
            url: "/buzzow/cart/apply-coupon/code/" + couponCode + "/",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: true,
            success: function (msg) {
                if (msg != null) {
                    if (msg.WebCart != null) {
                        buzzowCart.setCartDisplay(msg.WebCart);
                    }

                    if (msg.WebStatus != null && msg.WebStatus.Success) {
                        if (msg.CouponWebStatus != null && !msg.CouponWebStatus.Success) {
                            AdomJs.showMessage2({ success: false, title: "Problem!", message: msg.CouponWebStatus.Message });
                        } else {
                            AdomJs.hideWaiting();
                        }
                    } else {
                        AdomJs.showMessage2({ success: false, title: "Problem!", message: msg.WebStatus.Message });
                    }
                } else {
                    AdomJs.showMessage2({ success: false, title: defaults.techIssueSupportNotifiedTitle, message: defaults.techIssueSupportNotifiedMessage });
                }

            },
            error: function (xhr, status, error) { AdomJs.ajaxFailed(xhr, status, error, 'setCouponCode'); }
        });
    },

    setCartDisplay: function (webCart) {
        if (webCart != null) {
            buzzowCart.cart = webCart;
            
            $('#checkoutDesc').html(buzzowCart.cart.TotalDescription);

            $('#checkoutAmountDesc').html(buzzowCart.cart.TotalAmountDesc);
            $('#checkoutAmount').html('$' + parseFloat(buzzowCart.cart.GrandTotal).formatMoney(2, '.', ','));
            $('#checkoutAmountHidden').val(parseFloat(buzzowCart.cart.GrandTotal));

            if (buzzowCart.cart.IsDiscounted) {
                $('#discountedCheckoutDesc').html(buzzowCart.cart.DiscountedTotalDescription);
                $('#discountedCheckoutAmountDesc').html(buzzowCart.cart.DiscountedTotalAmountDesc);
                $('#discountedCheckoutAmount').html('$' + parseFloat(buzzowCart.cart.DiscountedGrandTotal).formatMoney(2, '.', ','));
                $('#checkoutMonthlyAmountAfterDiscountDesc').html(buzzowCart.cart.CheckoutMonthlyAmountAfterDiscountDesc);
                $('#checkoutAmountHidden').val(parseFloat(buzzowCart.cart.DiscountedGrandTotal));
                
                $('#checkoutAmount').addClass('strikePrice');
                $('#checkoutAmountPanel .totalValue').addClass('strikePrice');
                $('#checkoutTotalPanel').addClass('discounted');
                
            } else {
                $('#checkoutAmount').removeClass('strikePrice');
                $('#checkoutAmountPanel .totalValue').removeClass('strikePrice');
                $('#checkoutTotalPanel').removeClass('discounted');
                $('#discountedCheckoutDesc').html('');
                $('#discountedCheckoutAmountDesc').html('');
                $('#discountedCheckoutAmount').html('');
                $('#checkoutMonthlyAmountAfterDiscountDesc').html('');
            }

            if (buzzowCart.cart.HasRecurringCharges) {
                $('#recurringChargePanel').show();
            } else {
                $('#recurringChargePanel').hide();
            }

            var couponCode = "";

            if (buzzowCart.cart.CouponCode != null) {
                couponCode = buzzowCart.cart.CouponCode;
            }
            $('#couponCodeTextBox_textBox').val(couponCode);

            $('#purchasePanel').slidinglabels();
        }
    },

    removeCoupon: function () {
        AdomJs.showWaiting();
        $.ajax({
            type: "POST",
            url: "/buzzow/cart/remove-coupon/",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: true,
            success: function (msg) {
                if (msg != null) {
                    buzzowCart.setCartDisplay(msg.WebCart);
                    if (msg.WebStatus != null && msg.WebStatus.Success) {
                        AdomJs.hideWaiting();
                    } else {
                        AdomJs.showMessage2({ success: false, title: "Problem!", message: msg.WebStatus.Message });
                    }
                } else {
                    AdomJs.showMessage2({ success: false, title: defaults.techIssueSupportNotifiedTitle, message: defaults.techIssueSupportNotifiedMessage });
                }

            },
            error: function (xhr, status, error) { AdomJs.ajaxFailed(xhr, status, error, 'removeCoupon'); }
        });
    }

};

