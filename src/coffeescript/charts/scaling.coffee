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

  
  ###
  Helper for mapping numbers into a new range:
  existing range: A to B
  target range: C to D
  R1 = B - A
  R2 = D - C
  new number = (B*C - A*D)/R1 + old_number *(R2/R1) 
  returns [(B*C - A*D) / R1, R2/R1)]
  ###
  @calc_scaling_factors: (old_max, old_min, new_max, new_min) ->
    old_range = old_max - old_min
    new_range = new_max - new_min
    scaling_factor = (old_max * new_min - new_max * old_min)
    return [scaling_factor / old_range, new_range / old_range]


  @scale_points:  (x_max, y_max, points, x_padding, y_padding) ->
    [max_x, min_x, max_y, min_y] = Scaling.get_ranges_for_points(points)

    # prevent NAN errors
    max_y += 1 if min_y == max_y
    max_x += 1 if min_x == max_x

    [x_scaling, x_range_ratio] = Scaling.calc_scaling_factors(
      max_x,
      min_x,
      x_max - x_padding,
      x_padding
    ) 

    [y_scaling, y_range_ratio] = Scaling.calc_scaling_factors(
      max_y,
      min_y,
      y_max - y_padding,
      y_padding)
    
    scaled_points = []

    for point in points
      sx = x_scaling + point.x * x_range_ratio 
      # (0,0) is the top of chart, subject from y_max to reflect 
      sy = y_max - (y_scaling + point.y * y_range_ratio)
      scaled_points.push(new Point(sx, sy))

    scaled_points


exports.Scaling = Scaling
