function time_series_barchart() {
  clear_chart('barchart');

  var c = new Charts.LineChart('barchart', {
    line_color: "90-#0a5200-#118800",
    label_min: false,
    show_grid: true,
    render: "bar",
    bar_width: 32
  });

  c.add_line({
    data: create_random_points()
  });

  c.draw();
}


function barchart() {
  clear_chart('normalbarchart');

  var bars = new Charts.BarChart('normalbarchart', {
    x_label_color: "#333333",
    bar_width: 45,
    rounding: 10,
  });

  bars.add({
    label: "foo",
    value: 600
  });

  bars.add({
    label: "moo",
    value: 800,
    options: {
      bar_color: "#53ba03"
    }
  });

  bars.add({
    label: "doo",
    value: 300
  });

  bars.draw();
}

$(document).ready(function() {
  $("#bar-charts").bind('draw', function() {
    time_series_barchart();
    barchart();
  });
});
