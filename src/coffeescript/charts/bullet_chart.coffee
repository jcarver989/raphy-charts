# @import point.coffee
# @import label.coffee
# @import scaling.coffee

bar = (label, value, average, comparison) ->
  {
    label: label,
    value: value,
    average: average
    comparison: comparison
  }


class BulletChart
  constructor: (dom_id, options = {}) ->
    container = document.getElementById(dom_id)

    [@width, @height] = @get_dimensions(container)
    @options = new BulletChartOptions(options)

    @r = Raphael(container, @width, @height)
    @bars = []

  get_dimensions: (container) ->
    width  = parseInt(container.style.width)
    height = parseInt(container.style.height)
    [width, height]

  
  add: (label, value, average, comparison) ->
    @bars.push bar.apply(bar, arguments)


  draw_background: (point, y_offset) ->
    rect = @r.rect(
      @options.x_padding,
      y_offset,
      point.x,
      @options.area_width
    )

    rect.attr({
      fill: @options.area_color
      "stroke-width": 0
    })

  draw_line: (point, background_midpoint) ->
    y = background_midpoint.y - @options.line_width/2
    rect = @r.rect(
      @options.x_padding,
      y,
      point.x,
      @options.line_width
    )

    rect.attr({
      fill: @options.line_color
      "stroke-width": 0
    })

  
  draw_average: (point, midpoint_y) ->
    rect = @r.rect(
      point.x - (@options.average_width/2),
      midpoint_y - @options.average_height/2,
      @options.average_width,
      @options.average_height
    )

    rect.attr({
      fill: @options.average_color
      "stroke-width": 0
    })

  draw_label: (text, offset) ->


  draw: () ->
    for bar, i in @bars
      points = Scaling.scale_points(
        @width,
        @height,
        [
          new Point(bar.comparison, 0),
          new Point(bar.value, 0),
          new Point(bar.average, 0),
          new Point(0,0) # dummy for scaling
        ],
        @options.x_padding,
        @options.y_padding
      )

      y_offset = i * (@options.area_width + @options.bar_margin)
      @draw_background(points[0], y_offset)

      midpoint_y = y_offset + @options.area_width/2
      @draw_line(points[1], new Point(points[0].x, midpoint_y))

      @draw_average(points[2], midpoint_y)

      new Label(
       @r,
       0,
       y_offset + @options.area_width/2,
       bar.label,
       "",
       @size = 14,
       @options.font_family
      ).draw()

exports.BulletChart = BulletChart
