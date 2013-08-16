$(document).ready(function() {
    var monthly_sales = [
    [new Date("2012-09-01T01:00:00+01:00"), 1486],
    [new Date("2012-10-01T01:00:00+01:00"), 952],
    [new Date("2012-11-01T00:00:00+00:00"), 2461],
    [new Date("2012-12-01T00:00:00+00:00"), 631],
    [new Date("2013-01-01T00:00:00+00:00"), 3644],
    [new Date("2013-02-01T00:00:00+00:00"), 0],
    [new Date("2013-03-01T00:00:00+00:00"), 0],
    [new Date("2013-04-01T01:00:00+01:00"), 0],
    [new Date("2013-05-01T01:00:00+01:00"), 0],
    [new Date("2013-06-01T01:00:00+01:00"), 0],
    [new Date("2013-07-01T01:00:00+01:00"), 0],
    ]
    var chart1 = new Charts.LineChart('chart1', {
      show_grid: true,
      show_y_labels: true,
      show_x_labels:true,
      label_max: false,
      label_min: false,
      multi_axis: false,
      max_y_labels: 9,
      max_x_labels: 48,
      x_padding: 55,
      y_padding:40,
      x_label_size: 13,
      label_format: "%m/%Y",
      y_axis_scale: [0, 8000]
    });

    chart1.add_line({
      data: monthly_sales,
      options: {
        line_color: "#16728c",
        dot_color: "#16a2cb",
        dot_stroke_size: 1,
        dot_stroke_color: "#16728c",
        area_opacity: 0.3,
        dot_size: 5,
        line_width: 1,
        smoothing: 0
      }
    });
    chart1.draw();
})
