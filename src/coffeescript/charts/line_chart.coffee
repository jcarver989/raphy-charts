# @import point.coffee
# @import bezier.coffee
# @import scaling.coffee
# @import tooltip.coffee
# @import dot.coffee
# @import line_chart_options.coffee

class LineChart
  constructor: (dom_id, options = {}) ->
    @container = document.getElementById(dom_id)
    @width   = parseInt(@container.style.width)
    @height  = parseInt(@container.style.height)
    @padding = 40 
    @options = new LineChartOptions(options)

    @r = Raphael(@container, @width, @height)

  add_line: (@raw_points, options = {}) ->
    @points = Scaling.scale_points(@width, @height, @raw_points, @padding)

  draw_curve: () ->
    path = @r.path Bezier.create_path(@points, @options.smoothing)
    path.attr({
      "stroke"       : @options.line_color
      "stroke-width" : @options.line_width
    })

  draw_area: () ->
    padded_height = @height
    padded_width = @width + @padding

    final_point = @points[@points.length-1]
    first_point = @points[0]

    path = ""

    for point, i in @points
      if i == 0
        path += "M #{first_point.x}, #{first_point.y}" 
      else
        path += "L #{point.x}, #{point.y}"

    path += "M #{final_point.x}, #{final_point.y}"
    path += "L #{final_point.x}, #{padded_height}"
    path += "L #{first_point.x}, #{padded_height}"
    path += "L #{first_point.x}, #{first_point.y}"
    path += "Z"

    @r.path(path).attr({
      "fill" : @options.area_color 
      "fill-opacity" : @options.area_opacity 
      "stroke" : "none"
    })

  draw: () ->
    @r.clear()
    @draw_curve()
    @draw_area() if @options.fill_area

    tooltips = []
    dots = []
    max_point = 0
    min_point = 0

    # draw individual points
    for point, i in @points
      dots.push new Dot(@r, point, @options)
      tooltips.push new Tooltip(@r, dots[i].element, @raw_points[i].y) 
      max_point = i if @raw_points[i].y >= @raw_points[max_point].y 
      min_point = i if @raw_points[i] > @raw_points[min_point].y 

    if @options.label_max
      tooltips[max_point].show()
      dots[max_point].activate()

    if @options.label_min
      tooltips[min_point].show()
      dots[min_point].activate()

    return
