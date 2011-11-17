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
    points = (new Point(pair[0], pair[1]) for pair in point_pairs)
    points_count  = @all_points.length
    @line_indices.push [points_count, points_count + points.length-1]
    @all_points.push.apply(@all_points, points)
    @line_options.push new LineChartOptions(args.options || @options)
    return

  draw_grid: (points) ->
    grid = new Grid(@r, @width, @height, points, @options)
    grid.draw()

  draw_y_labels: ->
    scaled_sorted = (point for point in @scaled_points)
    scaled_sorted.sort (a,b) -> a.y - b.y

    sorted = (point for point in @all_points)
    sorted.sort (a,b) -> a.y - b.y

    first_y = @height - scaled_sorted[0].y
    last_y  = @height - scaled_sorted[scaled_sorted.length-1].y 
    mid_y   = Math.round(@height / 2)

    first_label = sorted[0].y
    last_label  = sorted[sorted.length-1].y
    mid_label   = Math.round(last_label / 2)

    fmt = @options.label_format
    size = @options.y_label_size

    new Label(@r, size, first_y, first_label, fmt, size).draw()
    new Label(@r, size, mid_y, mid_label, fmt, size).draw()
    new Label(@r, size, last_y, last_label, fmt, size).draw()


  draw_x_labels: (raw_points, points) ->
    for point, i in points
      raw_point = raw_points[i]

      if i % @options.step_size == 0
        label = if raw_point.is_date_type == true then new Date(raw_point.x) else Math.round(raw_point.x)

        fmt = @options.label_format
        size = @options.x_label_size

        new Label(
          @r, 
          point.x, 
          @height - size, 
          label, 
          fmt
        ).draw()

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
    @r.clear()
    @scaled_points = Scaling.scale_points(@width, @height, @all_points, @options.x_padding, @options.y_padding)

    for line_indices, i in @line_indices
      [begin, end] = line_indices
      points     = @scaled_points[begin..end]
      raw_points = @all_points[begin..end]
      options    = @line_options[i]
      @draw_line(raw_points, points, options)
      
      if i == 0
        @draw_grid(points) if @options.show_grid == true
        @draw_y_labels()   if @options.show_y_labels == true
        @draw_x_labels(raw_points, points) if @options.show_x_labels == true

    return
      



exports.LineChart = LineChart
