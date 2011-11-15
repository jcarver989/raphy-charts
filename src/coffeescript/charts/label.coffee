class Label
  constructor: (@r, @height, @x, @text) ->
    @size = 14

  draw: () ->
    @text = @r.text(@x, @height - @size, @text)
    @text.attr({ 
      "fill"        : "#333"
      "font-size"   : @size 
      "font-weight" : "bold"
    })
