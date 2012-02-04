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
    show_x_labels: true,
    show_y_labels: true,
    label_max: true,
    label_min: true,
    max_x_labels: 10,
    max_y_labels: 3,
    font_family: "Helvetica, Arial, sans-serif",
    x_label_size: 14,
    y_label_size: 14,
    label_format: "%m/%d",
    show_grid: false,
    x_padding: 45,
    y_padding: 40,
    render: "line",
    bar_width: 20
  };

  LineChartOptions.merge = function(from, to) {
    var option, opts, value;
    if (from == null) from = {};
    if (to == null) to = {};
    opts = {};
    for (option in from) {
      value = from[option];
      opts[option] = value;
    }
    for (option in to) {
      value = to[option];
      if (to.hasOwnProperty(option)) opts[option] = value;
    }
    return opts;
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
      if (options.hasOwnProperty(option)) opts[option] = value;
    }
    return opts;
  }

  return LineChartOptions;

})();
var Tooltip;

Raphael.fn.triangle = function(cx, cy, r) {
  r *= 1.75;
  return this.path("M".concat(cx, ",", cy, "m0-", r * .58, "l", r * .5, ",", r * .87, "-", r, ",0z"));
};

Tooltip = (function() {

  function Tooltip(r, target, text, hover_enabled) {
    var box, box_height, box_midpoint, box_width, height, offset, rounding, size, width, x, y,
      _this = this;
    this.r = r;
    if (hover_enabled == null) hover_enabled = true;
    size = 30;
    width = 50;
    height = 25;
    offset = 10;
    rounding = 5;
    if (typeof text === "number") text = Math.round(text * 100) / 100;
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
    if (hover_enabled === true) {
      target.mouseover(function() {
        return _this.show();
      });
      target.mouseout(function() {
        return _this.hide();
      });
    }
  }

  Tooltip.prototype.animate_opacity = function(element, value, time) {
    var _this = this;
    if (time == null) time = 200;
    return element.animate({
      "fill-opacity": value
    }, time, function() {
      if (value === 0) {
        _this.text.toBack();
        return _this.popup.toBack();
      }
    });
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

})();

exports.Tooltip = Tooltip;
var Grid;

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
      if (!(i % this.options.step_size === 0)) continue;
      x = this.points[i].x;
      paths.push(this.r.path("M " + x + ", " + this.options.y_padding + " L " + x + ", " + height + " Z"));
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

})();
var Dot;

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
    var _this = this;
    this.element.mouseover(function() {
      return _this.activate();
    });
    return this.element.mouseout(function() {
      return _this.deactivate();
    });
  };

  return Dot;

})();
var BulletChartOptions;

BulletChartOptions = (function() {

  BulletChartOptions.DEFAULTS = {
    line_width: 4,
    line_color: "#000",
    area_color: "#00aadd",
    area_width: 20,
    area_opacity: 0.2,
    bar_margin: 8,
    show_average: true,
    average_width: 4,
    average_height: 8,
    average_color: "#000",
    font_family: "Helvetica, Arial, sans-serif",
    x_label_size: 14,
    y_label_size: 14,
    x_padding: 45,
    y_padding: 40
  };

  BulletChartOptions.merge = function(from, to) {
    var option, opts, value;
    if (from == null) from = {};
    if (to == null) to = {};
    opts = {};
    for (option in from) {
      value = from[option];
      opts[option] = value;
    }
    for (option in to) {
      value = to[option];
      if (to.hasOwnProperty(option)) opts[option] = value;
    }
    return opts;
  };

  function BulletChartOptions(options) {
    var option, opts, value, _ref;
    opts = {};
    _ref = BulletChartOptions.DEFAULTS;
    for (option in _ref) {
      value = _ref[option];
      opts[option] = value;
    }
    for (option in options) {
      value = options[option];
      if (options.hasOwnProperty(option)) opts[option] = value;
    }
    return opts;
  }

  return BulletChartOptions;

})();
var Label, LabelFactory;

