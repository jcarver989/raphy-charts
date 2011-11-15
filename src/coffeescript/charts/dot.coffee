class Dot
  constructor: (@r, @point, @opts, @scale_factor = 1.5) ->
    @element = @r.circle(point.x, point.y, @opts.dot_size)
    @style_dot()
    @attach_handlers()

  style_dot: () ->
    @element.attr({
      "fill"         : @opts.dot_color
      "stroke"       : @opts.dot_stroke_color 
      "stroke-width" : @opts.dot_stroke_size 
    })

    @element.toFront()

  activate: () ->
    @element.attr({ "fill" : "#333"})
    @element.animate({ 
      "r" : @opts.dot_size * @scale_factor
    }, 200)

  deactivate: () ->
    shrink_factor = 1 / @scale_factor
    @element.attr({ "fill" : @opts.dot_color })
    @element.animate({
      "r" : @opts.dot_size
    }, 200)

  attach_handlers: () ->
    @element.mouseover () => @activate()
    @element.mouseout  () => @deactivate()
