(function ($) {
  $.fn.dispersionRecord = function (options) {
    var options = options || { minimumDistance: 30, maximumDistance: 230 }
    var plugin = this;
    var element, $element;

    var makeShotRecord = function (left, top) {
      var shotRecord = $("<span class=\"badge badge-warning shotRecord center\" data-role=\"shotRecord\" />");
      shotRecord.css({ 'position': 'absolute', 'left': left, 'top': top });
      return shotRecord;
    }

    var setShotRecordResultText = function (shotRecord, canvasX, canvasY) {
      //get the xy of the middle of the container - (the target)
      var x = $element.width() / 2;
      var y = $element.height() / 2;

      //record dispersion miss left where x < container middle x
      if (canvasX <= x) {
        shotRecord.text(shotRecord.text() + " Left");
      }
      //record dispersion miss right when x > container.middle.x
      if (canvasX > x) {
        shotRecord.text(shotRecord.text() + " Right");
      }

      //record dispersion miss long when y < container.middle.y
      if (canvasY <= y) {
        shotRecord.text(shotRecord.text() + " Long");
      }

      //record dispersion miss short when y > container.middle.y
      if (canvasY > y) {
        shotRecord.text(shotRecord.text() + " Short");
      }

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

    plugin.init = function () {
      element = plugin[0];
      $element = $(element);
      img = $element.find('img');
      $(img).on("dragstart select", function (e) { e.preventDefault; return false; });
      
      bindPerformanceCanvasEventListeners();
    }

    plugin.init();
    return plugin;

  }
})(jQuery);