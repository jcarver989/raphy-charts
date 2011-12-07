# @import point.coffee

class Bezier
  @create_path: (points, smoothing = 0.5) -> 
    path = "M#{points[0].x}, #{points[0].y}"

    for point, i in points
      continue if i == 0
      [b1, b2] = Bezier.get_control_points(points, i-1, smoothing)
      path += "C#{b1.x},#{b1.y} #{b2.x},#{b2.y} #{points[i].x},#{points[i].y}"

    path

  # hermite interpolation with bezier curve
  # smoothing: 0 to 1 (0 not smooth, 1 ultra smooth)
  @get_control_points: (points, i, smoothing, divisor = 3) ->
    [p0, p2] =  @get_prev_and_next_points(points, i)   # i-1 & i+1
    [p1, p3] =  @get_prev_and_next_points(points, i+1) # i & i+2

    # tan1 entering the point, tan2 leaving the point
    [tan1_x, tan1_y] = @get_tangent(p0, p2)
    [tan2_x, tan2_y] = @get_tangent(p1, p3)

    b1_x = p1.x + (tan1_x * smoothing)/divisor
    b1_y = p1.y + (tan1_y * smoothing)/divisor

    b2_x = p2.x - (tan2_x * smoothing)/divisor
    b2_y = p2.y - (tan2_y * smoothing)/divisor

    b1 = new Point(b1_x, b1_y)
    b2 = new Point(b2_x, b2_y)

    return [b1, b2] 
 
  @get_prev_and_next_points = (points, i) ->
    prev = i-1 
    next = i+1 

    prev = 0 if prev < 0
    next = points.length-1 if next >= points.length

    return [points[prev], points[next]]

  @get_tangent = (p0, p1) ->
    tan_x = p1.x - p0.x
    tan_y = p1.y - p0.y
    return [tan_x, tan_y]


exports.Bezier = Bezier

