Resizer = function(o) {
  me = this;
  var orientation = o.orientation;
  var start = o.start;
  var stop = o.stop;
  var size = o.size;
  var active = false;
  var resizerContainer = o.resizerContainer;
  var overflowContainer = o.overflowContainer;
  var scrollContainer = o.scrollContainer;
  var positions = o.positions;
  var callbacks = [];
  var dragdrop = new Dragdrop();

  var ref = $('<div class="' + orientation + '-resizer"></div>')
    .appendTo(o.ref)
    .attr('id', 'resizer')
    .css('top', 0)
    .css('left', 0)
    .css('height', size[1])
    .css('width', size[0]);

  var lineRef = $('<div class="' + orientation + '-resizer-line"></div>')
    .appendTo(o.ref)
    .attr('id', 'resizer-line')
    .css('top', 0)
    .css('left', 0)
    .css('height', overflowContainer.height())
    .css('width', 1);

  // register event handler
  resizerContainer.bind('mousemove', containerMousemoveHandler);
  ref.bind('mousedown', startResizerSession);
  ref.bind('mouseleave', mouseleaveHandler);

  function startResizerSession(event){
    active = true;
    show();
    dragdrop.startSession(event);
    dragdrop.on('drag', resize);
    dragdrop.on('stopSession', stopResizerSession);
    ref.unbind('mouseleave');
//    console.log('resizerstartSession');
  }
  function resize(event) {
    var pos;
    if (orientation == 'horizontal'){
      pos = dragdrop.startX +
        dragdrop.deltaX -
        overflowContainer.offset().left;
    }
    if (orientation == 'vertical'){
      pos = dragdrop.startY +
        dragdrop.deltaY -
        overflowContainer.offset().top;
    }
    if (pos < start){
      pos = start;
    }
    else if (pos > stop){
      pos = stop;
    }
    // $('#dbg-1-1').text('delta');
    // $('#dbg-1-2').text(dragdrop.deltaX);
    // $('#dbg-2-1').text('position');
    // $('#dbg-2-2').text(pos);
    move(pos);
    if (callbacks[arguments.callee.name]){
      callbacks[arguments.callee.name](event, me);
    }
    // console.log('resizerDrag: ' + pos);
  }
  function addCallback(name, callback){
    callbacks[name] = callback;
  }
  this.on = function(name, callback) {
    addCallback(name, callback);
  };
  function stopResizerSession(event) {
    ref.bind('mouseleave', mouseleaveHandler);
    active = false;
    hide();
    // console.log('stopResizerSession');
  }
  //
  // track mouse movement on the table row/column header and display a resizer
  // when hovering over a cell border
  //
  function containerMousemoveHandler(event){
    var found = false;
    if (!active){
      for (var i = 0; i < positions.length; i++){
        if (event.clientX + scrollContainer.scrollLeft() -
          resizerContainer.offset().left >
          positions[i] - 3 &&
          event.clientX + scrollContainer.scrollLeft() -
          resizerContainer.offset().left <
          positions[i] + 3){
          show();
          move(positions[i] - scrollContainer.scrollLeft() + resizerContainer.position().left);
          found = true;
          break;
        }
      }
      if (!found){
        hide();
      }
    }
  }
  function mouseleaveHandler(event) {
    // console.log('resizer LEAVE');
    hide();
  }
  function move(pos) {
    if (orientation == 'horizontal'){
      ref.css('left', pos - size[0] / 2);
      lineRef.css('left', pos);
    }
    else if (orientation == 'vertical'){
      ref.css('top', pos);
      lineRef.css('top', pos);
    }
  }
  function hide(o) {
    ref.css('display', 'none');
    lineRef.css('display', 'none');
  }
  function show(o) {
    ref.css('display', 'block');
    if (active){
      lineRef.css('display', 'block');
    }
  }
};
