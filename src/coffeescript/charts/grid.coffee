class Grid
  constructor: (@r, @width, @height, @points, @options) ->

  draw: ->
    grid_lines = Math.round(@points.length / @options.step_size)
    height = @height - @options.y_padding
    width = @width  - @options.x_padding
    x_step_size = Math.round(width  / grid_lines)
    y_step_size = Math.round(height / grid_lines)
    y = @options.y_padding
    paths = @r.set()

    for point, i in @points when i % @options.step_size == 0
      x = @points[i].x
      paths.push @r.path("M #{x}, #{@options.y_padding} L #{x}, #{height} Z")
      paths.push @r.path("M #{@options.x_padding}, #{y} L #{width}, #{y} Z") if y <= height
      y += y_step_size

    paths.attr({
      stroke: "#ccc"
      "stroke-width": 1
    }).toBack()

