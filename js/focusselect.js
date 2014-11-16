function FocusRectangle(o) {
  'use strict';
  this.top = 0;
  this.left =  0;
  this.height = 0;
  this.width = 0;
  this.focusElement = null;
  this.ref = [];

  this.ref[0] = $('<div id="focus-rect-top" class="focus-rect"></div>').appendTo(o.domRef);
  this.ref[1] = $('<div id="focus-rect-right" class="focus-rect"></div>').appendTo(o.domRef);
  this.ref[2] = $('<div id="focus-rect-bottom" class="focus-rect"></div>').appendTo(o.domRef);
  this.ref[3] = $('<div id="focus-rect-left" class="focus-rect"></div>').appendTo(o.domRef);

  this.update = function (element) {
    if (element !== undefined) {
      this.focusElement = $('#' + element.id);
    }
    var position = utils.getRect(this.focusElement, this.focusElement);

    this.top = position.top - 1;
    this.left = position.left - 1;
    this.height = position.height;
    this.width = position.width;

    this.ref[0].css('top', this.top)
      .css('left', this.left)
      .css('height', '0px')
      .css('width', this.width)
      .show();
    this.ref[1].css('top', this.top)
      .css('left', this.left + this.width)
      .css('height', this.height)
      .css('width', '0px')
      .show();
    this.ref[2].css('top', this.top + this.height)
      .css('left', this.left)
      .css('height', '0px')
      .css('width', this.width)
      .show();
    this.ref[3].css('top', this.top)
      .css('left', this.left)
      .css('height', this.height)
      .css('width', '0px')
      .show();
  };
  this.hide = function () {
    this.ref[0].hide();
    this.ref[1].hide();
    this.ref[2].hide();
    this.ref[3].hide();
  };
  this.show = function () {
    this.ref[0].show();
    this.ref[1].show();
    this.ref[2].show();
    this.ref[3].show();
  };
  _.bindAll(this, 'update', 'show', 'hide');
}

function SelectRectangle(o) {
  'use strict';
  this.top = 0;
  this.left = 0;
  this.height = 0;
  this.width = 0;
  this.from = undefined;
  this.to = undefined;
  this.ref = null;
  this.borderRef = [];
  this.resizerRef = null;
  this.scrollTop = 0;
  this.scrollLeft = 0;
  this.visible = false;

  this.ref = $('<div id="select-rect" class="select-rect"></div>').appendTo(o.domRef);
  this.resizerRef = $('<div id="select-rect-resizer" class="select-rect-resizer"></div>').appendTo(o.domRef);
  this.borderRef[0] = $('<div id="select-rect-border-top" class="select-rect-border"></div>').appendTo(o.domRef);
  this.borderRef[1] = $('<div id="select-rect-border-right" class="select-rect-border"></div>').appendTo(o.domRef);
  this.borderRef[2] = $('<div id="select-rect-border-bottom" class="select-rect-border"></div>').appendTo(o.domRef);
  this.borderRef[3] = $('<div id="select-rect-border-left" class="select-rect-border"></div>').appendTo(o.domRef);

  this.update = function (range) {
    if (range !== undefined) {
      if (range.from !== undefined) {
        this.from = $('#' + range.from.id);
      }
      if (range.to !== undefined) {
        this.to = $('#' + range.to.id);
      }
      else {
        this.to = this.from;
      }
    }
    if (this.from !== undefined && this.to !== undefined) {
      var position = utils.getRect(this.from, this.to);

      this.top = position.top;
      this.left = position.left;
      this.height = position.height;
      this.width = position.width;
      if (this.from.attr('id') === this.to.attr('id')) {
        this.ref.hide();
      }
      else {
        this.ref.css('top', this.top)
          .css('left', this.left)
          .css('height', this.height)
          .css('width', this.width)
          .show();
      }
      this.borderRef[0].css('top', (this.top-1 < this.scrollTop)? this.top:this.top-1)
        .css('left', this.left)
        .css('height', '1px')
        .css('width', this.width)
        .show();
      this.borderRef[1].css('top', this.top)
        .css('left', this.left + this.width)
        .css('height', this.height)
        .css('width', '1px')
        .show();
      this.borderRef[2].css('top', this.top + this.height)
        .css('left', this.left)
        .css('height', '1px')
        .css('width', this.width)
        .show();
      this.borderRef[3].css('top', this.top)
        .css('left', (this.left-1 < this.scrollLeft)? this.left:this.left-1)
        .css('height', this.height)
        .css('width', '1px')
        .show();

      this.resizerRef.css('top', this.top + this.height - 3)
        .css('left', this.left + this.width - 3)
        .show();
    }
  };
  this.hide = function () {
    this.ref.hide();
    this.borderRef[0].hide();
    this.borderRef[1].hide();
    this.borderRef[2].hide();
    this.borderRef[3].hide();
    this.visible = false;
  };
  this.show = function () {
    this.ref.show();
    this.borderRef[0].show();
    this.borderRef[1].show();
    this.borderRef[2].show();
    this.borderRef[3].show();
    this.visible = true;
  };
  this.getFromTo = function () {
    return [this.from, this.to];
  };
  this.setScrollPosition = function (position) {
    this.scrollTop = position.top;
    this.scrollLeft = position.left;
  };
  _.bindAll(this, 'update', 'hide', 'getFromTo', 'setScrollPosition');
}
