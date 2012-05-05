    var Tactile = {
        debug: false,
        
        MouseHandler: {
            mousedown: function(e){
                Tactile.fireEvent('tapstart', {}, e);
            },
            
            mouseup: function(e){
                Tactile.fireEvent('tapend', {}, e);
            },
            
            mousemove: function(e){
            }
        },
        
        
        
        
        handleEvents: function(){
            if(this.touchSupported()){
               this.handleTouchEvents(); 
            }    
            else {
               this.handleMouseEvents(); 
            }
        },
        
        handleTouchEvents: function(){},
        
        handleMouseEvents: function(){
            for(var eventname in this.MouseHandler){
                document.addEventListener(eventname, this.MouseHandler[eventname]);    
            }
        },
        
        touchSupported: function(){
            return false;
        },
        
        config: function(options){
            for(var name in options){
                if(this.hasOwnProperty(name)){
                    this[name] = options[name];
                }
            }
        },
        
        createEvent: function(name, datas, originalEvent){
            var e = document.createEvent('Event');
            e.initEvent(name, true, true);
            
            for(var name in datas){
                e[name] = datas[name];
            }

            if(originalEvent){
                e.originalEvent = originalEvent;
            }
            return e;
        },
        
        fireEvent: function(name, datas, e){
            var ev = this.createEvent(name, datas, e);
            var tactileEvent = this.createEvent('tactile', {}, ev);
            
            if(document.dispatchEvent(tactileEvent)){
                e.srcElement.dispatchEvent(ev);    
            }
        }
    };
    
    Tactile.handleEvents();

