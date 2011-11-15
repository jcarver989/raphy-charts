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
    label_min: true,
    step_size: 3,
    x_padding: 25,
    y_padding: 40
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
    min_x = Math.min.apply(Math.min, xs);
    min_y = Math.min.apply(Math.min, ys);
    return [max_x, min_x, max_y, min_y];
  };
  /*
    Helper for mapping numbers into a new range:
    existing range: A to B
    target range: C to D
    R1 = B - A
    R2 = D - C
    new number = (B*C - A*D)/R1 + old_number *(R2/R1) 
    returns [(B*C - A*D) / R1, R2/R1)]
    */
  Scaling.calc_scaling_factors = function(old_max, old_min, new_max, new_min) {
    var new_range, old_range, scaling_factor;
    old_range = old_max - old_min;
    new_range = new_max - new_min;
    scaling_factor = old_max * new_min - new_max * old_min;
    return [scaling_factor / old_range, new_range / old_range];
  };
  Scaling.scale_points = function(x_max, y_max, points, x_padding, y_padding) {
    var max_x, max_y, min_x, min_y, point, scaled_points, sx, sy, x_range_ratio, x_scaling, y_range_ratio, y_scaling, _i, _len, _ref, _ref2, _ref3;
    _ref = Scaling.get_ranges_for_points(points), max_x = _ref[0], min_x = _ref[1], max_y = _ref[2], min_y = _ref[3];
    _ref2 = Scaling.calc_scaling_factors(max_x, min_x, x_max - x_padding, x_padding), x_scaling = _ref2[0], x_range_ratio = _ref2[1];
    _ref3 = Scaling.calc_scaling_factors(max_y, min_y, y_max - y_padding, y_padding), y_scaling = _ref3[0], y_range_ratio = _ref3[1];
    scaled_points = [];
    for (_i = 0, _len = points.length; _i < _len; _i++) {
      point = points[_i];
      sx = x_scaling + point.x * x_range_ratio;
      sy = y_max - (y_scaling + point.y * y_range_ratio);
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
})();var Tooltip;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
Raphael.fn.triangle = function(cx, cy, r) {
  r *= 1.75;
  return this.path("M".concat(cx, ",", cy, "m0-", r * .58, "l", r * .5, ",", r * .87, "-", r, ",0z"));
};
Tooltip = (function() {
  function Tooltip(r, target, text) {
    var box, box_height, box_midpoint, box_width, height, offset, rounding, size, width, x, y;
    this.r = r;
    size = 30;
    width = 50;
    height = 25;
    offset = 10;
    rounding = 5;
    box = target.getBBox();
    x = box.x;
    y = box.y;
    box_width = box.width;
    box_height = box.height;
    box_midpoint = x + box_width / 2;
    this.popup = this.r.set();
    this.popup.push(this.r.rect(box_midpoint - width / 2, y - (height + offset), width, height, rounding));
    this.popup.push(this.r.triangle(box_midpoint, y - offset + 4, 4).rotate(180));
    this.popup.attr({
      "fill": "rgba(0,0,0,.4)",
      "fill-opacity": 0,
      "stroke": "transparent",
      "stroke-width": 0
    });
    this.text = this.r.text(box_midpoint, y - (height / 2 + offset), text);
    this.text.attr({
      "fill": "#fff",
      "font-size": 14,
      "text-anchor": "middle",
      "width": width,
      "height": height,
      "fill-opacity": 0,
      "font-weight": "bold"
    });
    this.popup.toFront();
    this.text.toFront();
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
    }, time, __bind(function() {
      if (value === 0) {
        this.text.toBack();
        return this.popup.toBack();
      }
    }, this));
  };
  Tooltip.prototype.hide = function() {
    this.animate_opacity(this.popup, 0);
    return this.animate_opacity(this.text, 0);
  };
  Tooltip.prototype.show = function() {
    this.popup.toFront();
    this.text.toFront();
    this.animate_opacity(this.popup, 0.8);
    return this.animate_opacity(this.text, 1);
  };
  return Tooltip;
})();var Label;
Label = (function() {
  function Label(r, height, x, text) {
    this.r = r;
    this.height = height;
    this.x = x;
    this.text = text;
    this.size = 14;
  }
  Label.prototype.is_date = function(potential_date) {
    return Object.prototype.toString.call(potential_date) === '[object Date]';
  };
  Label.prototype.parse_date = function(date) {
    return "" + (date.getMonth() + 1) + "/" + (date.getDate());
  };
  Label.prototype.draw = function() {
    var text;
    text = this.is_date(this.text) ? this.parse_date(this.text) : this.text;
    this.element = this.r.text(this.x, this.height - this.size, text);
    return this.element.attr({
      "fill": "#333",
      "font-size": this.size,
      "font-weight": "bold"
    });
  };
  return Label;
})();var Grid;
Grid = (function() {
  function Grid(r, width, height, points, options) {
    this.r = r;
    this.width = width;
    this.height = height;
    this.points = points;
    this.options = options;
  }
  Grid.prototype.draw = function() {
    var grid_lines, height, i, paths, point, width, x, x_step_size, y, y_step_size, _len, _ref;
    grid_lines = Math.round(this.points.length / this.options.step_size);
    height = this.height - this.options.y_padding;
    width = this.width - this.options.x_padding;
    x_step_size = Math.round(width / grid_lines);
    y_step_size = Math.round(height / grid_lines);
    y = this.options.y_padding;
    paths = this.r.set();
    _ref = this.points;
    for (i = 0, _len = _ref.length; i < _len; i++) {
      point = _ref[i];
      if (i % this.options.step_size === 0) {
        x = this.points[i].x;
        paths.push(this.r.path("M " + x + ", " + this.options.y_padding + " L " + x + ", " + height + " Z"));
      }
    }
    for (i = 0; 0 <= grid_lines ? i <= grid_lines : i >= grid_lines; 0 <= grid_lines ? i++ : i--) {
      if (y <= height) {
        paths.push(this.r.path("M " + this.options.x_padding + ", " + y + " L " + width + ", " + y + " Z"));
      }
      y += y_step_size;
    }
    return paths.attr({
      stroke: "#ccc",
      "stroke-width": 1
    }).toBack();
  };
  return Grid;
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
    this.element.attr({
      "fill": this.opts.dot_color,
      "stroke": this.opts.dot_stroke_color,
      "stroke-width": this.opts.dot_stroke_size
    });
    return this.element.toFront();
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
})();var Line;
Line = (function() {
  function Line(r, raw_points, scaled_points, height, width, options) {
    this.r = r;
    this.raw_points = raw_points;
    this.scaled_points = scaled_points;
    this.height = height;
    this.width = width;
    this.options = options != null ? options : {};
  }
  Line.prototype.draw = function() {
    if (this.options.fill_area) {
      this.draw_area();
    }
    this.draw_curve();
    this.draw_dots_and_tooltips(this.scaled_points, this.raw_points);
  };
  Line.prototype.draw_curve = function() {
    var curve;
    curve = this.r.path(Bezier.create_path(this.scaled_points, this.options.smoothing));
    return curve.attr({
      "stroke": this.options.line_color,
      "stroke-width": this.options.line_width
    }).toFront();
  };
  Line.prototype.draw_area = function() {
    var area, final_point, first_point, i, padded_height, path, point, points, _len;
    points = this.scaled_points;
    padded_height = this.height - this.options.y_padding;
    final_point = points[points.length - 1];
    first_point = points[0];
    path = "";
    for (i = 0, _len = points.length; i < _len; i++) {
      point = points[i];
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
    area = this.r.path(path);
    area.attr({
      "fill": this.options.area_color,
      "fill-opacity": this.options.area_opacity,
      "stroke": "none"
    });
    return area.toBack();
  };
  Line.prototype.draw_dots_and_tooltips = function() {
    var dots, i, max_point, min_point, point, raw_points, scaled_points, tooltips, _len;
    scaled_points = this.scaled_points;
    raw_points = this.raw_points;
    tooltips = [];
    dots = [];
    max_point = 0;
    min_point = 0;
    for (i = 0, _len = scaled_points.length; i < _len; i++) {
      point = scaled_points[i];
      dots.push(new Dot(this.r, point, this.options));
      tooltips.push(new Tooltip(this.r, dots[i].element, raw_points[i].y));
      if (raw_points[i].y >= raw_points[max_point].y) {
        max_point = i;
      }
      if (raw_points[i].y < raw_points[min_point].y) {
        min_point = i;
      }
    }
    if (this.options.label_max) {
      tooltips[max_point].show();
      dots[max_point].activate();
    }
    if (this.options.label_min) {
      tooltips[min_point].show();
      return dots[min_point].activate();
    }
  };
  return Line;
})();/*\
\*/
var LineChart;
LineChart = (function() {
  function LineChart(dom_id, options) {
    var container, _ref;
    if (options == null) {
      options = {};
    }
    container = document.getElementById(dom_id);
    _ref = this.get_dimensions(container), this.width = _ref[0], this.height = _ref[1];
    this.padding = 26;
    this.options = new LineChartOptions(options);
    this.r = Raphael(container, this.width, this.height);
    this.all_points = [];
    this.line_indices = [];
    this.line_options = [];
    this.labels = [];
  }
  LineChart.prototype.get_dimensions = function(container) {
    var height, width;
    width = parseInt(container.style.width);
    height = parseInt(container.style.height);
    return [width, height];
  };
  LineChart.prototype.add_line = function(args) {
    var points, points_count, x, y;
    points = (function() {
      var _len, _ref, _results;
      _ref = args.data;
      _results = [];
      for (x = 0, _len = _ref.length; x < _len; x++) {
        y = _ref[x];
        _results.push(new Point(x, y));
      }
      return _results;
    })();
    points_count = this.all_points.length;
    if (args.labels != null) {
      this.labels = args.labels;
    }
    this.line_indices.push([points_count, points_count + points.length - 1]);
    this.all_points.push.apply(this.all_points, points);
    this.line_options.push(new LineChartOptions(args.options || this.options));
  };
  LineChart.prototype.draw_grid = function(points) {
    var grid;
    grid = new Grid(this.r, this.width, this.height, points, this.options);
    return grid.draw();
  };
  LineChart.prototype.draw_labels = function(points) {
    var i, point, _len, _results;
    _results = [];
    for (i = 0, _len = points.length; i < _len; i++) {
      point = points[i];
      _results.push(i % this.options.step_size === 0 ? new Label(this.r, this.height, point.x, this.labels[i]).draw() : void 0);
    }
    return _results;
  };
  LineChart.prototype.draw_line = function(raw_points, points, options) {
    return new Line(this.r, raw_points, points, this.height, this.width, options).draw();
  };
  LineChart.prototype.draw = function() {
    var begin, end, i, line_indices, options, points, raw_points, _len, _ref;
    this.r.clear();
    this.scaled_points = Scaling.scale_points(this.width, this.height, this.all_points, this.options.x_padding, this.options.y_padding);
    _ref = this.line_indices;
    for (i = 0, _len = _ref.length; i < _len; i++) {
      line_indices = _ref[i];
      begin = line_indices[0], end = line_indices[1];
      points = this.scaled_points.slice(begin, (end + 1) || 9e9);
      raw_points = this.all_points.slice(begin, (end + 1) || 9e9);
      options = this.line_options[i];
      this.draw_line(raw_points, points, options);
      if (i === 0) {
        if (this.options.show_grid === true) {
          this.draw_grid(points);
        }
        if (this.labels.length === points.length) {
          this.draw_labels(points);
        }
      }
    }
  };
  return LineChart;
})();
    })
