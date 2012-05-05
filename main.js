
window.addEventListener('load', function(e){

    Tactile.config({
        debug: true
    });

    document.addEventListener('tactile', function(e){
    });

    
    var tap = document.getElementById('tap');

    /* tap events */
    tap.addEventListener('tap', function(e){
        
    });

    tap.addEventListener('tapstart', function(e){
        console.log('tapstart', e);
    });
    
    tap.addEventListener('tapend', function(e){
        console.log('tapend', e);
    });
    
    tap.addEventListener('taphold', function(e){
        
    });

    /* swipe events */
    document.addEventListener('swipe', function(e){
        
    });

    document.addEventListener('swipestart', function(e){
        
    });

    document.addEventListener('swipeend', function(e){
        
    });

    document.addEventListener('swipeleft', function(e){
        
    });
    
    document.addEventListener('swiperight', function(e){
        
    });
    
    document.addEventListener('swipetop', function(e){
        
    });
    
    document.addEventListener('swipebottom', function(e){
        
    });
    
    /* zoom events */
    document.addEventListener('rotate', function(e){
        
    });

    document.addEventListener('scale', function(e){
        
    });
});
