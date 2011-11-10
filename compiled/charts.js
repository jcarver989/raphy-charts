    var global =  window

if (global.module == undefined) {
  global.module = function(name, body) {
    var exports = global[name]
    if (exports == undefined) {
    global[name] = exports = {}
    }
    body(exports)
  }
}


    module('Charts', function(exports) {
      var Point, create_random_points, draw_bars, draw_bezier_path, get_control_points, get_derivitive, get_ranges_for_points, scale_points;
Point = (function() {
  function Point(x, y) {
    this.x = x;
    this.y = y;
  }
  return Point;
})();
get_ranges_for_points = function(points) {
  var max_x, max_y, min_x, min_y, point, xs, ys, _i, _len;
  xs = [];
  ys = [];
  for (_i = 0, _len = points.length; _i < _len; _i++) {
    point = points[_i];
    xs.push(point.x);
    ys.push(point.y);
  }
  max_x = Math.max.apply(Math.max, xs);
  max_y = Math.max.apply(Math.max, ys);
  min_x = Math.min.apply(Math.max, xs);
  min_y = Math.min.apply(Math.max, ys);
  return [max_x, min_x, max_y, min_y];
};
scale_points = function(width, height, points, padding) {
  var max_x, max_y, min_x, min_y, padded_height_range, padded_width_range, point, scaled_points, sx, sy, x_range, x_scaling_factor, y_range, y_scaling_factor, _i, _len, _ref;
  _ref = get_ranges_for_points(points), max_x = _ref[0], min_x = _ref[1], max_y = _ref[2], min_y = _ref[3];
  padded_width_range = width - 2 * padding;
  padded_height_range = height - 2 * padding;
  x_range = max_x - min_x;
  y_range = max_y - min_y;
  x_scaling_factor = padded_width_range / x_range;
  y_scaling_factor = padded_height_range / y_range;
  scaled_points = [];
  for (_i = 0, _len = points.length; _i < _len; _i++) {
    point = points[_i];
    sx = x_scaling_factor * point.x + padding;
    sy = y_scaling_factor * point.y + padding;
    scaled_points.push(new Point(sx, sy));
  }
  return scaled_points;
};
get_derivitive = function(points, i, tension) {
  var tension_factor;
  if (points.length < 2) {
    throw "Error";
  }
  tension_factor = 1 - tension;
  if (i === 0) {
    return new Point((points[1].x - points[0].x) * tension_factor, (points[1].y - points[0].y) * tension_factor);
  } else if (i === (points.length - 1)) {
    return new Point((points[i].x - points[i - 1].x) * tension_factor, (points[i].y - points[i - 1].y) * tension_factor);
  } else {
    return new Point((points[i + 1].x - points[i - 1].x) * tension_factor, (points[i + 1].y - points[i - 1].y) * tension_factor);
  }
};
get_control_points = function(points, i, tension) {
  var b1, b2, d1, d2;
  if (tension == null) {
    tension = 0.7;
  }
  d1 = get_derivitive(points, i, tension);
  d2 = get_derivitive(points, i + 1, tension);
  b1 = new Point(points[i].x + d1.x / 3, points[i].y + d1.y / 3);
  b2 = new Point(points[i + 1].x - d2.x / 3, points[i + 1].y - d2.y / 3);
  return [b1, b2];
};
create_random_points = function() {
  var i, points;
  points = (function() {
    var _results;
    _results = [];
    for (i = 0; i <= 25; i++) {
      _results.push(new Point(i, i * (i - 5)));
    }
    return _results;
  })();
  points.push(new Point(26, 30));
  points.push(new Point(27, 300));
  points.push(new Point(28, 800));
  points.push(new Point(29, 500));
  points.push(new Point(30, 600));
  points.push(new Point(31, 610));
  points.push(new Point(32, 620));
  return scale_points(1000, 300, points, 20);
};
draw_bezier_path = function(r, points) {
  var b1, b2, dot, i, path, point, _len, _ref;
  path = "";
  for (i = 0, _len = points.length; i < _len; i++) {
    point = points[i];
    dot = r.circle(point.x, point.y, 3);
    dot.attr("fill", "#00aadd");
    if (i === 0) {
      path += "M" + point.x + "," + point.y;
    } else {
      _ref = get_control_points(points, i - 1), b1 = _ref[0], b2 = _ref[1];
      path += "M" + points[i - 1].x + "," + points[i - 1].y + " C" + b1.x + "," + b1.y + " " + b2.x + "," + b2.y + " " + points[i].x + "," + points[i].y;
    }
  }
  return r.path(path);
};
draw_bars = function(r, points) {
  var i, point, rect, x, _len, _results;
  x = points[0].x;
  _results = [];
  for (i = 0, _len = points.length; i < _len; i++) {
    point = points[i];
    rect = r.rect(x - 15, point.y, 15, 300 - point.y);
    x += 16;
    _results.push(rect.attr({
      "fill": "#00aadd",
      "stroke": "transparent",
      "stroke-width": "0"
    }));
  }
  return _results;
};
window.onload = function() {
  var chart, chart2, points, r, r2;
  chart = document.getElementById('chart');
  chart2 = document.getElementById('chart2');
  points = create_random_points();
  r = Raphael(chart, 1000, 300);
  r2 = Raphael(chart2, 1000, 300);
  draw_bezier_path(r, points);
  draw_bars(r2, points);
  return exports.create_random_points = create_random_points;
};
    })
