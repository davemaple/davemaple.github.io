var buzzow = {

    init: function () {
        buzzow.setMessageModal();
        buzzow.setNavLinks();
        return false;
    },

    setMessageModal: function () {
        $(".messageModal").overlay({
            top: 0,
            mask: {
                color: '#ebecff',
                loadSpeed: 200,
                opacity: 0.9
            },
            closeOnClick: false
        });
    },

    setNavLinks: function () {
        var path = window.location.pathname;
        path = path.trim().length == 0 ? "/" : path;
        $('ul.menu a').each(function (index) {
            if (path == $(this).attr("href")) {
                $(this).addClass("active");
            }
        });
        return false;
    }
};