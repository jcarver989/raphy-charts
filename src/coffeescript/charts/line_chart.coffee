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
    @labels       = []

  get_dimensions: (container) ->
    width  = parseInt(container.style.width)
    height = parseInt(container.style.height)
    [width, height]

  add_line: (args) ->
    points = (new Point(x, y) for y, x in args.data)
    points_count  = @all_points.length
    @labels = args.labels if args.labels?
    @line_indices.push [points_count, points_count + points.length-1]
    @all_points.push.apply(@all_points, points)
    @line_options.push new LineChartOptions(args.options || @options)
    return

  draw_grid: (points) ->
    grid = new Grid(@r, @width, @height, points, @options)
    grid.draw()

  draw_labels: (points) ->
    for point, i in points
      if i % @options.step_size == 0
        new Label(@r, point.x, @height, @labels[i], @options.label_format).draw()

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
        @draw_grid(points)   if @options.show_grid == true
        @draw_labels(points) if @labels.length == points.length

    return
      



exports.LineChart = LineChart
