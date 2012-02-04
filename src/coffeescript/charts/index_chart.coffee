# @import point.coffee
# @import label.coffee
# @import scaling.coffee
# @import base_chart.coffee

bar_struct = (label, raw_value, index_value) ->
  label :      label
  raw_value:   raw_value
  index_value: index_value

class IndexChart extends BaseChart
  constructor: (dom_id, options ={}) ->
    super(dom_id, options)

    @bars = []

    @options = {
      bar_margin: 30
      threshold: 1000
      bar_color: "90-#2f5e78-#4284a8"
      beyond_avg_color: "90-#173e53-#225d7c"
      bg_color: "#bdced3"
      x_padding: 150
      y_padding: 50
      rounding: 3
      dash_width: 3
      font_family: "Helvetica, Arial, sans-serif"
    }

  add: (label, raw_value, index_value) ->
    @bars.push bar_struct(label, raw_value, index_value)

  threshold: (index_value) ->
    if index_value > @options.threshold then @options.threshold else index_value

  set_bar_height: () ->
    num_bars = @bars.length
    margin   = @options.bar_margin
    effective_height = @height - @options.y_padding
    @bar_height = (effective_height/ num_bars) - margin


  draw_bg_bar: (raw_value, scaler, y) ->
    x = scaler(raw_value)
    padding = 14
    offset = Math.floor(padding / 2)

    rect = @r.rect(
      @options.x_padding - offset,
      y - offset,
      @width,
      @bar_height + padding,
      @options.rounding
    )

    rect.attr({
      fill: @options.bg_color
      "stroke-width": 0
    }).toBack()



  draw_bar: (raw_value, scaler, y) ->
    x = scaler(@threshold(raw_value))
    if raw_value > 100
      # draw 2 rectangles
      rect = @r.rect(
        @options.x_padding,
        y,
        scaler(100) - @options.x_padding,
        @bar_height,
        @options.rounding
      )

      rect.attr({
        fill: @options.bar_color
        "stroke-width": 0
      })

      rect = @r.rect(
        scaler(100),
        y,
        x - scaler(100),
        @bar_height,
        @options.rounding
      )

      rect.attr({
        fill: @options.beyond_avg_color 
        "stroke-width": 0
      })

    else
      rect = @r.rect(
        @options.x_padding,
        y,
        x - @options.x_padding,
        @bar_height,
        @options.rounding
      )

      rect.attr({
        fill: @options.bar_color
        "stroke-width": 0
      })


    @r.path("M#{@options.x_padding},#{y}L#{x},#{y}").attr({
      "stroke-width" : 0.5 
      "stroke" : "rgba(0,0,0,0.5)"
    })

    @r.path("M#{@options.x_padding},#{y+2}L#{x},#{y+2}").attr({
      "stroke-width" : 1 
      "stroke" : "rgba(255,255,255,0.3)"
    })


  draw_guide_line: (label, index_value, x, opacity = 1) ->
    spacing = 10
    ticks = Math.floor((@height - @options.y_padding) / spacing)

    for i in [0..ticks-1] 
      continue if i % 2 != 0
      rect = @r.rect(
        x - (0.5 * @options.dash_width),
        i * spacing + @options.y_padding,
        @options.dash_width,
        spacing
      )

      rect.attr({
        fill: "rgba(0,0,0,#{opacity})"
        "stroke-width": 0
      })

    new Label(
      @r,
      x,
      20,
      label,
      "",
      14
    ).draw()

    new Label(
      @r,
      x,
      35,
      index_value,
      "",
      10
      ).draw()

  sort_bars: () ->
    bar_copy = (bar for bar in @bars)
    bar_copy.sort (a, b) ->
      b.index_value - a.index_value
    bar_copy
  
  Labels: () -> new LabelFactory(@r)
    
  draw: () ->
    @set_bar_height()

    spacing_factor = @bar_height + @options.bar_margin
    half_bar_height = @bar_height / 2
    y_padding = @options.y_padding

    labels = @Labels()
    .y((num) -> (num * spacing_factor) + y_padding + half_bar_height)
    .x((num) -> 5)
    .size(12)
    .attr({
      "fill" : "#333"
      "text-anchor" : "start"
    })

    x = new Scaler()
        .domain([0, @options.threshold])
        .range([@options.x_padding, @width - @options.x_padding])

    y = (i) =>
      i * (@bar_height + @options.bar_margin) + @options.y_padding

    @draw_guide_line("Above Average", 500, x(500), 0.25)
    @draw_guide_line("High", 1000, x(1000), 0.25)

    for bar, i in @sort_bars()
      @draw_bg_bar(bar.index_value, x, y(i))
      @draw_bar(bar.index_value, x, y(i))
      labels.build(bar.label).draw()

    @draw_guide_line("Average", 100, x(100), 1.00)



exports.IndexChart = IndexChart
