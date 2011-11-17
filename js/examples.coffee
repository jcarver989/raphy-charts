create_date = (day) ->
  d = new Date()
  new Date(d.getFullYear(), d.getMonth(), day+1)

create_exponential_points = -> ([create_date(i), i*(4)] for i in [0..25])
create_squared_points = -> ([create_date(i), i * (i-1)] for i in [0..25])
create_random_points2 = -> ([create_date(i), Math.random() * i] for i in [0..25])

draw_bars = (r, points) ->
  attach_handler = (element) ->
    element.mouseover () ->
      element.attr({ "fill" : "#333" })

    element.mouseout () ->
      element.attr({ "fill" : "#00aadd" })

  x = points[0].x 
  for point, i in points
    rect = r.rect(x-15, point.y, 15, 300 - point.y)
    x += 16 

    rect.attr({ 
      "fill"        : "#00aadd",
      "stroke"      : "transparent",
      "stroke-width": "0"
    })

    attach_handler(rect)

    new Charts.Tooltip(r, rect, Math.floor(points[i].y))

window.onload = () ->
  charts = Charts
  # line 
  c = new Charts.LineChart('chart1', { 
    show_grid: true
  })

  c.add_line {
    data: create_exponential_points()
    options: {
      line_color : "#cc1100"
      area_color : "#cc1100"
      dot_color  :  "#cc1100"
    }
  }
  c.add_line { data: create_squared_points() }
  c.draw()

  c = new Charts.LineChart('chart2', {
    line_color : "#118800"
    dot_color  : "#118800"
    area_color : "#118800"
    dot_stroke_color: "#aaa"
    dot_stroke_size: 3 
    label_min  : false
    smoothing  : 0.5 
    show_grid  : true
  })

  c.add_line {
    data: create_random_points2()
  }
  c.draw()

  c = new Charts.LineChart('chart4', {
    line_color : "#9900cc"
    dot_color  : "#000"
    dot_size: 7 
    dot_stroke_color: "#9900cc"
    dot_stroke_size: 2 
    label_min  : false
    label_max  : false
    fill_area  : false
    smoothing  : 0 
    show_grid  : true
    grid_lines : 4
  })

  c.add_line { 
    data: create_random_points2() 
  }
  c.draw()