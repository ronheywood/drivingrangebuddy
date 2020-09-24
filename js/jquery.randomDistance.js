
(function($){
    $.fn.makeRandomDistance = function(options){
        var options = options || { minimumDistance: 30, maximumDistance: 230}
        var plugin = this;
        var element,$element;
        
        var randomIntFromInterval = function(min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        }

        plugin.resetDistance = function(){
            $('[data-role=shotRecord]').remove();
            $element.text(randomIntFromInterval(options.minimumDistance,options.maximumDistance));
            return $element;
        }
        
        plugin.init = function() {
            element = plugin[0];
            $element = $(element);

            // code goes here
            plugin.resetDistance();
        }

        plugin.init();
        return plugin;
    }
})(jQuery);