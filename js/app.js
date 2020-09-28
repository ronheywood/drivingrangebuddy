$(function(){

    if ('serviceWorker' in navigator) {     
        navigator.serviceWorker  
        .register('./serviceWorker.js'); 
    } 

    $('[data-role=performanceCanvas]').dispersionRecord();
    $('[data-bind="club-selection"]').clubList(options);
    
    var randomDistanceGenerator = $('[data-bind=targetDistance]').makeRandomDistance(options);
    $('[data-role=makeNewRandomDistance]').on('click',randomDistanceGenerator.resetDistance);
    distanceAnnouncer.init($);
});