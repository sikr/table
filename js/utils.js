// extending the array prototype
Array.prototype.sum = function(){
  return this.reduce(function(pv, cv) { return pv + cv; }, 0);
};
Array.prototype.rangeSum = function(start, stop){
  var _rv = 0;
  for (var i = start; i < stop; i++){
    _rv += this[i];
  }
  return _rv;
};
Array.prototype.progressiveSum = function(){
  var _rv = [];
  var s = 0;
  for (var i = 0; i < this.length; i++){
    s = s + this[i];
    _rv[i] = s;
  }
  return _rv;
};
Array.prototype.fill = function(value, count){
  var _rv = [];
  for (var i = 0; i < count; i++){
    _rv.push(value);
  }
  return _rv;
};

function Utils() {
  this.key = {
    'backspace' : 8,
    'tabulator' : 9,
    'return' : 13,
    'escape' : 27,
    'space' : 32,
    'pageup' : 33,
    'pagedown' : 34,
    'end' : 35,
    'position1' : 36,
    'left' : 37,
    'up' : 38,
    'right' : 39,
    'down' : 40,
    'insert' : 45,
    'delete' : 46,
    'f1' : 112,
    'f2' : 113,
    'f3' : 114,
    'f4' : 115,
    'f5' : 116,
    'f6' : 117,
    'f7' : 118,
    'f8' : 119,
    'f9' : 120,
    'f10' : 121
  };
  this.getRect = function(sourceTarget, currentTarget){
    var _r = {};
    if (currentTarget === null)
    {
      debugger;
    }
    var sp = sourceTarget.position();
    var cp = currentTarget.position();

    if (sp.top <= cp.top){
      _r.top =  sp.top;
      _r.height = cp.top - sp.top + currentTarget[0].clientHeight;
    }
    else{
      _r.top =  cp.top;
      _r.height = sp.top - cp.top + sourceTarget[0].clientHeight;
    }
    if (sp.left <= cp.left){
      _r.left =  sp.left;
      _r.width = cp.left - sp.left + currentTarget[0].clientWidth;
    }
    else{
      _r.left =  cp.left;
      _r.width = sp.left - cp.left + sourceTarget[0].clientWidth;
    }
//    console.log('sp.left: ' + sp.left + ', cp.left: ' + cp.left + ', sp.width: ' + sourceTarget[0].clientWidth + ', cp.width: ' + currentTarget[0].clientWidth);
//    console.log('top: ' + _r.top + ', left: ' + _r.left + ', height: ' + _r.height + ', width: ' + _r.width);
    return _r;
  };
}
utils = new Utils();