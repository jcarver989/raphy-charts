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

    label_max : true
    label_min : true

  }

  constructor: (options) ->
    opts = {}

    for option, value of LineChartOptions.DEFAULTS
      opts[option] = value

    for option, value of options when options.hasOwnProperty(option)
      opts[option] = value

    return opts