LabelFactory = (function() {

  function LabelFactory(r, format) {
    this.r = r;
    this.format = format != null ? format : "";
    this.num = 0;
    this.font_family = "Helvetica, Arial, sans-serif";
    this.color = "#333";
  }

  LabelFactory.prototype.x = function(x_func) {
    this.x_func = x_func;
    return this;
  };

  LabelFactory.prototype.y = function(y_func) {
    this.y_func = y_func;
    return this;
  };

  LabelFactory.prototype.size = function(size) {
    this.size = size;
    return this;
  };

  LabelFactory.prototype.attr = function(options) {
    this.options = options;
    return this;
  };

  LabelFactory.prototype.build = function(text) {
    var label;
    label = new Label(this.r, this.x_func(this.num), this.y_func(this.num), text, this.format, this.size, this.font_family, this.color, this.options);
    this.num += 1;
    return label;
  };

  return LabelFactory;

})();

Label = (function() {

  function Label(r, x, y, text, format, size, font_family, color, options) {
    this.r = r;
    this.x = x;
    this.y = y;
    this.text = text;
    this.format = format != null ? format : "";
    this.size = size != null ? size : 14;
    this.font_family = font_family != null ? font_family : "Helvetica, Arial, sans-serif";
    this.color = color != null ? color : "#333";
    this.options = options != null ? options : void 0;
  }

  Label.prototype.is_date = function(potential_date) {
    return Object.prototype.toString.call(potential_date) === '[object Date]';
  };

  Label.prototype.parse_date = function(date) {
    var formatted, groups, item, _i, _len;
    groups = this.format.match(/%([a-zA-Z])/g);
    formatted = this.format;
    for (_i = 0, _len = groups.length; _i < _len; _i++) {
      item = groups[_i];
      formatted = formatted.replace(item, this.parse_format(item));
    }
    return formatted;
  };

  Label.prototype.meridian_indicator = function(date) {
    var hour;
    hour = date.getHours();
    if (hour >= 12) {
      return "pm";
    } else {
      return "am";
    }
  };

  Label.prototype.to_12_hour_clock = function(date) {
    var fmt_hour, hour;
    hour = date.getHours();
    fmt_hour = hour % 12;
    if (fmt_hour === 0) {
      return 12;
    } else {
      return fmt_hour;
    }
  };

  Label.prototype.format_number = function(number) {
    var millions, thousands;
    if (number > 1000000) {
      millions = number / 1000000;
      millions = Math.round(millions * 100) / 100;
      return millions + "m";
    } else if (number > 1000) {
      thousands = number / 1000;
      return Math.round(thousands * 10) / 10 + "k";
    } else {
      return Math.round(number * 10) / 10;
    }
  };

  Label.prototype.fmt_minutes = function(date) {
    var minutes;
    minutes = date.getMinutes();
    if (minutes < 10) {
      return "0" + minutes;
    } else {
      return minutes;
    }
  };

  Label.prototype.parse_format = function(format) {
    switch (format) {
      case "%m":
        return this.text.getMonth() + 1;
      case "%d":
        return this.text.getDate();
      case "%Y":
        return this.text.getFullYear();
      case "%H":
        return this.text.getHours();
      case "%M":
        return this.fmt_minutes(this.text);
      case "%I":
        return this.to_12_hour_clock(this.text);
      case "%p":
        return this.meridian_indicator(this.text);
    }
  };

  Label.prototype.draw = function() {
    var margin, text, width, x;
    text = "";
    if (this.is_date(this.text)) {
      text = this.parse_date(this.text);
    } else if (typeof this.text === "number") {
      text = this.format_number(this.text);
    } else {
      text = this.text;
    }
    this.element = this.r.text(this.x, this.y, text);
    width = this.element.getBBox().width;
    margin = 5;
    this.element.attr({
      "fill": this.color,
      "font-size": this.size,
      "font-weight": "normal",
      "text-anchor": "middle",
      "font-family": this.font_family
    });
    if (this.options != null) {
      return this.element.attr(this.options);
    } else {
      x = this.x < width ? (width / 2) + margin : this.x;
      return this.element.attr({
        "x": x
      });
    }
  };

  return Label;

})();
var BarChartOptions;

