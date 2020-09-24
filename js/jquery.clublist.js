(function ($) {
    $.fn.clubList = function (options) {
        var clubs = options.clubs || [
            "1W",
            "3W",
            "5W",
            "3i",
            "4i",
            "5i",
            "6i",
            "7i",
            "8i",
            "9i",
            "PW",
            "AW",
            "SW"
        ]

        var plugin = this;
        var element, $element;

        var sendChangeClubCommand = function (club) {
            $(window).trigger('club-selection:changed', { club: club });
        }

        var setClubList = function () {
            var container = $('<ul class="pagination justify-content-center flex-wrap clubList">');
            clubs.map(function (club) {
                container.append($('<li class="page-item"><a class="page-link">' + club + '</a></li>'));
            });

            container.on('click', 'a', function(){
                container.find('li').removeClass('active');
                $(this).parent('li').addClass('active'); 
                sendChangeClubCommand(this.innerHTML); return false; 
            });
            $element.empty().append('<nav>').append(container);
        }

        plugin.init = function () {
            element = plugin[0];
            $element = $(element);
            setClubList();
        }

        plugin.init();
        return plugin;
    }
})(jQuery);