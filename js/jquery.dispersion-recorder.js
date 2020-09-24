(function ($) {
  $.fn.dispersionRecord = function (options) {
    var defaultOptions = { minimumDistance: 30, maximumDistance: 230, template: "<span class=\"badge badge-warning shotRecord center\" data-role=\"shotRecord\">{club} Miss {vector} {length} {targetDistance} yd</span>" };
    var options = options || defaultOptions;
    Object.assign(defaultOptions,options);

    var plugin = this;
    var chosenClub = '';
    var targetDistance = null;
    var element, $element;

    var makeShotRecord = function (left, top) {
      var shotRecord = $(options.template);
      shotRecord.css({ 'position': 'absolute', 'left': left, 'top': top });
      return shotRecord;
    }

    var setShotRecordResultText = function (shotRecord, canvasX, canvasY) {
      //get the xy of the middle of the container - (the target)
      var x = $element.width() / 2;
      var y = $element.height() / 2;
      
      var result = { vector: '', length: '', targetDistance: targetDistance, chosenClub: chosenClub }
      
      result.vector =  (canvasX <= x) ? 'Left' : 'Right';
      result.length =  (canvasY <= y) ? 'Long' : 'Short';

      var compiled = shotRecord.text().replace('{vector}',result.vector)
      .replace('{length}',result.length)
      .replace('{club}',result.chosenClub)
      .replace('{targetDistance}',result.targetDistance);

      shotRecord.text(compiled);
    }

    function placeShortRecordOnCanvas(canvasX, canvasY) {

      var shotRecord = makeShotRecord(canvasX, canvasY);
      setShotRecordResultText(shotRecord, canvasX, canvasY);

      $element.append(shotRecord);
    }

    var handleClick = function (e) {
      var offset = element.getClientRects()[0];
      var canvasX = e.clientX - offset.left;
      var canvasY = e.clientY - offset.top;

      placeShortRecordOnCanvas(canvasX, canvasY);
    }

    var handleEnd = function (e) {
      console.log('Touch end');
      if (lastMove && lastMove.originalEvent.touches[0] !== undefined) {
        console.log(lastMove.originalEvent);
        var e = lastMove.originalEvent.touches[0];

        var offset = element.getClientRects()[0];
        var canvasX = e.clientX - offset.left;
        var canvasY = e.clientY - offset.top;
        placeShortRecordOnCanvas(canvasX, canvasY);
      }
    };

    var handleStart = function (e) {
      lastMove = null;
    };

    var lastMove = null;
    var handleMove = function (e) {
      lastMove = e;
    };

    var bindPerformanceCanvasEventListeners = function () {
      $element.on('click', handleClick);

      //Mobile / touch screens
      $element.on("touchstart", handleStart);
      $element.on("dragstart", function (e) { e.preventDefault; return false; });
      $element.on("touchend", handleEnd);
      // el.on("touchcancel", handleCancel, false);
      // el.on("touchleave", handleEnd, false);
      $element.on("touchmove", handleMove);
    }

    plugin.setChosenClub = function(club){
      chosenClub = club
      console.log('DispersionRecorder','Chosen club set to: ' + chosenClub);
    }

    plugin.init = function () {
      element = plugin[0];
      $element = $(element);
      img = $element.find('img');
      $(img).on("dragstart select", function (e) { e.preventDefault; return false; });
      
      bindPerformanceCanvasEventListeners();
      
      $(window).on('club-selection:changed',function(event,args){ plugin.setChosenClub(args.club)});
      $(window).on('Distance:set',function(event,args){
        $('[data-role=shotRecord]').remove();
        targetDistance = args.distance;
      });
    }

    plugin.init();
    return plugin;

  }
})(jQuery);