BarChartOptions = (function() {

  BarChartOptions.DEFAULTS = {
    bar_width: 20,
    bar_spacing: 20,
    bar_color: "#00aadd",
    rounding: 0,
    font_family: "Helvetica, Arial, sans-serif",
    show_x_labels: true,
    show_y_labels: true,
    x_label_size: 14,
    x_label_color: "#333",
    y_label_size: 14,
    y_label_color: "#333",
    show_grid: false,
    x_padding: 25,
    y_padding: 40
  };

  BarChartOptions.merge = function(from, to) {
    var option, opts, value;
    if (from == null) from = {};
    if (to == null) to = {};
    opts = {};
    for (option in from) {
      value = from[option];
      opts[option] = value;
    }
    for (option in to) {
      value = to[option];
      if (to.hasOwnProperty(option)) opts[option] = value;
    }
    return opts;
  };

  function BarChartOptions(options) {
    var option, opts, value, _ref;
    opts = {};
    _ref = BarChartOptions.DEFAULTS;
    for (option in _ref) {
      value = _ref[option];
      opts[option] = value;
    }
    for (option in options) {
      value = options[option];
      if (options.hasOwnProperty(option)) opts[option] = value;
    }
    return opts;
  }

  return BarChartOptions;

})();
var Scaler, Scaling,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Scaler = (function() {

  function Scaler() {
    this.scale = __bind(this.scale, this);
  }

  Scaler.prototype.domain = function(points) {
    this.domain_min = Math.min.apply(Math.min, points);
    this.domain_max = Math.max.apply(Math.max, points);
    return this;
  };

  Scaler.prototype.range = function(points) {
    this.range_min = Math.min.apply(Math.min, points);
    this.range_max = Math.max.apply(Math.max, points);
    return this.scale;
  };

  Scaler.prototype.scale = function(value) {
    var domain_span, range_span, term1, term2;
    domain_span = this.domain_max - this.domain_min;
    range_span = this.range_max - this.range_min;
    term1 = (this.domain_max * this.range_min - this.domain_min * this.range_max) / domain_span;
    term2 = term1 + value * (range_span / domain_span);
    return term2;
  };

  return Scaler;

})();

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
    if (min_y === max_y) max_y += 1;
    if (min_x === max_x) max_x += 1;
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

})();

exports.Scaling = Scaling;
var LineBar;

LineBar = (function() {

  function LineBar(r, raw_points, scaled_points, height, width, options) {
    this.r = r;
    this.raw_points = raw_points;
    this.scaled_points = scaled_points;
    this.height = height;
    this.width = width;
    this.options = options != null ? options : {};
    this.effective_height = this.height - this.options.y_padding;
    this.x_offset = this.options.bar_width / 2;
  }

  LineBar.prototype.draw = function() {
    return this.draw_bars();
  };

  LineBar.prototype.draw_bars = function() {
    var i, max_point, min_point, point, rect, set, tooltips, x, _len, _ref;
    set = this.r.set();
    tooltips = [];
    max_point = 0;
    min_point = 0;
    _ref = this.scaled_points;
    for (i = 0, _len = _ref.length; i < _len; i++) {
      point = _ref[i];
      x = point.x - this.x_offset;
      rect = this.r.rect(x, point.y, this.options.bar_width, this.effective_height - point.y);
      set.push(rect);
      tooltips.push(new Tooltip(this.r, rect, this.raw_points[i].y));
      if (this.raw_points[i].y >= this.raw_points[max_point].y) max_point = i;
      if (this.raw_points[i].y < this.raw_points[min_point].y) min_point = i;
    }
    set.attr({
      "fill": this.options.line_color,
      "stroke": "none"
    });
    if (this.options.label_max) tooltips[max_point].show();
    if (this.options.label_min) return tooltips[min_point].show();
  };

  return LineBar;

})();
var Point;

Point = (function() {

  function Point(x, y) {
    this.y = y;
    if (this.is_date(x)) {
      this.x = x.getTime();
      this.is_date_type = true;
    } else {
      this.x = x;
    }
    return;
  }

  Point.prototype.is_date = function(potential_date) {
    return Object.prototype.toString.call(potential_date) === '[object Date]';
  };

  return Point;

})();

exports.Point = Point;
var Bezier;

