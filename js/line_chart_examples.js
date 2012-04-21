function create_date(day) {
  var d;
  d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), day + 1);
};

function create_exponential_points() {
  var i, _results;
  _results = [];
  for (i = 0; i <= 25; i++) {
    _results.push([create_date(i), i * 4.]);
  }
  return _results;
};

function create_squared_points() {
  var i, _results;
  _results = [];
  for (i = 0; i <= 25; i++) {
    _results.push([create_date(i), i * (i - 1)]);
  }
  return _results;
};

function create_random_points() {
  var i, _results;
  _results = [];
  for (i = 0; i <= 25; i++) {
    _results.push([create_date(i), Math.random() * i]);
  }
  return _results;
};

function clear_chart(id) {
  $("#" + id).html("")
}

function line_chart_1() {
  clear_chart('line-chart-1');

  var c = new Charts.LineChart('line-chart-1', {
    show_grid: false,
    show_y_labels: false
  });

  c.add_line({
    data: create_exponential_points(),
    options: {
      line_color: "#55bb00",
      area_color: "#55bb00",
      dot_color: "#55bb00"
    }

  });

  c.add_line({
    data: create_squared_points()
  });

  c.draw();
}



function line_chart_3() {
  clear_chart('areanoline');

  var  c = new Charts.LineChart('areanoline', {
    line_width: 1,
    label_min: true,
    label_max: true,
    show_grid: true,
    area_opacity: 0,
    max_y_labels: 10
  });

  c.add_line({
    data: create_random_points()
  });

  c.draw();
}


function multiaxis_chart() {
  var colors = [
    "#00aadd",
    "#ffee33",
    "#ff3366",
    "#00cc33"
  ]

  clear_chart('multiaxis');

  var multi_axis = new Charts.LineChart('multiaxis', {
    show_grid: true,
    show_y_labels: true,
    label_max: false,
    label_min: false,
    multi_axis: true,
    max_y_labels: 4,
    x_padding: 45 
  });

  multi_axis.add_line({
    data: [[1, 828906],[2, 566933],[3, 584150],[4, 1072143],[5, 1622455],[6, 2466746],[7, 2427789]],
    options: {
      line_color: colors[0],
      dot_color: colors[0],
      area_color: "230-#88c9dd-rgba(255,255,255,0)",
      area_opacity: 0.2,
      dot_size: 5,
      line_width: 4 
    }
  });

  multi_axis.add_line({
    data: [[1, 305],[2, 336],[3, 378],[4, 449],[5, 635],[6, 935],[7, 782]],
    options: {
      line_color: colors[1],
      dot_color: colors[1],
      fill_area: false,
      line_width: 2,
      dot_size: 3
    }
  });

  multi_axis.draw()
}


function sparklines_chart() {

  sparkline_options = {
    show_x_labels: false,
    show_y_labels: false,
    show_grid: false,
    smoothing: 0,
    label_min: false,
    label_max: false,
    dot_size: 0,
    dot_stroke_size: 0,
    x_padding: 10,
    y_padding: 5,
    line_color: "#00bbee",
    area_color: "#00bbee"
  };


  clear_chart('sparkline-visitors');

  visitors_chart = new Charts.LineChart('sparkline-visitors', sparkline_options);

  visitors_chart.add_line({
    data: create_random_points()
  });

  visitors_chart.draw();

  clear_chart('sparkline-signups');

  signups_chart = new Charts.LineChart('sparkline-signups', sparkline_options);

  signups_chart.add_line({
    data: create_random_points(),
    options: {
      line_color: "#0066cc",
      area_color: "#0066cc",
      dot_color: "#0066cc"
    }
  });

  signups_chart.draw();

  clear_chart('sparkline-conversions');

  conversions_chart = new Charts.LineChart('sparkline-conversions', sparkline_options);
  conversions_chart.add_line({
    data: create_random_points(),
    options: {
      line_color: "#002299",
      area_color: "#002299",
      dot_color: "#002299"
    }
  });

  conversions_chart.draw();

}


$(document).ready(function() {
  
  $("#line-charts").bind('draw', function() {
    line_chart_1();
    multiaxis_chart();
    line_chart_3();
    sparklines_chart();
  });
});
