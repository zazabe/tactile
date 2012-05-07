window.addEventListener('load', function(e){
    var infos = {
        updateStatus: function(type, e){
            var li = document.querySelectorAll('#' + type + 'Infos li'), el = null, index = 0, value = null;
            for(index ; index < li.length ; index++){
                el = li[index];
                try {
                    value = this.getValue(e, el.getAttribute('class'));
                    el.querySelector('span').innerHTML = value;
                }
                catch(e){
                    el.querySelector('span').innerHTML = 'none';
                }
                
            }
        },
        
        getValue: function(object, identifier){
            var value = null, matches = null, reg = {
                onepoint: /(.*)\.(.*)/,
                twopoint: /(.*)\[([0-9]*)\]\.(.*)/
            };
                
            if(reg.twopoint.test(identifier)){
                matches = identifier.match(reg.twopoint);
                value = object[matches[1]][matches[2]][matches[3]];
            }
            else if(reg.onepoint.test(identifier)){
                matches = identifier.match(reg.onepoint);
                value = object[matches[1]][matches[2]];
            }
            else {
                value = object[identifier];
            }
            
            return value;
        }
        
    };
    
    Tactile.config({
        debug: false,
        zoomKeyCode: 90, /* key: z */
        tapHoldStart: 500,
        swipeDistance: 30,
        directionDelta: 40
    });

    document.addEventListener('tactile', function(e){
    });

    
    var tap = document.getElementById('tap');

    /* tap events */
    tap.addEventListener('tap', function(e){
        infos.updateStatus('tap', e);
    });

    tap.addEventListener('tapstart', function(e){
        infos.updateStatus('tap', e);
    });
    
    tap.addEventListener('tapend', function(e){
        infos.updateStatus('tap', e);
    });
    
    tap.addEventListener('taphold', function(e){
        infos.updateStatus('tap', e);
    });

    /* swipe events */
    var swipe = document.getElementById('swipe');

    swipe.addEventListener('swipe', function(e){
        infos.updateStatus('swipe', e);
    });

    swipe.addEventListener('swipestart', function(e){
        infos.updateStatus('swipe', e);
    });

    swipe.addEventListener('swipemove', function(e){
        infos.updateStatus('swipe', e);
    });

    swipe.addEventListener('swipeend', function(e){
        infos.updateStatus('swipe', e);
    });

    swipe.addEventListener('swipeleft', function(e){
        infos.updateStatus('swipe', e);
    });
    
    swipe.addEventListener('swiperight', function(e){
        infos.updateStatus('swipe', e);
    });
    
    swipe.addEventListener('swipeup', function(e){
        infos.updateStatus('swipe', e);
    });
    
    swipe.addEventListener('swipedown', function(e){
        infos.updateStatus('swipe', e);
    });
    
    /* zoom events */
    document.addEventListener('zoomstart', function(e){
        infos.updateStatus('zoom', e);
    });

    document.addEventListener('zoommove', function(e){
        infos.updateStatus('zoom', e);
    });

    document.addEventListener('zoomend', function(e){
        infos.updateStatus('zoom', e);
    });
    document.addEventListener('zoom', function(e){
        infos.updateStatus('zoom', e);
    });

    document.addEventListener('rotate', function(e){
        infos.updateStatus('zoom', e);
    });

    document.addEventListener('scale', function(e){
        infos.updateStatus('zoom', e);
    });
});
