# renders bars instead of lines
# @import scaling.coffee
# @import tooltip.coffee

class LineBar
  constructor: (@r, @raw_points, @scaled_points, @height, @width, @options = {}) ->
    @effective_height = @height - @options.y_padding

    # 1st param to rect is top left corner
    # point.x should be the midpoint of the bar
    # hence x = point.x - x_offset 
    @x_offset = @options.bar_width / 2

  draw: ->
    @draw_bars()

  draw_bars: ->
    set = @r.set()
    tooltips = []
    max_point = 0
    min_point = 0

    for point, i in @scaled_points
      x = point.x - @x_offset
      rect = @r.rect(x, point.y, @options.bar_width, @effective_height - point.y)
      set.push rect

      tooltips.push new Tooltip(@r, rect, @raw_points[i].y)
      max_point = i if @raw_points[i].y >= @raw_points[max_point].y
      min_point = i if @raw_points[i].y < @raw_points[min_point].y


    set.attr({
      "fill" : @options.line_color
      "stroke" : "none"
    })

    if @options.label_max
      tooltips[max_point].show()

    if @options.label_min
      tooltips[min_point].show()

