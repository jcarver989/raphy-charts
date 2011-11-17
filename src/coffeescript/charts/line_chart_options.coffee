class LineChartOptions
  @DEFAULTS: {
    dot_size: 5 
    dot_color: "#00aadd"
    dot_stroke_color: "#fff"
    dot_stroke_size: 2 

    line_width: 3 
    line_color: "#00aadd"
    smoothing: 0.4 

    fill_area: true
    area_color: "#00aadd"
    area_opacity: 0.2 

    show_x_labels: true
    show_y_labels: false
    label_max : true
    label_min : true
    max_x_labels: 10
    max_y_labels: 8 
    x_label_size: 14
    y_label_size: 14
    label_format: "%m/%d"

    show_grid: false

    x_padding: 25
    y_padding: 40

  }

  constructor: (options) ->
    opts = {}

    for option, value of LineChartOptions.DEFAULTS
      opts[option] = value

    for option, value of options when options.hasOwnProperty(option)
      opts[option] = value

    return opts
