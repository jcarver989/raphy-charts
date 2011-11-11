class Tooltip
  constructor: (@r, target, text) ->
    size = 30
    width = 50
    height = 25 
    offset = 10
    rounding = 5

    {x, y} = target.getBBox()

    @popup = @r.rect(
      x - width/2, 
      y - (height + offset), 
      width, 
      height, 
      rounding
    )

    @popup.attr({
      "fill" : "rgba(0,0,0,.4)"
      "fill-opacity": 0 
      "stroke" : "transparent"
      "stroke-width" : 0
    })

    @text = @r.text(x, y - (height/2 + offset), text)
    @text.attr({ 
      "fill"        : "#fff"
      "font-size"   : 14 
      "text-anchor" : "middle" 
      "width"       : width
      "height"      : height 
      "fill-opacity": 0
      "font-weight" : "bold"
    })

    target.mouseover () => @show()
    target.mouseout  () => @hide()

  animate_opacity: (element, value, time = 200) ->
    element.animate({
      "fill-opacity" : value
    }, time)

  hide: () ->
    @animate_opacity(@popup, 0)
    @animate_opacity(@text, 0)
  
  show: () ->
    @animate_opacity(@popup, 0.8)
    @animate_opacity(@text, 1)
