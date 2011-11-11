class Scaling 
  @get_ranges_for_points: (points) ->
    xs = []
    ys = []

    for point in points
      xs.push(point.x)
      ys.push(point.y)

    max_x = Math.max.apply(Math.max, xs)
    max_y = Math.max.apply(Math.max, ys)
    
    min_x = Math.min.apply(Math.min, xs)
    min_y = Math.min.apply(Math.min, ys)

    [max_x, min_x, max_y, min_y]

  @scale_points:  (x_max, y_max, points, padding) ->
    [max_x, min_x, max_y, min_y] = Scaling.get_ranges_for_points(points)

    # 2x padding for top + bottom of axis
    # newMax = width - padding
    # newMin = padding
    # newMax - newMin = width - 2*padding
    padded_x_max_range  = x_max - 2*padding
    padded_y_max_range = y_max - 2*padding

    x_range = max_x - min_x
    y_range = max_y - min_y

    # ratio = (newMax - newMin) / (oldMax - oldMin)
    x_scaling_factor = padded_x_max_range  / x_range
    y_scaling_factor = padded_y_max_range / y_range

    scaled_points = []

    for point in points
      # v * ratio + newMin
      sx = x_scaling_factor * point.x + padding
      # (0,0) is the top of chart, thus subject from y_max to reflect 
      sy = y_max - (y_scaling_factor * point.y + padding)

      scaled_points.push(new Point(sx, sy))

    scaled_points