Bezier = (function() {

  function Bezier() {}

  Bezier.create_path = function(points, smoothing) {
    var b1, b2, i, path, point, _len, _ref;
    if (smoothing == null) smoothing = 0.5;
    path = "M" + points[0].x + ", " + points[0].y;
    for (i = 0, _len = points.length; i < _len; i++) {
      point = points[i];
      if (i === 0) continue;
      _ref = Bezier.get_control_points(points, i - 1, smoothing), b1 = _ref[0], b2 = _ref[1];
      path += "C" + b1.x + "," + b1.y + " " + b2.x + "," + b2.y + " " + points[i].x + "," + points[i].y;
    }
    return path;
  };

  Bezier.get_control_points = function(points, i, smoothing, divisor) {
    var b1, b1_x, b1_y, b2, b2_x, b2_y, p0, p1, p2, p3, tan1_x, tan1_y, tan2_x, tan2_y, _ref, _ref2, _ref3, _ref4;
    if (divisor == null) divisor = 3;
    _ref = this.get_prev_and_next_points(points, i), p0 = _ref[0], p2 = _ref[1];
    _ref2 = this.get_prev_and_next_points(points, i + 1), p1 = _ref2[0], p3 = _ref2[1];
    _ref3 = this.get_tangent(p0, p2), tan1_x = _ref3[0], tan1_y = _ref3[1];
    _ref4 = this.get_tangent(p1, p3), tan2_x = _ref4[0], tan2_y = _ref4[1];
    b1_x = p1.x + (tan1_x * smoothing) / divisor;
    b1_y = p1.y + (tan1_y * smoothing) / divisor;
    b2_x = p2.x - (tan2_x * smoothing) / divisor;
    b2_y = p2.y - (tan2_y * smoothing) / divisor;
    b1 = new Point(b1_x, b1_y);
    b2 = new Point(b2_x, b2_y);
    return [b1, b2];
  };

  Bezier.get_prev_and_next_points = function(points, i) {
    var next, prev;
    prev = i - 1;
    next = i + 1;
    if (prev < 0) prev = 0;
    if (next >= points.length) next = points.length - 1;
    return [points[prev], points[next]];
  };

  Bezier.get_tangent = function(p0, p1) {
    var tan_x, tan_y;
    tan_x = p1.x - p0.x;
    tan_y = p1.y - p0.y;
    return [tan_x, tan_y];
  };

  return Bezier;

})();

