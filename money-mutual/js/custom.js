jQuery(function() {

    function fullsize() {

        jQuery('.topSection').css({
            //width: jQuery(window).width(),
            height: jQuery(window).height()
        });

    }

    jQuery(window).resize(function() {
        fullsize();         
    });

    fullsize();

});