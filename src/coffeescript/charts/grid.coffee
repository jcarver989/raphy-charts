class Grid
  constructor: (@r, @width, @height, @options) ->

  draw: ->
    grid_lines = @options.grid_lines
    height = @height
    width = @width
    x_step_size = width  / grid_lines
    y_step_size = height / grid_lines
    x = 0
    y = 0 
    paths = @r.set()

    # vertical
    for i in [0..grid_lines]
      paths.push @r.path("M #{x}, #{0} L #{x}, #{height} Z")
      paths.push @r.path("M #{0}, #{y} L #{width}, #{y} Z")
      x += x_step_size
      y += y_step_size

    # horizontal

    paths.attr({
      stroke: "#ccc"
      "stroke-width": 1
    })

    paths.toBack()