exports.Bezier = Bezier;
var Line;

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
    var path;
    path = Bezier.create_path(this.scaled_points, this.options.smoothing);
    if (this.options.fill_area) this.draw_area(path);
    this.draw_curve(path);
    if (this.options.dot_size > 0) {
      this.draw_dots_and_tooltips(this.scaled_points, this.raw_points);
    }
  };

  Line.prototype.draw_curve = function(path) {
    var curve;
    curve = this.r.path(path);
    return curve.attr({
      "stroke": this.options.line_color,
      "stroke-width": this.options.line_width
    }).toFront();
  };

  Line.prototype.draw_area = function(path) {
    var area, final_point, first_point, padded_height, points;
    points = this.scaled_points;
    padded_height = this.height - this.options.y_padding;
    final_point = points[points.length - 1];
    first_point = points[0];
    path += "L " + final_point.x + ", " + padded_height + " ";
    path += "L " + first_point.x + ", " + padded_height + " ";
    path += "Z";
    area = this.r.path(path);
    area.attr({
      "fill": this.options.area_color,
      "fill-opacity": this.options.area_opacity,
      "stroke-width": 0
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
      if (raw_points[i].y >= raw_points[max_point].y) max_point = i;
      if (raw_points[i].y < raw_points[min_point].y) min_point = i;
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

})();
var BaseChart;

BaseChart = (function() {

  function BaseChart(dom_id, options) {
    var container, _ref;
    container = document.getElementById(dom_id);
    _ref = this.get_dimensions(container), this.width = _ref[0], this.height = _ref[1];
    this.r = Raphael(container, this.width, this.height);
    this.options = options;
  }

  BaseChart.prototype.get_dimensions = function(container) {
    var height, width;
    width = parseInt(container.style.width);
    height = parseInt(container.style.height);
    return [width, height];
  };

  return BaseChart;

})();
var LineChart,
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

LineChart = (function(_super) {

  __extends(LineChart, _super);

  function LineChart(dom_id, options) {
    if (options == null) options = {};
    LineChart.__super__.constructor.call(this, dom_id, new LineChartOptions(options));
    this.padding = 26;
    this.all_points = [];
    this.line_indices = [];
    this.line_options = [];
  }

  LineChart.prototype.add_line = function(args) {
    var pair, point_pairs, points, points_count;
    point_pairs = args.data;
    if (point_pairs.length < 1) return;
    points = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = point_pairs.length; _i < _len; _i++) {
        pair = point_pairs[_i];
        _results.push(new Point(pair[0], pair[1]));
      }
      return _results;
    })();
    points_count = this.all_points.length;
    this.line_indices.push([points_count, points_count + points.length - 1]);
    this.all_points.push.apply(this.all_points, points);
    this.line_options.push(LineChartOptions.merge(this.options, args.options));
  };

  LineChart.prototype.draw_grid = function(x_coordinates, y_coordinates) {
    var height, paths, val, width, _i, _j, _len, _len2;
    if (x_coordinates == null) x_coordinates = [];
    if (y_coordinates == null) y_coordinates = [];
    height = this.height - this.options.y_padding;
    width = this.width - this.options.x_padding;
    paths = this.r.set();
    for (_i = 0, _len = x_coordinates.length; _i < _len; _i++) {
      val = x_coordinates[_i];
      paths.push(this.r.path("M " + val + ", " + this.options.y_padding + " L " + val + ", " + height + " Z"));
    }
    for (_j = 0, _len2 = y_coordinates.length; _j < _len2; _j++) {
      val = y_coordinates[_j];
      paths.push(this.r.path("M " + this.options.x_padding + ", " + val + " L " + width + ", " + val + " Z"));
    }
    return paths.attr({
      stroke: "#ccc",
      "stroke-width": 1
    }).toBack();
  };

  LineChart.prototype._draw_y_labels = function(labels) {
    var fmt, font_family, i, label, label_coordinates, padding, scaled_labels, size, _len;
    fmt = this.options.label_format;
    size = this.options.y_label_size;
    font_family = this.options.font_family;
    padding = size + 5;
    scaled_labels = Scaling.scale_points(this.width, this.height, labels, this.options.x_padding, this.options.y_padding);
    label_coordinates = [];
    for (i = 0, _len = scaled_labels.length; i < _len; i++) {
      label = scaled_labels[i];
      new Label(this.r, padding, label.y, labels[i].y, fmt, size, font_family).draw();
      label_coordinates.push(label.y);
    }
    return label_coordinates;
  };

  LineChart.prototype.calc_y_label_step_size = function(min_y, max_y, max_labels) {
    var step_size;
    if (max_labels == null) max_labels = this.options.max_y_labels;
    step_size = (max_y - min_y) / (max_labels - 1);
    if (max_y > 1) {
      step_size = Math.round(step_size);
      if (step_size === 0) step_size = 1;
    }
    return step_size;
  };

  LineChart.prototype.draw_y_labels = function() {
    var labels, max_x, max_y, min_x, min_y, step_size, y, _ref;
    _ref = Scaling.get_ranges_for_points(this.all_points), max_x = _ref[0], min_x = _ref[1], max_y = _ref[2], min_y = _ref[3];
    if (max_y === min_y) return this._draw_y_labels([new Point(0, max_y)]);
    y = min_y;
    step_size = this.calc_y_label_step_size(min_y, max_y);
    labels = [];
    while (y <= max_y) {
      labels.push(new Point(0, y));
      y += step_size;
    }
    if (max_y > 1) labels[labels.length - 1].y = Math.round(max_y);
    return this._draw_y_labels(labels);
  };

  LineChart.prototype.draw_x_label = function(raw_point, point) {
    var fmt, font_family, label, size;
    fmt = this.options.label_format;
    size = this.options.x_label_size;
    font_family = this.options.font_family;
    label = raw_point.is_date_type === true ? new Date(raw_point.x) : Math.round(raw_point.x);
    return new Label(this.r, point.x, this.height - size, label, fmt, size, font_family).draw();
  };

  LineChart.prototype.draw_x_labels = function(raw_points, points) {
    var i, label_coordinates, last, len, max_labels, point, raw_point, rounded_step_size, step_size;
    label_coordinates = [];
    max_labels = this.options.max_x_labels;
    this.draw_x_label(raw_points[0], points[0]);
    label_coordinates.push(points[0].x);
    if (max_labels < 2) return;
    last = points.length - 1;
    this.draw_x_label(raw_points[last], points[last]);
    label_coordinates.push(points[last].x);
    if (max_labels < 3) return;
    len = points.length - 2;
    step_size = len / (max_labels - 1);
    rounded_step_size = Math.round(step_size);
    if (step_size !== rounded_step_size) step_size = rounded_step_size + 1;
    i = step_size;
    while (i < len) {
      raw_point = raw_points[i];
      point = points[i];
      this.draw_x_label(raw_point, point);
      label_coordinates.push(point.x);
      i += step_size;
    }
    return label_coordinates;
  };

  LineChart.prototype.draw_line = function(raw_points, points, options) {
    if (this.options.render === "bar") {
      return new LineBar(this.r, raw_points, points, this.height, this.width, options).draw();
    } else {
      return new Line(this.r, raw_points, points, this.height, this.width, options).draw();
    }
  };

  LineChart.prototype.draw = function() {
    var begin, end, i, line_indices, options, points, raw_points, _len, _ref;
    if (this.all_points.length < 1) return;
    this.r.clear();
    this.scaled_points = Scaling.scale_points(this.width, this.height, this.all_points, this.options.x_padding, this.options.y_padding);
    _ref = this.line_indices;
    for (i = 0, _len = _ref.length; i < _len; i++) {
      line_indices = _ref[i];
      begin = line_indices[0], end = line_indices[1];
      points = this.scaled_points.slice(begin, end + 1 || 9e9);
      raw_points = this.all_points.slice(begin, end + 1 || 9e9);
      options = this.line_options[i];
      this.draw_line(raw_points, points, options);
      if (i === 0) {
        if (this.options.show_x_labels === true) {
          this.x_label_coordinates = this.draw_x_labels(raw_points, points);
        }
        if (this.options.show_y_labels === true) {
          this.y_label_coordinates = this.draw_y_labels();
        }
        if (this.options.show_grid === true) {
          this.draw_grid(this.x_label_coordinates, this.y_label_coordinates);
        }
      }
    }
  };

  return LineChart;

})(BaseChart);

