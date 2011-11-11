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
      var LineChartOptions;
LineChartOptions = (function() {
  LineChartOptions.DEFAULTS = {
    dot_size: 5,
    dot_color: "#00aadd",
    dot_stroke_color: "#fff",
    dot_stroke_size: 2,
    line_width: 3,
    line_color: "#00aadd",
    smoothing: 0.4,
    fill_area: true,
    area_color: "#00aadd",
    area_opacity: 0.2,
    label_max: true,
    label_min: true
  };
  function LineChartOptions(options) {
    var option, opts, value, _ref;
    opts = {};
    _ref = LineChartOptions.DEFAULTS;
    for (option in _ref) {
      value = _ref[option];
      opts[option] = value;
    }
    for (option in options) {
      value = options[option];
      if (options.hasOwnProperty(option)) {
        opts[option] = value;
      }
    }
    return opts;
  }
  return LineChartOptions;
})();var Tooltip;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
Tooltip = (function() {
  function Tooltip(r, target, text) {
    var height, offset, rounding, size, width, x, y, _ref;
    this.r = r;
    size = 30;
    width = 50;
    height = 25;
    offset = 10;
    rounding = 5;
    _ref = target.getBBox(), x = _ref.x, y = _ref.y;
    this.popup = this.r.rect(x - width / 2, y - (height + offset), width, height, rounding);
    this.popup.attr({
      "fill": "rgba(0,0,0,.4)",
      "fill-opacity": 0,
      "stroke": "transparent",
      "stroke-width": 0
    });
    this.text = this.r.text(x, y - (height / 2 + offset), text);
    this.text.attr({
      "fill": "#fff",
      "font-size": 14,
      "text-anchor": "middle",
      "width": width,
      "height": height,
      "fill-opacity": 0,
      "font-weight": "bold"
    });
    target.mouseover(__bind(function() {
      return this.show();
    }, this));
    target.mouseout(__bind(function() {
      return this.hide();
    }, this));
  }
  Tooltip.prototype.animate_opacity = function(element, value, time) {
    if (time == null) {
      time = 200;
    }
    return element.animate({
      "fill-opacity": value
    }, time);
  };
  Tooltip.prototype.hide = function() {
    this.animate_opacity(this.popup, 0);
    return this.animate_opacity(this.text, 0);
  };
  Tooltip.prototype.show = function() {
    this.animate_opacity(this.popup, 0.8);
    return this.animate_opacity(this.text, 1);
  };
  return Tooltip;
})();var Scaling;
Scaling = (function() {
  function Scaling() {}
  Scaling.get_ranges_for_points = function(points) {
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
  Scaling.scale_points = function(x_max, y_max, points, padding) {
    var max_x, max_y, min_x, min_y, padded_x_max_range, padded_y_max_range, point, scaled_points, sx, sy, x_range, x_scaling_factor, y_range, y_scaling_factor, _i, _len, _ref;
    _ref = Scaling.get_ranges_for_points(points), max_x = _ref[0], min_x = _ref[1], max_y = _ref[2], min_y = _ref[3];
    padded_x_max_range = x_max - 2 * padding;
    padded_y_max_range = y_max - 2 * padding;
    x_range = max_x - min_x;
    y_range = max_y - min_y;
    x_scaling_factor = padded_x_max_range / x_range;
    y_scaling_factor = padded_y_max_range / y_range;
    scaled_points = [];
    for (_i = 0, _len = points.length; _i < _len; _i++) {
      point = points[_i];
      sx = x_scaling_factor * point.x + padding;
      sy = y_max - (y_scaling_factor * point.y + padding);
      scaled_points.push(new Point(sx, sy));
    }
    return scaled_points;
  };
  return Scaling;
})();var Point;
Point = (function() {
  function Point(x, y) {
    this.x = x;
    this.y = y;
  }
  return Point;
})();var Dot;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
Dot = (function() {
  function Dot(r, point, opts, scale_factor) {
    this.r = r;
    this.point = point;
    this.opts = opts;
    this.scale_factor = scale_factor != null ? scale_factor : 1.5;
    this.element = this.r.circle(point.x, point.y, this.opts.dot_size);
    this.style_dot();
    this.attach_handlers();
  }
  Dot.prototype.style_dot = function() {
    return this.element.attr({
      "fill": this.opts.dot_color,
      "stroke": this.opts.dot_stroke_color,
      "stroke-width": this.opts.dot_stroke_size
    });
  };
  Dot.prototype.activate = function() {
    this.element.attr({
      "fill": "#333"
    });
    return this.element.animate({
      "r": this.opts.dot_size * this.scale_factor
    }, 200);
  };
  Dot.prototype.deactivate = function() {
    var shrink_factor;
    shrink_factor = 1 / this.scale_factor;
    this.element.attr({
      "fill": this.opts.dot_color
    });
    return this.element.animate({
      "r": this.opts.dot_size
    }, 200);
  };
  Dot.prototype.attach_handlers = function() {
    this.element.mouseover(__bind(function() {
      return this.activate();
    }, this));
    return this.element.mouseout(__bind(function() {
      return this.deactivate();
    }, this));
  };
  return Dot;
})();var Bezier;
Bezier = (function() {
  function Bezier() {}
  Bezier.create_path = function(points, smoothing) {
    var b1, b2, i, path, point, _len, _ref;
    if (smoothing == null) {
      smoothing = 0.7;
    }
    path = "";
    for (i = 0, _len = points.length; i < _len; i++) {
      point = points[i];
      if (i === 0) {
        path += "M" + point.x + "," + point.y;
      } else {
        _ref = Bezier.get_control_points(points, i - 1, smoothing), b1 = _ref[0], b2 = _ref[1];
        path += "M" + points[i - 1].x + "," + points[i - 1].y + " C" + b1.x + "," + b1.y + " " + b2.x + "," + b2.y + " " + points[i].x + "," + points[i].y;
      }
    }
    return path;
  };
  Bezier.get_control_points = function(points, i, smoothing) {
    var b1, b2, d1, d2;
    d1 = Bezier.get_control_point(points, i, smoothing);
    d2 = Bezier.get_control_point(points, i + 1, smoothing);
    b1 = new Point(points[i].x + d1.x / 3, points[i].y + d1.y / 3);
    b2 = new Point(points[i + 1].x - d2.x / 3, points[i + 1].y - d2.y / 3);
    return [b1, b2];
  };
  Bezier.get_control_point = function(points, i, smoothing_factor) {
    var i1, i2;
    if (points.length < 2) {
      throw "Error";
    }
    i1 = i + 1;
    i2 = i - 1;
    if (i === 0) {
      i1 = 1;
      i2 = 0;
    } else if (i === (points.length - 1)) {
      i1 = i;
      i2 = i - 1;
    }
    return new Point((points[i1].x - points[i2].x) * smoothing_factor, (points[i1].y - points[i2].y) * smoothing_factor);
  };
  return Bezier;
})();var LineChart;
LineChart = (function() {
  function LineChart(dom_id, options) {
    if (options == null) {
      options = {};
    }
    this.container = document.getElementById(dom_id);
    this.width = parseInt(this.container.style.width);
    this.height = parseInt(this.container.style.height);
    this.padding = 40;
    this.options = new LineChartOptions(options);
    this.r = Raphael(this.container, this.width, this.height);
  }
  LineChart.prototype.add_line = function(raw_points, options) {
    this.raw_points = raw_points;
    if (options == null) {
      options = {};
    }
    return this.points = Scaling.scale_points(this.width, this.height, this.raw_points, this.padding);
  };
  LineChart.prototype.draw_curve = function() {
    var path;
    path = this.r.path(Bezier.create_path(this.points, this.options.smoothing));
    return path.attr({
      "stroke": this.options.line_color,
      "stroke-width": this.options.line_width
    });
  };
  LineChart.prototype.draw_area = function() {
    var final_point, first_point, i, padded_height, padded_width, path, point, _len, _ref;
    padded_height = this.height;
    padded_width = this.width + this.padding;
    final_point = this.points[this.points.length - 1];
    first_point = this.points[0];
    path = "";
    _ref = this.points;
    for (i = 0, _len = _ref.length; i < _len; i++) {
      point = _ref[i];
      if (i === 0) {
        path += "M " + first_point.x + ", " + first_point.y;
      } else {
        path += "L " + point.x + ", " + point.y;
      }
    }
    path += "M " + final_point.x + ", " + final_point.y;
    path += "L " + final_point.x + ", " + padded_height;
    path += "L " + first_point.x + ", " + padded_height;
    path += "L " + first_point.x + ", " + first_point.y;
    path += "Z";
    return this.r.path(path).attr({
      "fill": this.options.area_color,
      "fill-opacity": this.options.area_opacity,
      "stroke": "none"
    });
  };
  LineChart.prototype.draw = function() {
    var dots, i, max_point, min_point, point, tooltips, _len, _ref;
    this.r.clear();
    this.draw_curve();
    if (this.options.fill_area) {
      this.draw_area();
    }
    tooltips = [];
    dots = [];
    max_point = 0;
    min_point = 0;
    _ref = this.points;
    for (i = 0, _len = _ref.length; i < _len; i++) {
      point = _ref[i];
      dots.push(new Dot(this.r, point, this.options));
      tooltips.push(new Tooltip(this.r, dots[i].element, this.raw_points[i].y));
      if (this.raw_points[i].y >= this.raw_points[max_point].y) {
        max_point = i;
      }
      if (this.raw_points[i] > this.raw_points[min_point].y) {
        min_point = i;
      }
    }
    if (this.options.label_max) {
      tooltips[max_point].show();
      dots[max_point].activate();
    }
    if (this.options.label_min) {
      tooltips[min_point].show();
      dots[min_point].activate();
    }
  };
  return LineChart;
})();var create_random_points, create_random_points2, draw_bars;
create_random_points = function() {
  var i, points;
  points = (function() {
    var _results;
    _results = [];
    for (i = 0; i <= 25; i++) {
      _results.push(new Point(i, i * (i - 1)));
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
  return points;
};
create_random_points2 = function() {
  var i, points;
  points = (function() {
    var _results;
    _results = [];
    for (i = 0; i <= 25; i++) {
      _results.push(new Point(i, Math.random() * i));
    }
    return _results;
  })();
  return points;
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
    _results.push(new Tooltip(r, rect, Math.floor(points[i].y)));
  }
  return _results;
};
window.onload = function() {
  var c, chart2, height, padding, points, r2, raw_points, width, _ref;
  raw_points = create_random_points();
  c = new LineChart('chart1');
  c.add_line(raw_points);
  c.draw();
  c = new LineChart('chart2', {
    line_color: "#118800",
    dot_color: "#118800",
    dot_stroke_color: "#aaa",
    dot_stroke_size: 3,
    label_min: false,
    fill_area: false,
    smoothing: 0.5
  });
  c.add_line(create_random_points2());
  c.draw();
  c = new LineChart('chart4', {
    line_color: "#9900cc",
    dot_color: "#000",
    dot_size: 7,
    dot_stroke_color: "#9900cc",
    dot_stroke_size: 2,
    label_min: false,
    label_max: false,
    fill_area: false,
    smoothing: 0
  });
  c.add_line(create_random_points2());
  c.draw();
  chart2 = document.getElementById('chart3');
  _ref = [1000, 300, 25], width = _ref[0], height = _ref[1], padding = _ref[2];
  r2 = Raphael(chart2, width, height);
  points = Scaling.scale_points(width, height, raw_points, padding);
  return draw_bars(r2, points);
};
    })
