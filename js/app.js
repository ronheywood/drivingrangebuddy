$(function(){
    var randomDistanceGenerator = $('[data-bind=targetDistance]').makeRandomDistance(options);
    $('[data-role=makeNewRandomDistance]').on('click',randomDistanceGenerator.resetDistance);
    bindPerformanceCanvasEventListener();
});