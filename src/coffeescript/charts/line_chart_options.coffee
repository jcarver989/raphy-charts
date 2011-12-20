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
    show_y_labels: true
    label_max : true
    label_min : true
    max_x_labels: 10
    max_y_labels: 3 
    font_family: "Helvetica, Arial, sans-serif"
    x_label_size: 14
    y_label_size: 14
    label_format: "%m/%d"

    show_grid: false

    x_padding: 45
    y_padding: 40

    render: "line" # or "bar"
    bar_width: 20

  }


  @merge: (from = {}, to = {}) ->
    opts = {}

    for option, value of from
      opts[option] = value

    for option, value of to when to.hasOwnProperty(option)
      opts[option] = value

    return opts


  constructor: (options) ->
    opts = {}

    for option, value of LineChartOptions.DEFAULTS
      opts[option] = value

    for option, value of options when options.hasOwnProperty(option)
      opts[option] = value

    return opts
