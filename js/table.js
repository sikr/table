var focusRef = null;
//
// Table object
//
//
//
//
//
function Table(o){
  var me = this;
  var config = {
    columns: o.columns? o.columns : 20,
    columnWidths: o.columnWidths? o.columnWidths : [].fill(100, o.columns? o.columns : 20),
    firstVisibleColumn: o.firstVisibleColumn? o.firstVisibleColumn : 1,
    fixedColumns: o.fixedColumns? o.fixedColumns : 0,
    fixedRows: o.fixedRows? o.fixedRows : 0,
    height: o.height? o.height : 243,
    id: o.id? o.id : 'a',
    rowHeaderWidth: o.rowHeaderWidth? o.rowHeaderWidth : 50,
    rowHeight: o.rowHeight? o.rowHeight : 21,
    rows: o.rows? o.rows : 20,
    scrollbarSize: o.scrollbarSize? o.scrollbarSize : 16,
    scrollLeft: o.scrollLeft? o.scrollLeft : 0,
    scrollTop: o.scrollTop? o.scrollTop : 0,
    scrollToSnap: o.scrollToSnap? o.scrollToSnap : true,
    width: o.width? o.width : 562,
  };
  config.columnPositions = config.columnWidths.progressiveSum();
  config.visibleRows = Math.floor((config.height - config.scrollbarSize) / config.rowHeight - 1);
  if (navigator.userAgent.indexOf('Chrome') != -1){
    config.scrollbarSize = 12;
  }
  // config.height = 11 * config.rowHeight + config.scrollbarSize;
  // config.width = config.rowHeaderWidth + config.columnWidths.rangeSum(1,6) + config.scrollbarSize;

  var t = {
    oc: null,         // outer container
      ic: null,       // inner container
        rchc: null,   // row column header container
          rcht: null, // row column header table
        chc: null,    // column header container
          cht: null,  // column header table
        rhc: null,    // row header container
          rht: null,  // row header table
        bc: null,     // body container
          bt: null,   // body table
        sc: null,     // scroll container
          scs: null   // scroll container shim
  };
  var dragdrop = new Dragdrop();
  var scrollTimerId = 0;
  var scrollTimeout = 0;
  var firstVisibleColumn = config.firstVisibleColumn;
  var focusElement = null;
  //
  // create the table
  //
  this.create = function(){
    init();
    createSkeleton();
    createTableFragments();
    createResizer();
    attachEventHandlers();
    createFocusRect();
    createSelectRect();
 };
  function init(){
    // ...
  }
  this.appendTo = function(ref){
    t.oc.appendTo(ref);
    t.scs.css('width', $('#body').width());
    t.scs.css('height', $('#body').height());
  };
  function createSkeleton(){
    t.oc = $('<div class="container"></div>')
      .attr('id', config.id + '-outer-container')
      .css('height', config.height)
      .css('width', config.width);
    t.ic = $('<div></div>')
      .attr('id', config.id + '-inner-container')
      .css('width', config.width + 'px')
      .css('height', config.height + 'px')
      .appendTo(t.oc);
    t.rchc = $('<div></div>')
      .attr('id', config.id + '-row-column-header-container')
      .addClass('row-column-header-container')
      .css('width', config.rowHeaderWidth + 'px')
      .css('height', config.rowHeight + 'px')
      .appendTo(t.ic);
    t.chc = $('<div></div>')
      .attr('id', config.id + '-column-header-container')
      .addClass('column-header-container')
      .css('left', config.rowHeaderWidth + 'px')
      .css('height', config.rowHeight)
      .css('width', (config.width - config.scrollbarSize - config.rowHeaderWidth) + 'px')
      .appendTo(t.ic);
    t.rhc = $('<div></div>')
      .attr('id', config.id + '-row-header-container')
      .addClass('row-header-container')
      .css('top', config.rowHeight + 'px')
      // .css('height', (config.height - config.rowHeight - config.scrollbarSize) + 'px')
      .css('height', (config.visibleRows * config.rowHeight) + 'px')
      .css('width', config.rowHeaderWidth + 'px')
      .appendTo(t.ic);
    t.bc = $('<div></div>')
      .attr('id', config.id + '-body-container')
      .addClass('body-container')
      .css('top', config.rowHeight + 'px')
      .css('left', config.rowHeaderWidth + 'px')
      // .css('height', (config.height - config.rowHeight - config.scrollbarSize) + 'px')
      .css('height', (config.visibleRows * config.rowHeight) + 'px')
      .css('width', (config.width - config.scrollbarSize - config.rowHeaderWidth) + 'px')
      .appendTo(t.ic);
    t.sc = $('<div></div>')
      .attr('id', config.id + '-scroll-container')
      .addClass('scroll-container')
      .css('top', config.rowHeight + 'px')
      .css('left', (config.rowHeaderWidth) + 'px')
      // .css('height', (config.height - config.rowHeight) + 'px')
      .css('height', (config.visibleRows * config.rowHeight + config.scrollbarSize) + 'px')
      .css('width', (config.width - config.rowHeaderWidth) + 'px')
      .appendTo(t.ic);
    t.scs = $('<div></div>')
      .attr('id', config.id + '-scroll-container-shim')
      .addClass('scroll-container-shim')
      .appendTo(t.sc);
  }
  function createTableFragment(o){
    var table;
    var colgroup;
    var row;
    var cell;
    var r;
    var c;
    var id;
    var width = o.columnWidths.rangeSum(o.startColumn, o.stopColumn);
    var enumerate;
    var enumerationText = '';

    table = $('<table id="' + o.id + '" class="table" style="width: ' + width + 'px; height: ' + ((o.stopRow - o.startRow + 1) * o.rowHeight) + 'px;"></div>');
    colgroup = $('<colgroup></colgroup>').appendTo(table);
    for (c = o.startColumn; c <= o.stopColumn; c++){
      $('<col style="width: ' + o.columnWidths[c] + 'px;" />').appendTo(colgroup);
    }
    if (typeof o.enumerate == 'number'){
      enumerate = o.enumerate;
    }
    else if (typeof o.enumerate == 'string'){
      enumerate = o.enumerate.charCodeAt(0);
    }
    for (r = o.startRow; r <= o.stopRow; r++){
      row = $('<tr></tr>').appendTo(table);
      for (c = o.startColumn; c <= o.stopColumn; c++){
        if (typeof o.enumerate == 'string'){
          enumerationText = String.fromCharCode(enumerate++);
        }
        else if (typeof o.enumerate == 'number'){
          (enumerationText = enumerate++).toString();
        }
        id = o.cellIdPrefix + '-' + r.toString() + '-' + c.toString();
        cell = $('<' + o.cellType + ' id="' + id + '" ' +
                 'tabindex="0">' +
                 enumerationText +
                 '</' + o.cellType + '>').appendTo(row);
        if (o.focusHandler){
          cell.bind('focus', o.focusHandler);
        }
      }
    }
    return table;
  }
  function createTableFragments(){
    t.rcht = createTableFragment({
      id           : 'row-column-header',
      startRow     : 0,
      stopRow      : 0,
      startColumn  : 0,
      stopColumn   : 0,
      columnWidths : [config.rowHeaderWidth],
      rowHeight    : config.rowHeight,
      cellType     : 'th',
      cellClass    : '',
      cellIdPrefix : 'rc'
    });
    t.rcht.appendTo(t.rchc);

    t.cht = createTableFragment({
      id           : 'column-header',
      startRow     : 0,
      stopRow      : 0,
      startColumn  : 1,
      stopColumn   : config.columns,
      columnWidths : [0].concat(config.columnWidths),
      rowHeight    : config.rowHeight,
      cellType     : 'th',
      cellClass    : 'foo',
      cellIdPrefix : 'c',
      enumerate    : 'A'
    });
    t.cht.appendTo(t.chc);

    t.rht = createTableFragment({
      id           : 'row-header',
      startRow     : 1,
      stopRow      : config.rows,
      startColumn  : 0,
      stopColumn   : 0,
      columnWidths : [config.rowHeaderWidth],
      rowHeight    : config.rowHeight,
      cellType     : 'th',
      cellClass    : 'bar',
      cellIdPrefix : 'r',
      enumerate    : 1
    });
    t.rht.appendTo(t.rhc);

    t.bt = createTableFragment({
      id           : 'body',
      startRow     : 1,
      stopRow      : config.rows,
      startColumn  : 1,
      stopColumn   : config.columns,
      columnWidths : [0].concat(config.columnWidths),
      rowHeight    : config.rowHeight,
      cellType     : 'td',
      cellClass    : '',
      cellIdPrefix : 'g',
      focusHandler : focusHandler
    });
    t.bt.appendTo(t.bc);
  }
  function createResizer(){
    this.resizer = new Resizer({
      orientation: 'horizontal',
      ref: t.oc,
      start: t.oc.offset().left + config.rowHeaderWidth,
      stop: t.oc.offset().left +
            config.rowHeaderWidth + t.bc.width(),
      id: 'resi',
      size: [6, config.rowHeight],
      resizerContainer: t.chc,
      overflowContainer: t.oc,
      scrollContainer: t.sc,
      positions: config.columnPositions,
      columns: config.columns
    });
    this.resizer.on('drag', function(event, resizer) {
      // may be to add column/row resize on the fly
    });
    this.resizer.on('stop', function(event, resizer) {
      // change row/column height/width
    });
  }
  function attachEventHandlers(){
    t.sc.scroll(scrollHandler);
    t.bc.mousewheel(mousewheelHandler);
    t.bt.keydown(keydownHandler);
    t.bt.mousedown(mousedownHandler);
  }
  function createFocusRect(){
    focusRect = new FocusRectangle({
      domRef : t.bc,
      offsetTop: config.rowHeight,
      offsetLeft: config.rowHeaderWidth
    });
  }
  function createSelectRect(){
    selectRect = new SelectRectangle({
      domRef : t.bc,
      offsetTop: config.rowHeight,
      offsetLeft: config.rowHeaderWidth});
  }
  //
  // update column header and row header containers when the body container is
  // scrolled; if enabled snap to column
  //
  function scrollHandler(event){
    var left;
    var top;
    var scrollLeft;

    if (config.scrollToSnap){
      top = config.rowHeight *
        Math.floor(t.sc.scrollTop() / config.rowHeight);
      left = 0;
      scrollLeft = t.sc.scrollLeft();
      if (scrollLeft === 0){
        left = 0;
        firstVisibleColumn = 1;
      }
      else if (scrollLeft > t.sc[0].scrollWidth - t.sc.width()){
        left = t.sc[0].scrollWidth - t.sc[0].clientWidth;
        firstVisibleColumn = config.columns;
      }
      else{
        for (var i = 0; i < config.columnPositions.length; i++){
          if (scrollLeft >= config.columnPositions[i] &&
              scrollLeft < config.columnPositions[i+1]){
            left = config.columnPositions[i];
            firstVisibleColumn = i + 1;
            break;
          }
        }
      }
    }
    else{
      left = t.sc.scrollLeft();
      top = t.sc.scrollTop();
    }
    config.scrollTop = top;
    config.scrollLeft = left;
    t.bc.scrollTop(top);
    t.rhc.scrollTop(top);
    t.bc.scrollLeft(left);
    t.chc.scrollLeft(left);
    selectRect.setScrollPosition({top: top, left: left});
    selectRect.update();
  }
  //
  // forward mousehweel to scrollcontainer
  //
  function mousewheelHandler(event, delta) {
    t.sc.scrollTop(
      t.sc.scrollTop() - delta * 3 * config.rowHeight);
  }
  //
  // update select and focus rectangle on focus
  //
  function focusHandler(event){
    if (event.target.id && event.target.id.indexOf('g-') === 0){
      focusRect.update(event.target);
      selectRect.update({from: event.target});
    }
  }
  function scrollRight(immediately){
    if (firstVisibleColumn < config.columns){
      if (immediately){
        t.sc.scrollLeft(config.columnPositions[firstVisibleColumn++]);
      }
      scrollTimerId = _.delay(scrollRight, 200, true);
      console.log('new scrollTimerId: ' + scrollTimerId);
    }
  }
  //
  // update select rectangle while drag is performed on the table's body
  // scroll if mouse outside table
  //
  function dragdropHandler(event){
    if (scrollTimerId > 0){
      clearTimeout(scrollTimerId);
    }
    if (event.target.id.indexOf('g-') === 0){
      selectRect.update({to: event.target});
    }
    else{
      if (event.clientX > (t.bc.width() + t.bc.offset().left)){
        scrollRight(false);
      }
    }
  }
  //
  // hide select rectangle and initiate dragdrop event handler for mouse
  // selection
  //
  function mousedownHandler(event){
    if (event.target.id.indexOf('g-') === 0){
      selectRect.hide();
      dragdrop.startSession(event);
      dragdrop.on('drag', dragdropHandler);
      dragdrop.on('stopSession', function(){
        clearTimeout(scrollTimerId);
      });
    }
  }
  function setFocus(){
    focusElement.focus();
  }
  //
  // move/hide rectangles and initiate input/functions
  //
  function keydownHandler(event) {
    var _s = event.target.id.split('-');
    var _e;
    var row;
    //
    // arrow keys
    //
    if (event.keyCode >= utils.key.left && event.keyCode <= utils.key.down){
      if (event.shiftKey){
        _s = selectRect.getFromTo()[1].attr('id').split('-');
      }
      if (event.keyCode == utils.key.up){
        _e = $('#g-' + (parseInt(_s[1], 10) - 1) + '-' + parseInt(_s[2], 10));
      }
      else if (event.keyCode == utils.key.down){
        _e = $('#g-' + (parseInt(_s[1], 10) + 1) + '-' + parseInt(_s[2], 10));
      }
      else if (event.keyCode == utils.key.left){
        _e = $('#g-' + parseInt(_s[1], 10) + '-' + (parseInt(_s[2], 10) - 1));
      }
      else if (event.keyCode == utils.key.right){
        _e = $('#g-' + parseInt(_s[1], 10) + '-' + (parseInt(_s[2], 10) + 1));
      }
      if (_e.length > 0 && event.shiftKey){
        selectRect.update({to: _e[0]});
        _e = null;
      }
    }
    else if (event.keyCode == utils.key.pageup){
      row = parseInt(_s[1], 10) - config.visibleRows;
      if (row < 1) {
        row = 1;
      }
      _e = $('#g-' + row + '-' + (parseInt(_s[2], 10)));
    }
    else if (event.keyCode == utils.key.pagedown){
      row = parseInt(_s[1], 10) + config.visibleRows;
      if (row > config.rows) {
        row = config.rows;
      }
      _e = $('#g-' + row + '-' + (parseInt(_s[2], 10)));
    }
    //
    // tabulator key
    //
    else if (event.keyCode == utils.key.tabulator){
      if (event.shiftKey){
        var _c = parseInt(_s[2], 10) - 1;
        if (_c < 1){
          if (parseInt(_s[1], 10) > 1){
            _e = $('#g-' + (parseInt(_s[1], 10) - 1) + '-' +
              event.target.parentNode.childNodes.length);
          }
        }
        else{
          _e = $('#g-' + parseInt(_s[1], 10) + '-' + (parseInt(_s[2], 10) - 1));
        }
      }
      else{
        _e = $('#g-' + parseInt(_s[1], 10) + '-' + (parseInt(_s[2], 10) + 1));
        if (_e[0] === undefined){
          _e = $('#g-' + (parseInt(_s[1], 10) + 1) + '-1');
        }
      }
      event.preventDefault();
    }
    //
    // delete key
    //
    else if (event.keyCode == utils.key.delete){
      _e = $('#g-' + parseInt(_s[1], 10) + '-' +
        (parseInt(_s[2], 10))).html('');
    }
    //
    // f2 key
    //
    else if (event.keyCode == utils.key.f2){
      _e = $('#g-' + parseInt(_s[1], 10) + '-' + (parseInt(_s[2], 10)));
      var _t = _e.html();
      _e.html('');
      var _i = $('<input id="ti" type="text" value="' +
        _t + '" spellcheck="false" />').appendTo(_e);
      _e.keydown(function inputKeydown(event){
        if (event.keyCode == utils.key.return){
          event.stopPropagation();
          var _v = event.target.value;
          var _i = $('#ti').unbind();
          var _e = $('#' + event.target.parentNode.id);
          _e.html(_v);
          // focusRef = _e[0].id;
          // window.setTimeout("document.getElementById(focusRef).focus();", 0);
          focusElement = _e[0];
          _.delay(setFocus);
          _i.remove();
        }
      });
      _e = _i;
    }
    if (_e !== undefined && _e[0] !== undefined){
      if (t.sc.scrollTop() > _e.position().top){
        t.sc.scrollTop(_e.position().top);
      }
      if (t.bc.scrollTop() + t.bc.height() <
        _e.position().top + _e.outerHeight()){
        t.sc.scrollTop(_e.position().top -
          t.bc.height() + _e.outerHeight());
      }
      if (t.sc.scrollLeft() > _e.position().left){
        t.sc.scrollLeft(_e.position().left);
      }
      if (t.bc.scrollLeft() + t.bc.width() <
        _e.position().left + _e.outerWidth()){
        t.sc.scrollLeft(_e.position().left +
          _e.outerWidth() - t.bc.width());
      }
      focusRect.update(_e[0]);
      selectRect.update({from: _e[0]});
      // focusRef = _e[0].id;
      // window.setTimeout("document.getElementById(focusRef).focus();", 0);
      focusElement = _e[0];
      _.delay(setFocus);
    }
  }
}
