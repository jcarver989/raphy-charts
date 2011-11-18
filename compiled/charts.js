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
    x_label_size: 14,
    y_label_size: 14,
    label_format: "%m/%d",
    show_grid: false,
    x_padding: 45,
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
    if (min_y === max_y) {
      max_y += 1;
    }
    if (min_x === max_x) {
      max_x += 1;
    }
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
exports.Scaling = Scaling;var Point;
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
exports.Point = Point;var Tooltip;
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
    if (typeof text === "number") {
      text = Math.round(text * 100) / 100;
    }
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
})();
exports.Tooltip = Tooltip;var Label;
Label = (function() {
  function Label(r, x, y, text, format, size) {
    this.r = r;
    this.x = x;
    this.y = y;
    this.text = text;
    this.format = format;
    this.size = size != null ? size : 14;
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
    x = this.x < width ? (width / 2) + margin : this.x;
    return this.element.attr({
      "fill": "#333",
      "font-size": this.size,
      "font-weight": "bold",
      "x": x,
      "text-anchor": "middle"
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
})();
exports.Bezier = Bezier;var Line;
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
    if (this.options.dot_size > 0) {
      this.draw_dots_and_tooltips(this.scaled_points, this.raw_points);
    }
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
  }
  LineChart.prototype.get_dimensions = function(container) {
    var height, width;
    width = parseInt(container.style.width);
    height = parseInt(container.style.height);
    return [width, height];
  };
  LineChart.prototype.add_line = function(args) {
    var pair, point_pairs, points, points_count;
    point_pairs = args.data;
    if (point_pairs.length < 1) {
      return;
    }
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
    this.line_options.push(new LineChartOptions(args.options || this.options));
  };
  LineChart.prototype.draw_grid = function(x_coordinates, y_coordinates) {
    var height, paths, val, width, _i, _j, _len, _len2;
    if (x_coordinates == null) {
      x_coordinates = [];
    }
    if (y_coordinates == null) {
      y_coordinates = [];
    }
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
  LineChart.prototype.draw_y_labels = function() {
    var fmt, i, label, label_coordinates, labels, max_labels, max_x, max_y, min_x, min_y, padding, scaled_labels, size, step_size, y, _len, _ref;
    _ref = Scaling.get_ranges_for_points(this.all_points), max_x = _ref[0], min_x = _ref[1], max_y = _ref[2], min_y = _ref[3];
    if (max_y === min_y) {
      return [this.options.y_padding, this.height - this.options.y_padding];
    }
    fmt = this.options.label_format;
    size = this.options.y_label_size;
    padding = size + 5;
    max_labels = this.options.max_y_labels;
    label_coordinates = [];
    labels = [];
    step_size = Math.round((max_y - min_y) / (max_labels - 1));
    if (step_size <= 0) {
      step_size = 1;
    }
    y = min_y;
    while (y <= max_y) {
      labels.push(new Point(0, y));
      y += step_size;
    }
    if (max_y > 1) {
      labels[labels.length - 1].y = Math.round(max_y);
    }
    scaled_labels = Scaling.scale_points(this.width, this.height, labels, this.options.x_padding, this.options.y_padding);
    for (i = 0, _len = scaled_labels.length; i < _len; i++) {
      label = scaled_labels[i];
      new Label(this.r, padding, label.y, labels[i].y, fmt, size).draw();
      label_coordinates.push(label.y);
    }
    return label_coordinates;
  };
  LineChart.prototype.draw_x_label = function(raw_point, point) {
    var fmt, label, size;
    fmt = this.options.label_format;
    size = this.options.x_label_size;
    label = raw_point.is_date_type === true ? new Date(raw_point.x) : Math.round(raw_point.x);
    return new Label(this.r, point.x, this.height - size, label, fmt, size).draw();
  };
  LineChart.prototype.draw_x_labels = function(raw_points, points) {
    var i, label_coordinates, last, len, max_labels, point, raw_point, rounded_step_size, step_size;
    label_coordinates = [];
    max_labels = this.options.max_x_labels;
    this.draw_x_label(raw_points[0], points[0]);
    label_coordinates.push(points[0].x);
    if (max_labels < 2) {
      return;
    }
    last = points.length - 1;
    this.draw_x_label(raw_points[last], points[last]);
    label_coordinates.push(points[last].x);
    if (max_labels < 3) {
      return;
    }
    len = points.length - 2;
    step_size = len / (max_labels - 1);
    rounded_step_size = Math.round(step_size);
    if (step_size !== rounded_step_size) {
      step_size = rounded_step_size + 1;
    }
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
    return new Line(this.r, raw_points, points, this.height, this.width, options).draw();
  };
  LineChart.prototype.draw = function() {
    var begin, end, i, line_indices, options, points, raw_points, _len, _ref;
    if (this.all_points.length < 1) {
      return;
    }
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
})();
exports.LineChart = LineChart;
    })
