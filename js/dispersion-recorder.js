var handleClick = function(e){
    recordDispersion(this,e);
  }
  
  var recordDispersion = function(elem,e){
    
    var offset = elem.getClientRects()[0];
    var canvasX = e.clientX - offset.left;
    var canvasY = e.clientY - offset.top;
  
    var shotRecord = $("<span class=\"badge badge-warning shotRecord center\" data-role=\"shotRecord\" />");
    shotRecord.css({'position':'absolute','left': canvasX,'top': canvasY});
    $(elem).append(shotRecord);
    
    //get the xy of the middle of the container - (the target)
    
    var x = $(elem).width() /2;
    var y = $(elem).height() /2;
    
    //record dispersion miss left where x < container middle x
    if(canvasX<=x){ 
      shotRecord.text(shotRecord.text() + " Left");
    }
    //record dispersion miss right when x > container.middle.x
    if(canvasX>x){
       shotRecord.text(shotRecord.text() + " Right");
    }
  
    //record dispersion miss long when y < container.middle.y
    if(canvasY<=y){
      shotRecord.text(shotRecord.text() + " Long");
    }
  
    //record dispersion miss short when y > container.middle.y
    if(canvasY>y){
      shotRecord.text(shotRecord.text() + " Short");
    }
  }
  
  var handleEnd = function(e){
      console.log('end');
      if(lastMove && lastMove.originalEvent.touches[0] !== undefined){
        var elementTop = $('[data-role=performanceCanvas]')[0].offsetTop;
        console.log(elementTop);
        var offsetX = lastMove.originalEvent.touches[0].clientX;
        var offsetY = lastMove.originalEvent.touches[0].clientY;
        console.log(offsetX,offsetY);
      }
  };
  
  var handleStart = function(e){
    lastMove = null;
    console.log('touch start',e);
  };
  
  function handleCancel(e){
      console.log('cancel',e.offsetX,e.offsetY,e.pageX,e.pageY);
  };
  var el = null;
  var lastMove = null;
  function handleMove(e){
      lastMove = e;
      //console.log('move',e);
  };
  
  function bindPerformanceCanvasEventListener(){
    var el = $('[data-role=performanceCanvas]');
    el.on('click',handleClick);
    
    el.on("touchstart", handleStart);
    el.on("dragstart", function(e){ e.preventDefault; return false; });
    el.on("touchend", handleEnd);
    // el.on("touchcancel", handleCancel, false);
    // el.on("touchleave", handleEnd, false);
    el.on("touchmove", handleMove);
  
    el.find('img').on("dragstart select", function(e){ e.preventDefault; return false; });
  }