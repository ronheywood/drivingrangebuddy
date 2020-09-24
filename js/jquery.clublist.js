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
            var container = $('<div class="clubList">');
            clubs.map(function (club) {
                container.append($('<button class="btn btn-secondary">' + club + '</button>'));
            });

            container.on('click', 'button', function(){ sendChangeClubCommand(this.innerHTML) });
            $element.empty().append(container);
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