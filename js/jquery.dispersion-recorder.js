var shotRecordMapper = {
  compile: function (template, shotData) {
    shotData = Object.assign({ vector: "", length: "", chosenClub: "", targetDistance: "" }, shotData);
    return template.replace('{vector}', shotData.vector)
      .replace('{length}', shotData.length)
      .replace('{club}', shotData.chosenClub)
      .replace('{targetDistance}', shotData.targetDistance);
  }
};

(function ($) {
  $.fn.dispersionRecord = function (options) {
    var defaultOptions = { minimumDistance: 30, maximumDistance: 230, template: "<span class=\"badge badge-warning shotRecord center\" data-role=\"shotRecord\">{club} Miss {vector} {length} {targetDistance} yd</span>" };
    var options = options || defaultOptions;
    Object.assign(defaultOptions, options);

    var plugin = this;
    var chosenClub = '';
    var targetDistance = null;
    var element, $element;
    var targetCenterPoint;

    var getShotData = function (canvasX, canvasY) {
      var shotData = { left: canvasX, top: canvasY, targetDistance: targetDistance, chosenClub: chosenClub }

      shotData.vector = (canvasX <= targetCenterPoint.x) ? 'Left' : 'Right';
      shotData.length = (canvasY <= targetCenterPoint.y) ? 'Long' : 'Short';
      return shotData;
    }

    var createLabelElement = function (shotData) {
      var label = $(options.template);
      label.css({ 'position': 'absolute', 'left': shotData.left, 'top': shotData.top });
      label.text(shotRecordMapper.compile(label.text(), shotData));
      return label;
    }

    function placeShortRecordOnCanvas(shotData) {
      $element.append(createLabelElement(shotData));
    }

    var handleClick = function (e) {
      var offset = element.getClientRects()[0];
      var canvasX = e.clientX - offset.left;
      var canvasY = e.clientY - offset.top;

      var shotData = getShotData(canvasX, canvasY);
      placeShortRecordOnCanvas(shotData);
    }

    var handleEnd = function (e) {
      if (lastMove && lastMove.originalEvent.touches[0] !== undefined) {
        console.log(lastMove.originalEvent);
        var e = lastMove.originalEvent.touches[0];

        var offset = element.getClientRects()[0];
        var canvasX = e.clientX - offset.left;
        var canvasY = e.clientY - offset.top;

        var shotData = getShotData(canvasX, canvasY);
        placeShortRecordOnCanvas(shotData);
      }
    };

    var handleStart = function (e) {
      lastMove = null;
    };

    var handleCancel = function (e) {
      lastMove = null;
    }

    var lastMove = null;
    var handleMove = function (e) {
      lastMove = e;
    };

    plugin.setChosenClub = function (club) {
      chosenClub = club;
    }

    var bindUserTouchHandlers = function () {
      $element.on('click', handleClick);

      //Mobile / touch screens
      $element.on("touchstart", handleStart);
      $element.on("dragstart", function (e) { e.preventDefault; return false; });
      $element.on("touchend", handleEnd);
      $element.on("touchcancel", handleCancel);
      $element.on("touchleave", handleEnd);
      $element.on("touchmove", handleMove);
    }

    var bindPerformanceCanvasEventListeners = function () {
      $(window).on('club-selection:changed', function (event, args) { plugin.setChosenClub(args.club) });
      $(window).on('Distance:set', function (event, args) {
        $element.find('[data-role=shotRecord]').remove();
        targetDistance = args.distance;
      });
    }

    var preventDragSelectOnImage = function () {
      img = $element.find('img');
      $(img).on("dragstart select", function (e) { e.preventDefault; return false; });
    }

    plugin.init = function () {
      element = plugin[0];
      $element = $(element);
      targetCenterPoint = { x: $element.width() / 2, y: $element.height() / 2 };

      preventDragSelectOnImage();
      bindUserTouchHandlers();
      bindPerformanceCanvasEventListeners();

    }

    plugin.init();
    return plugin;

  }
})(jQuery);