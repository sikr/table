    // poc: write sample data to table
    var i;
    var row = 1;
    var col = 1;
    for (var i in sampleData){
      col = 1;
      $('#g-' + row + '-' + col++).html(sampleData[i].name)
      $('#g-' + row + '-' + col++).html(sampleData[i].isin)
      $('#g-' + row++ + '-' + col++).html(sampleData[i].wkn)
    }
    $('#g-' + row++ + '-' + col++).html(
      'Das ist ein Testtext, mal sehen, wie er dargestellt wird');

    // poc: optimized column width
    var maxWidth = [];
    for (var c = 0; c < this.columns; c++){
      maxWidth[c] = 0;
      for (var r = 0; r < this.rows; r++){
        var e = $('#g-' + parseInt(r+1, 10) + '-' + parseInt(c+1, 10));
        if (e[0].scrollWidth > maxWidth[c]){
          maxWidth[c] = e[0].scrollWidth;
        }
      }
    }
