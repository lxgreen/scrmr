;(function(w,d,u){
    this.Scrmr = this.Scrmr || {
        base : '//localhost:8080',
        css : '/css/scrmr.css',
        hand : '/img/hand.png',
        boo : '/img/scrmr.png',
        m4a : '/snd/scrmr.m4a',
        mp3 : '/snd/scrmr.mp3',
        ogg : '/snd/scrmr.ogg',
        e : null,
        trigger : null,
        triggers : []
    };

    Scrmr.url = function(resource){ return this.base + this[resource]; };
    Scrmr.ltIE9 =   (function() {
                        var ie = document.createElement("div");
                        ie.innerHTML = "<!--[if lte IE 8]><i></i><![endif]-->";
                        return (ie.getElementsByTagName("i").length === 1);
                    }());
    Scrmr.getTriggers = function(el){
        this.e = el;
        this.triggers.push({value : "click", text : "ClIcK"});
        this.triggers.push({value : "mouseover", text : "HoVeR"});
        this.triggers.push({value : "scroll", text : "ScRolL"});
        this.triggers.push({value : "timer", text : "1 MIN."});
        switch(this.e.tagName.toLowerCase()){
            case "input":
            case "textarea":
            this.triggers.push({value : "keydown", text : "KeYs"});
                break;
            default:
                break;
        }
    };

    var link = d.createElement("link"),
        scrmrHtml =  '<img draggable="false" src="' +  Scrmr.url("hand") +
                '" class="scrmr-vanish"/><div id="scrmr-drag" draggable="true" class="scrmr-vanish"></div><label id="i"><b>I</b>DrAg DoWn</label><label id="ii" class="scrmr-clickable scrmr-disabled"><b>II</b><select id="trigger" disabled="true"><option style="visibility:hidden;">?????</option></select></label><label id="iii" class="scrmr-clickable scrmr-disabled"><b>III</b>Pr0fIt!</label><div id="scrmr-handle"></div>',
        booHtml = '<audio preload="auto"><source src="' + Scrmr.url("m4a") +
            '" type="audio/m4a" /><source src="' + Scrmr.url("mp3") +
            '" type="audio/mp3" /><source src="' + Scrmr.url("ogg") + '" type="audio/ogg"/></audio>',
        body = d.body,
        boo = d.createElement("div"),
        scrmr = d.createElement("div"),
        hand, handle,
        draggable,
        i, ii, iii,
        select,
        audio,
        dragDrop = {
            dropTargets : null,
            dragElement : null,
            ondrag: null,
            ondragend: null,
            ondrop: null
        },
        setup = function(){
            scrmr.innerHTML = scrmrHtml;
            scrmr.id = 'scrmr';
            scrmr.className = 'scrmr-hidden';
            link.href = Scrmr.url("css");
            link.rel = "stylesheet";
            scrmr.appendChild(link);
            body.appendChild(scrmr);

            boo.innerHTML = booHtml;
            boo.id = 'boo';
            body.appendChild(boo);

            handle = $("#scrmr-handle");
            draggable = $("#scrmr-drag");
            i = $("#i");
            ii = $("#ii");
            iii = $("#iii");
            scrmr = $("#scrmr");
            select = $("#trigger");
            audio = $("#boo audio")[0];
            hand = $("#scrmr img")[0];

            hand.draggable = false;
            hand.unselectable = true;

            on(hand, "dragstart", function(e){
                e = e || w.event;
                if (e.preventDefault) {
                    e.preventDefault();
                }
                return false;
            });

            on(handle, "click", function(){
                toggleClass(scrmr, "scrmr-hidden");
            });

            on(select, "change", function(e){
                toggleClass(iii, "scrmr-disabled","off");
                Scrmr.trigger = select[0].value;
            });

            on(audio, "ended", function(e){
                off(audio, "ended");
                boo.style.display = "none";
                body.removeChild(scrmr[0]);
                body.removeChild(boo);
                Scrmr = u;
                var script = $("head script[src*=scrmr]")[0];
                $("head")[0].removeChild(script);
            });

            on(iii, "click", function(){
                if(Scrmr.e && Scrmr.trigger){
                    toggleClass(ii, "scrmr-done");
                    toggleClass(iii, "scrmr-done");
                    off(iii, "click");
                    select[0].disabled = true;

                    switch (Scrmr.trigger) {
                        case 'timer':
                                setTimeout(function(){
                                    booo();
                                },60*1000);
                            break;
                        case 'scroll':
                            on(d, 'scroll', function(){
                                booo();
                            });
                            on(Scrmr.e, 'scroll', function(){
                                booo();
                            });
                            break;

                        default:
                            on(Scrmr.e, Scrmr.trigger, function(e){
                                e = e || w.event;
                                if (e.preventDefault) {
                                    e.preventDefault();
                                }

                                booo();

                                return false;
                            });

                    }


                    setTimeout(function() {
                        toggleClass(scrmr, "scrmr-hidden");
                        setTimeout(function() {
                            scrmr[0].style.display = "none";
                        }, 400);
                    }, 200);
                }
            });

            function booo(){
                boo.style.display = "block";
                audio.play();
            }

            initDragDrop(draggable[0], {
                ondrag: function(e){
                    if(!dragDrop.moved){
                        toggleClass(scrmr, "scrmr-hidden");
                        dragDrop.moved = true;
                    }
                },
                ondragend: function(e){
                    toggleClass(scrmr, "scrmr-hidden");
                    toggleClass(i, "scrmr-done");
                    toggleClass(ii, "scrmr-disabled");
                    toggleClass(dragDrop.dropTargets, "scrmr-over", "off");
                },
                ondrop : function(e){
                    Scrmr.getTriggers(e.target || e.srcElement);
                    Scrmr.triggers.forEach(function(trigger){
                        var opt = d.createElement('option');
                        opt.value = trigger.value;
                        opt.innerHTML = trigger.text;
                        select[0].appendChild(opt);
                    });
                    select[0].disabled = false;
                }
            });

             setTimeout(function(){
                 toggleClass(scrmr, "scrmr-hidden");
             }, 200);
        };

    function $(selector){
        return d.querySelectorAll(selector);
    }

    function on(el, type, handler) {
        processCollectionOrElement(el, toggleHandler, [type, handler, true]);
    }

    function off(el, type, handler){
        processCollectionOrElement(el, toggleHandler, [type, handler]);
    }

    function toggleClass(el, className, state){
        processCollectionOrElement(el, toggleElementClass, [className, state]);
    }

    function processCollectionOrElement(el, process, args){
        if(el.length){
           for (var i = 0, l = el.length; i < l; i ++) {
                args.unshift(el[i]);
                process.apply(this, args);
                args.shift();
           }
        }
        else{
            args.unshift(el);
            process.apply(this, args);
        }
    }

    function toggleElementClass(e, className, state){
        var currentClassName = e.className,
            off = currentClassName.replace(className, ''),
            on = off + ' ' + className,
            opposite = currentClassName === off ? on : off;
        e.className = state === u ? opposite : state === "on" ? on : off;
    }

    function toggleHandler(e, type, handler, add){
        var eventListenerOperation = (add ? "add" : "remove") + "EventListener",
            eventOperation = (add ? "at" : "de") + "tachEvent";
        if (e[eventListenerOperation]) {
            e[eventListenerOperation](type, handler, false);
        } else if (e[eventOperation]) {
            e[eventOperation]("on" + type, handler);
        } else {
            e["on" + type] = add ? handler : null;
        }
    }

    function initDragDrop(el, handlers){
        dragDrop.dragElement = el;
        // TODO: select dropTargets all except #scrmr contents.
        dragDrop.dropTargets = $("*:not(#scrmr");
        dragDrop.ondrag = handlers.ondrag;
        dragDrop.ondragend = handlers.ondragend;
        dragDrop.ondrop = handlers.ondrop;

        on(dragDrop.dragElement, "dragstart", ondragstart);
        on(dragDrop.dragElement, "drag", ondrag);
        on(dragDrop.dragElement, "dragend", ondragend);

        on(dragDrop.dropTargets, "dragover", ondragover);
        on(dragDrop.dropTargets, "dragenter", onhover);
        on(dragDrop.dropTargets, "dragleave", onhover);
        on(dragDrop.dropTargets, "drop", ondrop);
    }

    function ondragstart(e){
        e = e || w.event;
        this.style.opacity = 0;
        e.dataTransfer.setData("stupidMozilla", this);
        e.dataTransfer.effectAllowed = 'move';
    }

    function ondrag(e){
        e = e || w.event;
        if(typeof dragDrop.ondrag === 'function'){
                dragDrop.ondrag(e);
        }
    }

    function ondragend(e){
        e = e || w.event;
        off(dragDrop.dropTargets, "dragover", ondragover);
        off(dragDrop.dropTargets, "dragenter", onhover);
        off(dragDrop.dropTargets, "dragleave", onhover);
        if(typeof dragDrop.ondragend === 'function'){
                dragDrop.ondragend(e);
        }
    }

    function ondrop(e){
        e = e || w.event;
        if(!dragDrop.inDrop && typeof dragDrop.ondrop === 'function'){
            dragDrop.inDrop = true;
            dragDrop.ondrop(e);
        }
    }

    function ondragover(e){
        if (e.preventDefault) {
            e.preventDefault();
        }
       e.dataTransfer.dropEffect = 'move';
        return false;
    }

    function onhover(e){
        toggleClass(this, "scrmr-over");
    }

    setup();

})(this,this.document);
