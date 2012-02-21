# @import point.coffee
# @import label.coffee
# @import scaling.coffee
# @import base_chart.coffee
# @import index_chart_options.coffee
# @import effects.coffee
# @import tooltip.coffee


# TODO: Refactor, getting a bit messy

bar_struct = (label, raw_value, index_value) ->
  label :      label
  raw_value:   raw_value
  index_value: index_value

guide_struct = (label, index_value, opacity) ->
  label: label
  index_value: index_value
  opacity: opacity

class IndexChart extends BaseChart
  constructor: (dom_id, options ={}) ->
    super(dom_id, new IndexChartOptions(options))

    @effects = new Effects(@r)
    @bars    = []
    @guides  = []

    # 100 == the index score
    @index = 100

  add: (label, raw_value, index_value) ->
    @bars.push bar_struct(label, raw_value, index_value)

  add_guide_line: (label, index_value, opacity = 1) ->
    @guides.push guide_struct(label, index_value, opacity) 

  add_raw_label: (label) ->
    labels = new LabelSet(@r)
    .x((num) => @width - 10)
    .y((i) -> i * 15 + 15)
    .size(@options.label_size)
    .attr({
      "fill" : "#333"
      "text-anchor" : "end"
      "font-weight" : "bold"
    })

    labels.draw(label)
    labels.draw("(raw value)").attr({
      "font-weight" : "normal"
      "font-size"   : 10
    })


  set_bar_height: () ->
    num_bars = @bars.length
    margin   = @options.bar_margin
    effective_height = @height - @options.y_padding
    @bar_height = (effective_height/ num_bars) - margin

  set_threshold: () ->
    thresholds = (guide.index_value for guide in @guides)
    @threshold  = Math.max.apply(Math.max, thresholds)


  format_tooltip: (raw_value) ->
    (raw_value / 100) + "x"

  draw_raw_bar: (raw_value, y) ->
    padding = 14
    offset = Math.floor(padding / 2)
    margin = 10
    width  = @options.x_padding_right  - margin

    rect = @r.rect(
      @width - width,
      y - offset,
      @width - @options.x_padding_right,
      @bar_height + padding,
      @options.rounding
    )

    rect.attr({
      fill: "rgba(0,0,0,.1)" 
      "stroke" : "none"
    })


    @effects.straight_line(
      new Point(
        @width - width, 
        @options.y_padding - 10
      ),

      new Point(
        @width - width,
        @height
      )
    ).attr({
      stroke : "rgba(0,0,0,0.25)"
      "stroke-width" : 0.1 
    })


  draw_bg_bar: (raw_value, scaler, y) ->
    x = scaler(raw_value)
    padding = @options.bg_bar_padding
    offset = Math.floor(padding / 2)

    rect = @r.rect(
      @options.x_padding - offset,
      y - offset,
      @width,
      @bar_height + padding,
      @options.rounding
    )

    rect.attr({
      fill: @options.bar_bg_color
      "stroke" : "none"
    }).toBack()

  shade_bar: (bar, color = @options.bar1_color) ->
    bar.attr({
      fill: color 
      "stroke" : "none"
    })

    @effects.one_px_shadow(bar)
    @effects.one_px_highlight(bar)


  render_bar: (startx, starty, width, color = @options.bar1_color) ->
    rect = @r.rect(
      startx,
      starty,
      width,
      @bar_height,
      @options.rounding
    )

    @shade_bar(rect, color)

    rect

  draw_bar: (raw_value, x_scaler, y) ->
    x = x_scaler(Scaling.threshold(raw_value, @threshold))

    if raw_value > @index 
      index_x = x_scaler(@index)

      # bar for < @index
      rect1 = @render_bar(
        @options.x_padding,
        y,
        index_x - @options.x_padding
      )

      # bar for > @index
      rect2 = @render_bar(
        index_x,
        y,
        x - index_x,
        @options.bar2_color
      )

      tooltip = new Tooltip(@r, rect2, @format_tooltip(raw_value))
      tooltip.translate(rect2.getBBox().width/2, 0)

      # enable tooltip on both bars
      rect1.mouseover () -> tooltip.show()
      rect1.mouseout  () -> tooltip.hide()

    else
      rect = @render_bar(
        @options.x_padding,
        y,
        x - @options.x_padding,
      )

      tooltip = new Tooltip(@r, rect, @format_tooltip(raw_value))
      tooltip.translate(rect.getBBox().width/2, 0)

  draw_guide_line: (label, index_value, x, opacity = 1) ->
    start = new Point(x, @options.y_padding)
    end   = new Point(x, @height) 

    @effects.vertical_dashed_line(start, end, @options.dash_width).attr({
      fill: "rgba(0,0,0,#{opacity})"
      "stroke" : "none"
    })

    labels = new LabelSet(@r)
    .x(() -> x)
    .y((i) -> i * 15 + 15)
    .size(@options.label_size)
    .attr({fill: "rgba(0,0,0,#{opacity})"})

    labels.draw(label).attr({
      "font-weight": "bold"
    })

    labels.draw(index_value).attr({
      "font-size" : 10
    })

  sort_bars_by_index: () ->
    bar_copy = (bar for bar in @bars)
    bar_copy.sort (a, b) -> b.index_value - a.index_value
    bar_copy


  clear: () ->
    super()
    @bars    = []
    @guides  = []
  
  draw: () ->
    @set_bar_height()
    @set_threshold()

    spacing_factor = @bar_height + @options.bar_margin
    half_bar_height = @bar_height / 2
    y_padding = @options.y_padding
    x_padding = @options.x_padding

    labels = new LabelSet(@r)
    .y((num) -> (num * spacing_factor) + y_padding + half_bar_height)
    .x((num) -> x_padding - 30)
    .size(12)
    .attr({
      "fill" : "#fff"
      "text-anchor" : "end"
    })


    raw_value_labels = new LabelSet(@r)
    .y((num) -> (num * spacing_factor) + y_padding + half_bar_height)
    .x((num) => @width - 10)
    .size(@options.label_size)
    .attr({
      "fill" : "#333"
      "text-anchor" : "end"
    })

    x = new Scaler()
    .domain([0, @threshold])
    .range([@options.x_padding, @width - @options.x_padding_right])

    y = (i) =>
      i * (@bar_height + @options.bar_margin) + @options.y_padding

    for bar, i in @sort_bars_by_index()
      @draw_bg_bar(bar.index_value, x, y(i))
      @draw_raw_bar(bar.raw_value, y(i))
      @draw_bar(bar.index_value, x, y(i))

      raw_label = raw_value_labels.draw(bar.raw_value)

      label = labels.draw(bar.label)
      @effects.black_nub(label)

    for guide in @guides
      @draw_guide_line(
        guide.label,
        guide.index_value,
        x(guide.index_value),
        guide.opacity
      )

exports.IndexChart = (container, options) -> 
  return new IndexChart(container, options)