exports.LineChart = LineChart;
var IndexChart, bar_struct,
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

bar_struct = function(label, raw_value, index_value) {
  return {
    label: label,
    raw_value: raw_value,
    index_value: index_value
  };
};

IndexChart = (function(_super) {

  __extends(IndexChart, _super);

  function IndexChart(dom_id, options) {
    if (options == null) options = {};
    IndexChart.__super__.constructor.call(this, dom_id, options);
    this.bars = [];
    this.options = {
      bar_margin: 30,
      threshold: 1000,
      bar_color: "90-#2f5e78-#4284a8",
      beyond_avg_color: "90-#173e53-#225d7c",
      bg_color: "#bdced3",
      x_padding: 150,
      y_padding: 50,
      rounding: 3,
      dash_width: 3,
      font_family: "Helvetica, Arial, sans-serif"
    };
  }

  IndexChart.prototype.add = function(label, raw_value, index_value) {
    return this.bars.push(bar_struct(label, raw_value, index_value));
  };

  IndexChart.prototype.threshold = function(index_value) {
    if (index_value > this.options.threshold) {
      return this.options.threshold;
    } else {
      return index_value;
    }
  };

  IndexChart.prototype.set_bar_height = function() {
    var effective_height, margin, num_bars;
    num_bars = this.bars.length;
    margin = this.options.bar_margin;
    effective_height = this.height - this.options.y_padding;
    return this.bar_height = (effective_height / num_bars) - margin;
  };

  IndexChart.prototype.draw_bg_bar = function(raw_value, scaler, y) {
    var offset, padding, rect, x;
    x = scaler(raw_value);
    padding = 14;
    offset = Math.floor(padding / 2);
    rect = this.r.rect(this.options.x_padding - offset, y - offset, this.width, this.bar_height + padding, this.options.rounding);
    return rect.attr({
      fill: this.options.bg_color,
      "stroke-width": 0
    }).toBack();
  };

  IndexChart.prototype.draw_bar = function(raw_value, scaler, y) {
    var rect, x;
    x = scaler(this.threshold(raw_value));
    if (raw_value > 100) {
      rect = this.r.rect(this.options.x_padding, y, scaler(100) - this.options.x_padding, this.bar_height, this.options.rounding);
      rect.attr({
        fill: this.options.bar_color,
        "stroke-width": 0
      });
      rect = this.r.rect(scaler(100), y, x - scaler(100), this.bar_height, this.options.rounding);
      rect.attr({
        fill: this.options.beyond_avg_color,
        "stroke-width": 0
      });
    } else {
      rect = this.r.rect(this.options.x_padding, y, x - this.options.x_padding, this.bar_height, this.options.rounding);
      rect.attr({
        fill: this.options.bar_color,
        "stroke-width": 0
      });
    }
    this.r.path("M" + this.options.x_padding + "," + y + "L" + x + "," + y).attr({
      "stroke-width": 0.5,
      "stroke": "rgba(0,0,0,0.5)"
    });
    return this.r.path("M" + this.options.x_padding + "," + (y + 2) + "L" + x + "," + (y + 2)).attr({
      "stroke-width": 1,
      "stroke": "rgba(255,255,255,0.3)"
    });
  };

  IndexChart.prototype.draw_guide_line = function(label, index_value, x, opacity) {
    var i, rect, spacing, ticks, _ref;
    if (opacity == null) opacity = 1;
    spacing = 10;
    ticks = Math.floor((this.height - this.options.y_padding) / spacing);
    for (i = 0, _ref = ticks - 1; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
      if (i % 2 !== 0) continue;
      rect = this.r.rect(x - (0.5 * this.options.dash_width), i * spacing + this.options.y_padding, this.options.dash_width, spacing);
      rect.attr({
        fill: "rgba(0,0,0," + opacity + ")",
        "stroke-width": 0
      });
    }
    new Label(this.r, x, 20, label, "", 14).draw();
    return new Label(this.r, x, 35, index_value, "", 10).draw();
  };

  IndexChart.prototype.sort_bars = function() {
    var bar, bar_copy;
    bar_copy = (function() {
      var _i, _len, _ref, _results;
      _ref = this.bars;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        bar = _ref[_i];
        _results.push(bar);
      }
      return _results;
    }).call(this);
    bar_copy.sort(function(a, b) {
      return b.index_value - a.index_value;
    });
    return bar_copy;
  };

  IndexChart.prototype.Labels = function() {
    return new LabelFactory(this.r);
  };

  IndexChart.prototype.draw = function() {
    var bar, half_bar_height, i, labels, spacing_factor, x, y, y_padding, _len, _ref,
      _this = this;
    this.set_bar_height();
    spacing_factor = this.bar_height + this.options.bar_margin;
    half_bar_height = this.bar_height / 2;
    y_padding = this.options.y_padding;
    labels = this.Labels().y(function(num) {
      return (num * spacing_factor) + y_padding + half_bar_height;
    }).x(function(num) {
      return 5;
    }).size(12).attr({
      "fill": "#333",
      "text-anchor": "start"
    });
    x = new Scaler().domain([0, this.options.threshold]).range([this.options.x_padding, this.width - this.options.x_padding]);
    y = function(i) {
      return i * (_this.bar_height + _this.options.bar_margin) + _this.options.y_padding;
    };
    this.draw_guide_line("Above Average", 500, x(500), 0.25);
    this.draw_guide_line("High", 1000, x(1000), 0.25);
    _ref = this.sort_bars();
    for (i = 0, _len = _ref.length; i < _len; i++) {
      bar = _ref[i];
      this.draw_bg_bar(bar.index_value, x, y(i));
      this.draw_bar(bar.index_value, x, y(i));
      labels.build(bar.label).draw();
    }
    return this.draw_guide_line("Average", 100, x(100), 1.00);
  };

  return IndexChart;

})(BaseChart);

