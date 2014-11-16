$(document).ready(function(){
  console.time('table');

  var table = new Table({
    id: 'my',
    columns: 5,
    rows: 100,
    rowHeight: 21,
    width: parseInt($('body').css('width'), 10),
    height: parseInt($('body').css('height'), 10) - 50,
  });

  table.create();
  console.timeEnd('table');
  var c = $('<div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></div>').appendTo('body');
  table.appendTo(c);
});
