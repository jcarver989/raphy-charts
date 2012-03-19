# @import base_chart.coffee
# @import base_chart_options.coffee
# @import point.coffee
# @import path_menu.coffee

# draw arc where elipse is cenetred at xloc, yloc
arc = (xloc, yloc, value, total, R) ->
  alpha = 360 / total * value
  a = (90 - alpha) * Math.PI / 180
  x = xloc + R * Math.cos(a)
  y = yloc - R * Math.sin(a)
  path = undefined 

  if (total == value)
    path = [
      ["M", xloc, yloc - R],
      ["A", R, R, 0, 1, 1, xloc - 0.01, yloc - R]
    ]
  else
    path = [
      ["M", xloc, yloc - R],
      ["A", R, R, 0, +(alpha > 180), 1, x, y]
    ]

  { path: path }

class CircleProgressOptions extends BaseChartOptions
  @DEFAULTS: {
    radius: 55 
    stroke_width: 30 
    font_color: "#333333"
    label_color: "#333333"
    fill_color: "#fff"
    stroke_color: "#81ae14"
    background_color: "#222222"
    text_shadow: false
  }

  constructor: (options) ->
    return super(options, CircleProgressOptions.DEFAULTS)

class CircleProgress extends BaseChart
  constructor: (dom_id, @label, @value, options = {}) ->
    super(dom_id, new CircleProgressOptions(options))
    @center_point = new Point(@width / 2, @height /2)
    @r.customAttributes.arc = arc

  draw: () ->
    path = @r.path().attr({
      "stroke-width" : @options.stroke_width
      "stroke" : @options.stroke_color
      arc      : [@center_point.x, @center_point.y, 0, 100, @options.radius]
    })


    @r.circle(@center_point.x, @center_point.y, @options.radius).attr({
      "fill"   : @options.fill_color
      "stroke" : "none" 
      "stroke-width" : 0
    })


    percent = Math.round(@value * 100 / 100) + "%"
    @r.text(@center_point.x, @center_point.y, percent).attr({
      'font-size' : @options.radius / 2.5
      'fill' : @options.font_color 
      'font-weight' : 'bold'
    })

    label = @r.text(@center_point.x, @center_point.y + 1.8 * @options.radius, @label).attr({
      'font-size' : @options.radius / 2.5
      'font-weight' : 'bold'
      'fill' : @options.label_color 
    })

    if @options.text_shadow
      @r.text(@center_point.x, @center_point.y + 1.8 * @options.radius + 1, @label).attr({
        'font-size' : @options.radius / 2.5
        'font-weight' : 'bold'
        'fill' : @options.text_shadow 
      }).toBack()


    path.animate({
      arc      : [@center_point.x, @center_point.y, @value, 100, @options.radius]
    }, 1500, '<')
      

    
exports.CircleProgress = CircleProgress