exports.IndexChart = IndexChart;
var BulletChart, bar,
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

bar = function(label, value, average, comparison) {
  return {
    label: label,
    value: value,
    average: average,
    comparison: comparison
  };
};

BulletChart = (function(_super) {

  __extends(BulletChart, _super);

  function BulletChart(dom_id, options) {
    if (options == null) options = {};
    BulletChart.__super__.constructor.call(this, dom_id, new BulletChartOptions(options));
    this.bars = [];
  }

  BulletChart.prototype.add = function(label, value, average, comparison) {
    return this.bars.push(bar.apply(bar, arguments));
  };

  BulletChart.prototype.draw_background = function(point, y_offset) {
    var rect;
    rect = this.r.rect(this.options.x_padding, y_offset, point.x, this.options.area_width);
    return rect.attr({
      fill: this.options.area_color,
      "stroke-width": 0
    });
  };

  BulletChart.prototype.draw_line = function(point, background_midpoint) {
    var rect, y;
    y = background_midpoint.y - this.options.line_width / 2;
    rect = this.r.rect(this.options.x_padding, y, point.x, this.options.line_width);
    return rect.attr({
      fill: this.options.line_color,
      "stroke-width": 0
    });
  };

  BulletChart.prototype.draw_average = function(point, midpoint_y) {
    var rect;
    rect = this.r.rect(point.x - (this.options.average_width / 2), midpoint_y - this.options.average_height / 2, this.options.average_width, this.options.average_height);
    return rect.attr({
      fill: this.options.average_color,
      "stroke-width": 0
    });
  };

  BulletChart.prototype.draw_label = function(text, offset) {};

  BulletChart.prototype.draw = function() {
    var bar, i, midpoint_y, points, y_offset, _len, _ref, _results;
    _ref = this.bars;
    _results = [];
    for (i = 0, _len = _ref.length; i < _len; i++) {
      bar = _ref[i];
      points = Scaling.scale_points(this.width, this.height, [new Point(bar.comparison, 0), new Point(bar.value, 0), new Point(bar.average, 0), new Point(0, 0)], this.options.x_padding, this.options.y_padding);
      y_offset = i * (this.options.area_width + this.options.bar_margin);
      this.draw_background(points[0], y_offset);
      midpoint_y = y_offset + this.options.area_width / 2;
      this.draw_line(points[1], new Point(points[0].x, midpoint_y));
      this.draw_average(points[2], midpoint_y);
      _results.push(new Label(this.r, 0, y_offset + this.options.area_width / 2, bar.label, "", this.size = 14, this.options.font_family).draw());
    }
    return _results;
  };

  return BulletChart;

})(BaseChart);

