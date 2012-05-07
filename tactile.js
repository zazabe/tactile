    var Tactile = {
        debug: false,
        zoomKeyCode: 90, /* key: z */
        tapHoldStart: 500,
        swipeDistance: 30,
        directionDelta: 40,
        
        config: function(options){
            for(var name in options){
                if(this.hasOwnProperty(name)){
                    this[name] = options[name];
                }
            }
        },
        
        MouseHandler: {
            twoFinger: false,
            
            mousedown: function(e){
                var client = { x: e.clientX, y: e.clientY };
                Tactile.Gesture.setOrigin(client);
                Tactile.Gesture.start(client, e);
            },
            
            mousemove: function(e){
                var client = { x: e.clientX, y: e.clientY };
                if(this.twoFinger){
                    var point2 = Tactile.Utils.opposite(client, Tactile.Gesture.origin);
                    Tactile.Gesture.move(client, 0);
                    Tactile.Gesture.move(point2, 1);
                }
                else {
                    Tactile.Gesture.move(client);
                }
            },
            
            mouseup: function(e){
                var client = { x: e.clientX, y: e.clientY };
                if(this.twoFinger){
                    var point2 = Tactile.Utils.opposite(client, Tactile.Gesture.origin);
                    Tactile.Gesture.end(client, 0);
                    Tactile.Gesture.end(point2, 1);
                }
                else {
                    Tactile.Gesture.end(client);
                }
            },
            
            keydown: function(e){
                if(e.keyCode == Tactile.zoomKeyCode){
                    this.twoFinger = true;
                }
            },
            
            keyup: function(e){
                if(e.keyCode == Tactile.zoomKeyCode){
                    this.twoFinger = false;
                }
            }
        },
        
        Gesture: {

            startAt: null,
            originalEvent: null,
            datas: {},
            origin: {},
            points: [],
            timer: null,
            
            setOrigin: function(point){
                this.origin = point;
            },
            
            start: function(point, e, index){
                if(!this.startAt){
                    index = index || 0;
                    this.startAt = Date.now();
                    this.originalEvent = e;
                    this.setPoint(index, point);
                    this.fireStartEvents();    
                    Tactile.Debug.showPoints(this.points, this.origin);
                }
            },

            move: function(point, index){
                if(this.startAt){
                    index = index || 0;
                    this.setPoint(index, point);
                    this.fireMoveEvents();    
                    Tactile.Debug.showPoints(this.points, this.origin);
                }
            },
            
            end: function(point, index){
                if(this.startAt){
                    index = index || 0;
                    this.setPoint(index, point);
                    this.fireEndEvents();    
                    this.reset();
                    Tactile.Debug.hidePoints();
                }
            },
            
            
            fireStartEvents: function(){
                this.fireEvents(['tapstart'], this.getTapDatas());
                
                this.timer = setTimeout(function(gesture){
                       gesture.fireEvents(['taphold'], gesture.getTapDatas());
                }, Tactile.tapHoldStart, this);
            },
            
            fireMoveEvents: function(){
                clearTimeout(this.timer);
                
                var datas = {}, eventName = [];
                if(this.isZoom()){
                    datas = this.getZoomDatas();
                    eventName.push('zoommove');
                }
                else if (this.isSwipe()){
                    datas = this.getSwipeDatas();
                    eventName.push('swipemove');
                }
                this.fireEvents(eventName, datas);
            },
            
            fireEndEvents: function(){
                var datas = {}, eventName = [];
                if(this.isZoom()){
                    datas = this.getZoomDatas();
                    eventName.push('zoomend');
                    eventName.push('zoom');
                }
                else if (this.isSwipe()){
                    datas = this.getSwipeDatas();
                    eventName.push('swipeend');
                    eventName.push('swipe');
                    if(datas.direction) {
                        eventName.push('swipe' + datas.direction);
                    }
                }
                else if (this.isTap() && this.duration() > Tactile.tapHoldStart){
                    datas = this.getTapDatas();
                    eventName.push('tapholdend');
                    eventName.push('tapend');
                }
                else if (this.isTap()){
                    datas = this.getTapDatas();
                    eventName.push('tapend');
                    eventName.push('tap');
                }
                
                this.fireEvents(eventName, datas);
            },
            
            fireEvents: function(eventName, datas){
                for(var index in eventName){
                    Tactile.EventManager.fireEvent(eventName[index], datas, this.originalEvent);
                }
            },
            
            getTapDatas: function(){
                return {
                    position:  this.points[0],
                    duration:  this.duration()
                };
            },
            
            getSwipeDatas: function(){
                return {
                    direction: Tactile.Utils.direction(this.origin, this.points[0]),
                    distance:  Tactile.Utils.distance(this.origin, this.points[0]),
                    speed:     Tactile.Utils.speed(this.origin, this.points[0], this.duration()),
                    duration:  this.duration(),
                    position:  this.points[0],
                    origin:    this.origin 
                };
            },
            
            getZoomDatas: function(){
                return {
                    direction: Tactile.Utils.direction(this.points[0], this.points[1]),
                    distance:  Tactile.Utils.distance(this.points[0], this.points[1]),
                    speed:     Tactile.Utils.speed(this.points[0], this.points[1], this.duration()),
                    duration:  this.duration(),
                    position:  this.points,
                    origin:    this.origin,
                    rotation:  0,
                    scale:     0 
                };
            },
            
            isSwipe: function(){ return this.points.length == 1 && Tactile.Utils.distance(this.origin, this.points[0]) > Tactile.swipeDistance; },
            
            isTap: function(){ return this.points.length == 1; },
            
            isZoom: function(){ return this.points.length == 2; },
            
            reset: function(){
                clearTimeout(this.timer);
                
                this.timer = null;
                this.origin = {};
                this.datas = {};
                this.startAt = null;
                this.originalEvent = null;
                this.points = [];
            },
            
            setPoint: function(index, point){
                this.points[index] = point;
            },
            
            duration: function(){
                return Date.now() - this.startAt;
            }
        
        },
        
        Utils: {
            opposite: function(point, origin){
                return {
                    x: (2 * origin.x) - point.x,
                    y: (2 * origin.y) - point.y
                };
            },
            
            distance: function(point1, point2){
                var distance = Math.round(Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2)));
                return distance > 0 ? distance : -distance;
            },
            
            direction: function(point1, point2){
                var delta = Tactile.directionDelta, direction = '';
                
                if(point1.x <= point2.x + delta && point1.x >= point2.x - delta){
                    direction =  point1.y > point2.y ? 'up' : 'down';
                }
                else if(point1.y <= point2.y + delta && point1.y >= point2.y - delta){
                    direction =  point1.x > point2.x ? 'left' : 'right';
                }
                
                return direction;
            },
            
            speed: function(point1, point2, duration){
                return Math.round(this.distance(point1, point2) / ( duration / 1000 ));
            }
        },
        
        EventManager: {
        
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
                for(var eventname in Tactile.MouseHandler){
                    document.addEventListener(eventname, Tactile.MouseHandler[eventname]);    
                }
            },
            
            touchSupported: function(){
                return false;
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
            
        },
        
        Debug: {
            points: [],
            origin: null,
            
            showPoints: function(positions, origin){
                for(var index in positions){
                    this.points[index] = this.points[index] || this.createFingerPrint();
                    this.points[index].setPosition(positions[index].x - 16, (positions[index].y - 16));
                }
                this.origin = this.origin || this.createOrigin();
                this.origin.setPosition(origin.x - 2, origin.y - 2);
                
            },
            
            hidePoints: function(){
                for(var index in this.points){
                    document.querySelector('body').removeChild(this.points[index]);
                }
                document.querySelector('body').removeChild(this.origin);
                
                this.points = [];
                this.origin = null;
            },
            
            createOrigin: function(){
                return this.createPoint({
                    background: '#900',
                    border: '1px solid #c00',
                    width: '6px',
                    height: '6px',
                    'border-radius': '4px',
                    position: 'absolute',
                    display: 'none',
                    'z-index': 1000,
                    opacity: 0.6
                });
            },
            
            createFingerPrint: function(){
                return this.createPoint({
                    background: '#dedede',
                    border: '2px solid #666',
                    width: '32px',
                    height: '32px',
                    'border-radius': '18px',
                    position: 'absolute',
                    display: 'none',
                    'z-index': 1000,
                    opacity: 0.6
                });
            },
            
            createPoint: function(css){
                var point = document.createElement('div');
                for(var name in css){
                    point.style.setProperty(name, css[name]);    
                }
                point.setAttribute('id', 'tactile-debug-' + this.points.length);
                point.setPosition = function(x, y){
                    this.style.setProperty('left', x + 'px');
                    this.style.setProperty('top', y + 'px');
                    this.style.setProperty('display', 'block');
                    
                };
                document.querySelector('body').appendChild(point);
                return point;
            }
        }

        
    };
    
    Tactile.EventManager.handleEvents();

