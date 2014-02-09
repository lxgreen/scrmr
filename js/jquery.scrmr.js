(function($){
    $.fn.scrmr = $.fn.scrmr || function(options){
        var q,
            $boo = (( q = $("div#boo") ) && q.length) ? q : $('<div id="boo" style=""></div>').appendTo(this[0]),
            $audio = (( q = $("div#boo audio") ) && q.length) ? q : $('<audio preload="auto"><source src="../snd/scrmr.m4a" type="audio/m4a" /><source src="../snd/scrmr.mp3" type="audio/mp3;codecs=\x27mp3\x27" /><source src="../snd/scrmr.ogg" type="audio/ogg;codecs=\x27vorbis\x27"/></audio>').on("ended", function(){ $boo.hide(); }).appendTo($boo),
            audio = $audio[0],
            settings = $.extend({
                repeat : false,
                trigger : "click.scrmr",
                triggerParams : null
            }, options);

        settings.trigger += ".scrmr";

        return this.on(settings.trigger, function(){
                audio.play();
                $boo.show();
                if(!settings.repeat){
                    $(this).off(".scrmr");
                }
        });
    };
})(jQuery);
