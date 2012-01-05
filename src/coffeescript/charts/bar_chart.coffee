# @import base_chart.coffee 
# @import point.coffee
# @import scaling.coffee
# @import bar_chart_options.coffee 

class BarChart extends BaseChart
  constructor: (dom_id, options = {}) ->
    super
    @options = new BarChartOptions(options)
    @effective_height = @height - @options.y_padding
    @bar_options = []
    @bars = []

    # 0,0 point for scale
    @values = []

  add: (args) ->
    {label, value} = args
    @bar_options.push BarChartOptions.merge(@options, args.options)
    @values.push value
    @bars.push { label: label, value: value}

  render_bar: (x_label, y_label, topleft_corner, options) ->
    rect = @r.rect(
      topleft_corner.x,
      topleft_corner.y,
      @options.bar_width,
      @effective_height - topleft_corner.y
    )

    rect.attr({
      "fill" : options.bar_color
      "stroke-width": 0
    })


    console.log @options

    new Label(
      @r,
      topleft_corner.x + @options.bar_width/2,
      @height - (@options.x_label_size + 5),
      x_label,
      "",
      @options.x_label_size,
      @options.font_family,
      @options.x_label_color
    ).draw()

    new Label(
      @r,
      topleft_corner.x + @options.bar_width/2,
      topleft_corner.y + @options.y_label_size + 5
      y_label,
      "",
      @options.y_label_size,
      @options.font_family,
      @options.y_label_color
    ).draw()

  draw: ->
    points = (new Point(i, value) for value, i in @values)
    points.push new Point(0,0)

    @scaled_values = Scaling.scale_points(
      @width,
      @height,
      points
      @options.x_padding,
      @options.y_padding
    )

    for bar, i in @bars
      scaled_x = i * (@options.bar_width + @options.bar_spacing) + @options.x_padding
      scaled_y = @scaled_values[i].y
      tl_bar_corner = new Point(scaled_x, scaled_y)
      @render_bar(bar.label, bar.value, tl_bar_corner, @bar_options[i])


exports.BarChart = BarChart
