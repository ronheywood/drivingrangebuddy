
var distanceAnnouncer = {
    voice: '../audio/english-female-robotic.mp3',
    player: this,
    audio: null,
    init: function(jQuery){
        player = this;
        player.audio = new Audio(this.voice);
        player.audio.preload;
        jQuery(window).on("Distance:set",player.announceDistance);
        
    },
    announceDistance: function(event,distanceArgs){
        console.log(distanceArgs);
        startTime = 19;
        player.audio = new Audio(this.voice+'#t=19,20');
        player.audio.play();
        this.player.audio.currentTime = startTime;
        // player.audio.addEventListener('playing', function() {
        //     console.log(this.currentTime,startTime,this.seekable.start(0),this.seekable.end(0));
        //     if(this.currentTime < startTime){
        //         this.pause();
        //         this.currentTime = startTime;
        //     }
        //     console.log("Start: " +this.seekable.start(0) + " End: " + this.seekable.end(0));
            
        // });
        
    }
};

if(typeof module!=='undefined' ) module.exports = distanceAnnouncer;