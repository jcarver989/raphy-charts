# @import point.coffee
# @import bezier.coffee
# @import scaling.coffee
# @import tooltip.coffee
# @import dot.coffee
# @import line_chart_options.coffee
# @import line.coffee
# @import grid.coffee

###\
\###
class LineChart
  
  
  constructor: (dom_id, options = {}) ->
    container = document.getElementById(dom_id)
    [@width, @height] = @get_dimensions(container)
    @padding = 26
    @options = new LineChartOptions(options)

    @r = Raphael(container, @width, @height)

    @all_points   = []
    @line_indices = []
    @line_options = []

  get_dimensions: (container) ->
    width  = parseInt(container.style.width)
    height = parseInt(container.style.height)
    [width, height]

  add_line: (args) ->
    point_pairs = args.data
    return if point_pairs.length < 1

    points = (new Point(pair[0], pair[1]) for pair in point_pairs)
    points_count  = @all_points.length
    @line_indices.push [points_count, points_count + points.length-1]
    @all_points.push.apply(@all_points, points)
    @line_options.push new LineChartOptions(args.options || @options)
    return

  draw_grid: (x_coordinates = [], y_coordinates = []) ->

    height = @height - @options.y_padding
    width  = @width  - @options.x_padding
    paths = @r.set()

    for val in x_coordinates
      paths.push @r.path("M #{val}, #{@options.y_padding} L #{val}, #{height} Z")

    for val in y_coordinates
      paths.push @r.path("M #{@options.x_padding}, #{val} L #{width}, #{val} Z")

    paths.attr({
      stroke: "#ccc"
      "stroke-width": 1
    }).toBack()

  draw_y_labels: ->
    scaled_sorted = (point for point in @scaled_points)
    scaled_sorted.sort (a,b) -> a.y - b.y

    sorted = (point for point in @all_points)
    sorted.sort (a,b) -> a.y - b.y

    fmt = @options.label_format
    size = @options.y_label_size
    padding = size + 5 
    max_labels = @options.max_y_labels
    label_coordinates = []
    labels = []

    first_y = @height - scaled_sorted[0].y
    first_label = sorted[0].y
    labels.push new Point(0, first_label)

    last_y  = @height - scaled_sorted[scaled_sorted.length-1].y 
    last_label  = sorted[sorted.length-1].y
    labels.push new Point(0, last_label)

    label_step_size  = Math.round(last_label / (max_labels-1))
    label_y = first_label + label_step_size 

    while label_y < last_label
      labels.push new Point(0, Math.round(label_y/10) * 10)
      label_y += label_step_size

    scaled_labels = Scaling.scale_points(@width, @height, labels, @options.x_padding, @options.y_padding)

    for label, i in scaled_labels
      new Label(@r, padding, label.y, labels[i].y, fmt, size).draw()
      label_coordinates.push label.y

    label_coordinates


  draw_x_label: (raw_point, point) ->
    fmt = @options.label_format
    size = @options.x_label_size

    label = if raw_point.is_date_type == true then new Date(raw_point.x) else Math.round(raw_point.x)
    new Label(
      @r, 
      point.x, 
      @height - size, 
      label, 
      fmt,
      size
    ).draw()

  draw_x_labels: (raw_points, points) ->
    label_coordinates = []
    max_labels = @options.max_x_labels

    # draw first
    @draw_x_label(raw_points[0], points[0])
    label_coordinates.push points[0].x
    return if max_labels < 2
    
    # draw last 
    last = points.length-1
    @draw_x_label(raw_points[last], points[last]) 
    label_coordinates.push points[last].x
    return if max_labels < 3

    len = points.length-2
    step_size  = len / (max_labels-1)

    # when irrational
    rounded_step_size = Math.round(step_size)
    step_size = rounded_step_size+1 if step_size != rounded_step_size

    i = step_size 
    while i < len
      raw_point = raw_points[i]
      point     = points[i] 
      @draw_x_label(raw_point, point)
      label_coordinates.push point.x
      i += step_size

    label_coordinates

  draw_line: (raw_points, points, options) ->
    new Line(
      @r,
      raw_points,
      points,
      @height,
      @width,
      options
    ).draw()

  draw: () ->
    return if @all_points.length < 1

    @r.clear()
    @scaled_points = Scaling.scale_points(@width, @height, @all_points, @options.x_padding, @options.y_padding)

    for line_indices, i in @line_indices
      [begin, end] = line_indices
      points     = @scaled_points[begin..end]
      raw_points = @all_points[begin..end]
      options    = @line_options[i]
      @draw_line(raw_points, points, options)
      
      if i == 0
        @x_label_coordinates = @draw_x_labels(raw_points, points) if @options.show_x_labels == true
        @y_label_coordinates = @draw_y_labels()   if @options.show_y_labels == true
        @draw_grid(@x_label_coordinates, @y_label_coordinates) if @options.show_grid == true

    return
      



exports.LineChart = LineChart
