(function() {
  var create_exponential_points, create_random_points2, create_squared_points, draw_bars;
  create_exponential_points = function() {
    var i, _results;
    var d = new Date()
    
    _results = [];
    for (i = 0; i <= 25; i++) {
      var date = new Date(d.getFullYear(), d.getMonth(), i+1)
      _results.push([date, i * 4]);
    }
    return _results;
  };
  create_squared_points = function() {
    var i, _results;
    var d = new Date()
    _results = [];
    for (i = 0; i <= 25; i++) {
      var date = new Date(d.getFullYear(), d.getMonth(), i+1)
      _results.push([date, i * (i - 1)]);
    }
    return _results;
  };
  create_random_points2 = function() {
    var i, _results;
    _results = [];
    var d = new Date()
    for (i = 0; i <= 25; i++) {
      var date = new Date(d.getFullYear(), d.getMonth(), i+1)
      _results.push([date, Math.random() * i]);
    }
    return _results;
  };
  draw_bars = function(r, points) {
    var attach_handler, i, point, rect, x, _len, _results;
    attach_handler = function(element) {
      element.mouseover(function() {
        return element.attr({
          "fill": "#333"
        });
      });
      return element.mouseout(function() {
        return element.attr({
          "fill": "#00aadd"
        });
      });
    };
    x = points[0].x;
    _results = [];
    for (i = 0, _len = points.length; i < _len; i++) {
      point = points[i];
      rect = r.rect(x - 15, point.y, 15, 300 - point.y);
      x += 16;
      rect.attr({
        "fill": "#00aadd",
        "stroke": "transparent",
        "stroke-width": "0"
      });
      attach_handler(rect);
      _results.push(new Charts.Tooltip(r, rect, Math.floor(points[i].y)));
    }
    return _results;
  };
  window.onload = function() {
    var c, charts, i;
    charts = Charts;
    c = new Charts.LineChart('chart1', {
        show_y_labels: true,
        show_grid: true
    });
    c.add_line({
      data: create_exponential_points(),
      options: {
        line_color: "#cc1100",
        area_color: "#cc1100",
        dot_color: "#cc1100",
      }
    });
    c.add_line({
      data: create_squared_points()
    });
    c.draw();
    c = new Charts.LineChart('chart2', {
      line_color: "#118800",
      dot_color: "#118800",
      area_color: "#118800",
      dot_stroke_color: "#aaa",
      dot_stroke_size: 3,
      label_min: false,
      smoothing: 0.5,
      show_grid: true
    });
    c.add_line({
      data: create_random_points2()
    });
    c.draw();
    c = new Charts.LineChart('chart4', {
      line_color: "#9900cc",
      dot_color: "#000",
      dot_size: 7,
      dot_stroke_color: "#9900cc",
      dot_stroke_size: 2,
      label_min: false,
      label_max: false,
      fill_area: false,
      smoothing: 0,
      show_grid: true,
      grid_lines: 4,
      label_format: "%I"
    });
    c.add_line({
      data: create_random_points2()
    });
    return c.draw();
  };
}).call(this);
