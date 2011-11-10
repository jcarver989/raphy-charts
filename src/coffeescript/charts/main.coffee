class Point
  constructor: (@x, @y) ->

get_ranges_for_points = (points) ->
  xs = []
  ys = []

  for point in points
    xs.push(point.x)
    ys.push(point.y)

  max_x = Math.max.apply(Math.max, xs)
  max_y = Math.max.apply(Math.max, ys)
  
  min_x = Math.min.apply(Math.max, xs)
  min_y = Math.min.apply(Math.max, ys)

  [max_x, min_x, max_y, min_y]


# Scale algorithm:
# (newMax - newMin) / (dataMax - dataMin) * dataPoint + newMin
scale_points  = (width, height, points, padding) ->
  [max_x, min_x, max_y, min_y] = get_ranges_for_points(points)

  # 2x padding for top + bottom of axis
  # newMax = width - padding
  # newMin = padding
  # newMax - newMin = width - 2*padding
  padded_width_range  = width  - 2*padding
  padded_height_range = height - 2*padding

  x_range = max_x - min_x
  y_range = max_y - min_y

  # ratio = (newMax - newMin) / (oldMax - oldMin)
  x_scaling_factor = padded_width_range  / x_range
  y_scaling_factor = padded_height_range / y_range

  scaled_points = []

  for point in points
    # v * ratio + newMin
    sx = x_scaling_factor * point.x + padding
    sy = y_scaling_factor * point.y + padding

    scaled_points.push(new Point(sx, sy))

  scaled_points


get_derivitive = (points, i, tension) ->
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


get_control_points = (points, i, tension = 0.7) ->
  d1 = get_derivitive(points, i, tension)
  d2 = get_derivitive(points, i+1, tension)

  b1 = new Point(
    points[i].x + d1.x / 3,
    points[i].y + d1.y / 3
  )

  b2 = new Point(
    points[i+1].x - d2.x / 3,
    points[i+1].y - d2.y / 3
  )

  [b1, b2]


create_random_points = -> 
  points = (new Point(i, i*(i-5)) for i in [0..25])
  points.push(new Point(26, 30))
  points.push(new Point(27, 300))
  points.push(new Point(28, 800))
  points.push(new Point(29, 500))
  points.push(new Point(30, 600))
  points.push(new Point(31, 610))
  points.push(new Point(32, 620))

  scale_points(1000, 300, points, 20)


draw_bezier_path = (r, points) ->
  path = ""
  for point, i in points
    dot = r.circle(point.x, point.y, 3)
    dot.attr("fill", "#00aadd")
    if i == 0
      path += "M#{point.x},#{point.y}"
    else
      [b1, b2] = get_control_points(points, i-1)
      path += "M#{points[i-1].x},#{points[i-1].y} C#{b1.x},#{b1.y} #{b2.x},#{b2.y} #{points[i].x},#{points[i].y}"

  r.path(path)

draw_bars = (r, points) ->
  x = points[0].x 
  for point, i in points
    rect = r.rect(x-15, point.y, 15, 300 - point.y)
    x += 16 

    rect.attr({ 
      "fill"        : "#00aadd",
      "stroke"      : "transparent",
      "stroke-width": "0"
    })


window.onload = () ->
  chart = document.getElementById('chart')
  chart2 = document.getElementById('chart2')
  points = create_random_points()
  r = Raphael(chart, 1000, 300)
  r2 = Raphael(chart2, 1000, 300)

  draw_bezier_path(r, points)
  draw_bars(r2, points)



  exports.create_random_points = create_random_points
