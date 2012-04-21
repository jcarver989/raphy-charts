function progress_chart() {
  var purple = '#6a329e';
  var blue   = '#00a6dd';
  var green  = '#659e32';
  var orange = '#b85d26';

  var progress_opts = {
    font_color: "#fff",
    fill_color: "#222",
    label_color: "#333",
    background_color: "#00aadd",
    text_shadow: "rgba(0,0,0,.4)"
  };


  clear_chart('progress-1');
  clear_chart('progress-2');
  clear_chart('progress-3');
  clear_chart('progress-4');

  var progress1 = new Charts.CircleProgress('progress-1', 'Sales', 80, $.extend({ stroke_color: purple }, progress_opts));
  progress1.draw()

  var progress2 = new Charts.CircleProgress('progress-2', 'Marketing', 30, $.extend({ stroke_color: blue}, progress_opts));
  progress2.draw()

  var progress3 = new Charts.CircleProgress('progress-3', 'Engineering', 50, $.extend({ stroke_color: green }, progress_opts));
  progress3.draw()

  var progress4 = new Charts.CircleProgress('progress-4', 'Executives', 25, $.extend({ stroke_color: orange }, progress_opts));
  progress4.draw()
}


$(document).ready(function() {
  $("#progress-charts").bind('draw', function() {
    progress_chart();
  });
});
