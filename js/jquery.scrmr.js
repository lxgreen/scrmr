(function($){
    $.fn.scrmr = $.fn.scrmr || function(options){
        var q,
            settings = $.extend({
                sound : "../snd/scrmr.mp3",
                image : "../img/scrmr.png",
                repeat : false,
                trigger : "click.scrmr",
                triggerParams : null,
                callback : null
            }, options),
            $boo = (( q = $("div#boo") ) && q.length) ? q : $('<div style="position: fixed; top:0; bottom:0; left:0; right:0; z-index: 666666; background: #bada55 url(' + settings.image + ') no-repeat 0 0; background-size: 100% 100%; display: none;"></div>').appendTo(this[0]),
            $audio = (( q = $("div#boo audio") ) && q.length) ? q : $('<audio preload="auto"><source src="' + settings.sound + '" /></audio>').on("ended", function(){ $boo.hide(); }).appendTo($boo),
            audio = $audio[0];

        settings.trigger += ".scrmr";

        return this.on(settings.trigger, function(){
            audio.play();
            $boo.show();
            if(!settings.repeat){
                $(this).off(".scrmr");
            }

            if(typeof settings.callback === 'function'){
                settings.callback();
            }
        });
    };
})(jQuery);
