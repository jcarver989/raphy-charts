class Bezier
  @create_path: (points, tension = 0.7) -> 
    path = ""

    for point, i in points
      if i == 0
        path += "M#{point.x},#{point.y}"
      else
        [b1, b2] = Bezier.get_control_points(points, i-1, tension)
        path += "M#{points[i-1].x},#{points[i-1].y} C#{b1.x},#{b1.y} #{b2.x},#{b2.y} #{points[i].x},#{points[i].y}"

    path

  @get_control_points: (points, i, tension) ->
    d1 = Bezier.get_control_point(points, i, tension)
    d2 = Bezier.get_control_point(points, i+1, tension)

    b1 = new Point(
      points[i].x + d1.x / 3,
      points[i].y + d1.y / 3
    )

    b2 = new Point(
      points[i+1].x - d2.x / 3,
      points[i+1].y - d2.y / 3
    )

    [b1, b2]

  @get_control_point: (points, i, tension) ->
    throw "Error" if points.length < 2

    tension_factor = 1 - tension

    if i == 0
      new Point(
        (points[1].x - points[0].x) * tension_factor,
        (points[1].y - points[0].y) * tension_factor
      )

    else if i == (points.length-1)
      new Point(
        (points[i].x - points[i-1].x) * tension_factor,
        (points[i].y - points[i-1].y) * tension_factor
      )

    else
      new Point(
        (points[i+1].x - points[i-1].x) * tension_factor,
        (points[i+1].y - points[i-1].y) * tension_factor 
      )


