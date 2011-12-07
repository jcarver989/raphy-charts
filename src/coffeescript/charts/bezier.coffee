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
  # t (0 to 1) controls where point is interpolated  
  @get_control_points: (points, i, smoothing, t = 1/3) ->
    [p0, p2] =  @get_prev_and_next_points(points, i)   # i-1 & i+1
    [p1, p3] =  @get_prev_and_next_points(points, i+1) # i & i+2

    tan_p0_p2 = @get_tangent(p0, p2)
    tan_p1_p3 = @get_tangent(p1, p3)

    b1_x = p1.x + (tan_p0_p2.x * smoothing * t)
    b1_y = p1.y + (tan_p0_p2.y * smoothing * t)

    b2_x = p2.x - (tan_p1_p3.x * smoothing * t)
    b2_y = p2.y - (tan_p1_p3.y * smoothing * t)

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
    new Point(tan_x, tan_y)


exports.Bezier = Bezier

