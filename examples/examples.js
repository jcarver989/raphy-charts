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
    for (i = 0; i <= 70; i++) {
      var date = new Date(d.getFullYear(), d.getMonth(), i+1)
      _results.push([date, Math.random()]);
    }
    return _results;
  };

  var create_random_points3 = function() {
    var points = create_random_points2();
    for (var i = 0; i < points.length; i++) {
      points[i][1] = points[i][1] * 1.4;
    }
    return points;
  }
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
        show_grid: true,
        render: "bar",
        label_format: "%b %d"
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
      data: create_squared_points(),
      options: {
        area_color: "90-#00aadd-#fff"
      }
    });
    c.draw();
    c = new Charts.LineChart('chart2', {
      line_color: "#118800",
      dot_color: "rgba(0,0,0,0)",
      // gradients <angle>-<color1>-<color2>
      // ‹angle›-‹colour›[-‹colour›[:‹offset›]]*-‹colour›
      area_color: "#118800",
      dot_stroke_color: "#aaa",
      dot_stroke_size: 0,
      dot_size: 3,
      label_min: true,
      show_y_labels: false,
      show_grid: false,
      smoothing: 0.3
    });
    c.add_line({
      data: create_random_points2()
    });
    c.add_line({
      data: create_random_points3(),
      options: {
        line_color: "#2691b1",
        area_color: "#2691b1"
      }
    })
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






 var data = {"result":[{"region":"us-east-1","data":[[1321511760000,1],[1321515960000,1],[1321517160000,1],[1321535160000,1],[1321543560000,1],[1321544160000,1],[1321545960000,1],[1321551360000,3],[1321551960000,1],[1321556160000,4],[1321559760000,1],[1321563360000,3],[1321563960000,1],[1321568160000,1],[1321568760000,2],[1321569360000,1],[1321571760000,1],[1321578360000,1],[1321580760000,1],[1321582560000,1]]},{"region":"us-west-1","data":[]},{"region":"eu-west-1","data":[]},{"region":"ap-southeast-1","data":[]}]} 


$(document).ready(function() {
    var colors = [
      "#00aadd",
      "#ffee33",
      "#ff3366",
      "#00cc33"
    ]

    var c = new Charts.LineChart('cwchart', {
      show_grid: true,
      label_format: "%I:%M %p",
      x_label_size: 12,
      show_y_labels: true,
      y_label_size: 12,
      smoothing: 1,
      max_x_labels: 5,
      max_y_labels: 3,
      x_padding: 50,
      y_axis_scale: [0, 10]
    });

    var ret = data["result"];
    for (var i=0; i< ret.length; i++) {
        var yvals = [];
        for (var j=0; j< ret[i]["data"].length; j++) {
            yvals.push([new Date(ret[i]["data"][j][0]), ret[i]["data"][j][1]]);
        }

        c.add_line({
          data: yvals,
          options: {
            line_color: colors[ i % colors.length],
            dot_color:  colors[ i % colors.length],
            area_color:  colors[ i % colors.length],
            area_opacity: 0.3,
            dot_size: 0,
            label_min: false,
            label_max: false
          }
        });
    }


    c.draw()



   var log_scale = new Charts.LineChart('logscale', {
   show_grid: true,
   show_y_labels: true,
   label_max: false,
   label_min: false,
   scale: "log",
   max_y_labels: 5,
   x_padding: 60
 });


  log_scale.add_line({
    data: [[1, 305],[2, 336],[3, 378],[4, 449],[5, 635],[6, 935],[7, 782]],
    options: {
      line_color: colors[2],
      dot_color: colors[2],
      fill_area: false,
      line_width: 2,
      dot_size: 3
    }
  });

  log_scale.add_line({
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

    log_scale.draw()


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
      data: [[1, 828906]],
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
      data: [[1, 305]],
      options: {
        line_color: colors[2],
        dot_color: colors[2],
        fill_area: false,
        line_width: 2,
        dot_size: 3
      }
    });

    multi_axis.draw()



   var multi_axis_zeros = new Charts.LineChart('multiaxiszeros', {
     show_grid: true,
     show_y_labels: true,
     label_max: false,
     label_min: false,
     multi_axis: true,
     max_y_labels: 4,
     x_padding: 45 
   });

   multi_axis_zeros.add_line({
     data: [[1, 0],[2, 0, {tooltip: "custom tooltip", show_dot: true}],[3, 0, {no_dot: true }],[4, 0, {no_dot: true}],[5, 0],[6, 0],[7, 0]],
      options: {
        line_color: colors[0],
        dot_color: colors[0],
        area_color: "230-#88c9dd-rgba(255,255,255,0)",
        area_opacity: 0.2,
        dot_size: 5,
        line_width: 4 
      }
    });

    multi_axis_zeros.add_line({
      data: [[1, 305],[2, 336],[3, 378],[4, 449],[5, 635],[6, 935],[7, 782]],
      options: {
        line_color: colors[2],
        dot_color: colors[2],
        fill_area: false,
        line_width: 2,
        dot_size: 3
      }
    });

    multi_axis_zeros.draw()



   var bullet = new Charts.BulletChart('bulletchart');
   bullet.add("foo", 50, 30, 100);
   bullet.add("doo", 70, 30, 100);
   bullet.add("moo", 20, 30, 100);
   bullet.draw();


   var bars = new Charts.BarChart('normalbarchart', {
     x_label_color: "#00aadd"
    });

   bars.add({
     label: "foo",
     value: 600,
     
   });

   bars.add({
     label: "moo",
     value: 800
   });

   bars.add({
     label: "doo",
     value: 300
   });

   bars.draw();



   

   var node = document.getElementById('indexchart');
   var index = Charts.IndexChart(node);
   index.add("Retail",18316,65)
   index.add("IT Software",28977,1331)
   index.add("Engineering/Technical",28977,282)
   index.add("Education",20839,106)
   index.add("Media & Internet",22488,92)
   index.add("Business Services",19397,85)
   index.add_guide_line("Average", 100, 1)
   index.add_guide_line("Above Average", 500, 0.25)
   index.add_guide_line("High", 1000, 0.25)
   index.add_raw_label("Uniques")
   index.draw()

})