exports.BulletChart = BulletChart;
var BarChart,
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

BarChart = (function(_super) {

  __extends(BarChart, _super);

  function BarChart(dom_id, options) {
    if (options == null) options = {};
    BarChart.__super__.constructor.call(this, dom_id, new BarChartOptions(options));
    this.effective_height = this.height - this.options.y_padding;
    this.bar_options = [];
    this.bars = [];
    this.values = [];
  }

  BarChart.prototype.add = function(args) {
    var label, value;
    label = args.label, value = args.value;
    this.bar_options.push(BarChartOptions.merge(this.options, args.options));
    this.values.push(value);
    return this.bars.push({
      label: label,
      value: value
    });
  };

  BarChart.prototype.render_bar = function(x_label, y_label, topleft_corner, options) {
    var rect;
    rect = this.r.rect(topleft_corner.x, topleft_corner.y, this.options.bar_width, this.effective_height - topleft_corner.y, this.options.rounding);
    rect.attr({
      "fill": options.bar_color,
      "stroke-width": 0
    });
    new Label(this.r, topleft_corner.x + this.options.bar_width / 2, this.height - (this.options.x_label_size + 5), x_label, "", this.options.x_label_size, this.options.font_family, this.options.x_label_color).draw();
    return new Label(this.r, topleft_corner.x + this.options.bar_width / 2, topleft_corner.y - this.options.y_label_size - 5, y_label, "", this.options.y_label_size, this.options.font_family, this.options.y_label_color).draw();
  };

  BarChart.prototype.draw = function() {
    var bar, i, points, scaled_x, scaled_y, tl_bar_corner, value, _len, _ref, _results;
    points = (function() {
      var _len, _ref, _results;
      _ref = this.values;
      _results = [];
      for (i = 0, _len = _ref.length; i < _len; i++) {
        value = _ref[i];
        _results.push(new Point(i, value));
      }
      return _results;
    }).call(this);
    points.push(new Point(0, 0));
    this.scaled_values = Scaling.scale_points(this.width, this.height, points, this.options.x_padding, this.options.y_padding);
    _ref = this.bars;
    _results = [];
    for (i = 0, _len = _ref.length; i < _len; i++) {
      bar = _ref[i];
      scaled_x = i * (this.options.bar_width + this.options.bar_spacing) + this.options.x_padding;
      scaled_y = this.scaled_values[i].y;
      tl_bar_corner = new Point(scaled_x, scaled_y);
      _results.push(this.render_bar(bar.label, bar.value, tl_bar_corner, this.bar_options[i]));
    }
    return _results;
  };

  return BarChart;

})(BaseChart);

exports.BarChart = BarChart;

    })
