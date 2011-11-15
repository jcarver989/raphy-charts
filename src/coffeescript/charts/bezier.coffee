class Bezier
  @create_path: (points, smoothing = 0.7) -> 
    path = ""

    for point, i in points
      if i == 0
        path += "M#{point.x},#{point.y}"
      else
        [b1, b2] = Bezier.get_control_points(points, i-1, smoothing)
        path += "M#{points[i-1].x},#{points[i-1].y} C#{b1.x},#{b1.y} #{b2.x},#{b2.y} #{points[i].x},#{points[i].y}"

    path

  @get_control_points: (points, i, smoothing) ->
    d1 = Bezier.get_control_point(points, i, smoothing)
    d2 = Bezier.get_control_point(points, i+1, smoothing)

    b1 = new Point(
      points[i].x + d1.x / 3,
      points[i].y + d1.y / 3
    )

    b2 = new Point(
      points[i+1].x - d2.x / 3,
      points[i+1].y - d2.y / 3
    )

    [b1, b2]

  @get_control_point: (points, i, smoothing_factor) ->
    throw "Error" if points.length < 2

    i1 = i + 1
    i2 = i - 1

    if i == 0
      i1 = 1
      i2 = 0

    else if i == (points.length-1)
      i1 = i
      i2 = i-1

    new Point(
      (points[i1].x - points[i2].x) * smoothing_factor,
      (points[i1].y - points[i2].y) * smoothing_factor 
    )



exports.Bezier = Bezier
