function Dragdrop() {
  'use strict';
  var me = this;
  var domRef = null;
  this.startX = -1;
  this.startY = -1;
  this.sourceTarget = null;
  this.currentTarget = null;
  var callbacks = [];

  this.startSession = function(event) {
    this.domRef = event.target;
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.sourceTarget = event.target;
    this.currentTarget = event.target;
    $(window).mousemove(drag);
    $(window).mouseup(stopSession);
  };
  function drag(event) {
    event.stopPropagation();
    event.preventDefault();
    me.deltaX = event.clientX - me.startX;
    me.deltaY = event.clientY - me.startY;
    me.currentTarget = event.target;
    if (callbacks.drag){
      callbacks.drag(event, me);
    }
  }
  function stopSession(event) {
    $(window).unbind('mousemove');
    $(window).unbind('mouseup');
    if (callbacks.stopSession) {
      callbacks.stopSession(event, me);
    }
  }
  function addCallback(name, callback) {
    callbacks[name] = callback;
  }
  this.on = function(name, callback) {
    addCallback(name, callback);
  };
}
// _.bindAll(dragdrop, 'startSession', 'drag', 'stopSession', 'on');
