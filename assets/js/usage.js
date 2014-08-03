(function () {
    var sidebar = jQuery('.usage-sidebar').eq(0),
        root = $('html, body'),
        hash = '#' + location.hash.replace('#docs-', ''),
        scrollTimeout;

    function scrollTo (targetHash) {
        root.animate({
            scrollTop: jQuery(targetHash).offset().top - 68
        }, 250, function () {
            window.location.hash = '#docs-' + targetHash.replace('#', '');
        });
    }

    Prism.hooks.add('after-highlight', function () {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function () {
            jQuery('body').scrollspy({
                target: '.usage-sidebar',
                offset: 70
            });
            sidebar.affix({
                offset: {
                    top: sidebar.offset().top - 48
                }
            });

            jQuery('a[href*="#"]').on('click', function() {
                var el = jQuery(this),
                    href = el.attr('href');

                if (!el.length) {
                    return false;
                }

                scrollTo(href);

                return false;
            });

            if (hash !== '#') {
                scrollTo(hash);
            }
        }, 100);
    });
}());
