(function() {
  var create_date, create_exponential_points, create_random_points2, create_squared_points, draw_bars;
  create_date = function(day) {
    var d;
    d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), day + 1);
  };
  create_exponential_points = function() {
    var i, _results;
    _results = [];
    for (i = 0; i <= 25; i++) {
      _results.push([create_date(i), i * 4.]);
    }
    return _results;
  };
  create_squared_points = function() {
    var i, _results;
    _results = [];
    for (i = 0; i <= 25; i++) {
      _results.push([create_date(i), i * (i - 1)]);
    }
    return _results;
  };
  create_random_points2 = function() {
    var i, _results;
    _results = [];
    for (i = 0; i <= 25; i++) {
      _results.push([create_date(i), Math.random() * i]);
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
    var c, charts;
    charts = Charts;
    c = new Charts.LineChart('chart1', {
      show_grid: true
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
      grid_lines: 4
    });
    c.add_line({
      data: create_random_points2()
    });
    return c.draw();
  };
}).call(this);
