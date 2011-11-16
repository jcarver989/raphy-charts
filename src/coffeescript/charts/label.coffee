class Label
  constructor: (@r, @height, @x, @text, @format = "%m/%d" ) ->
    @size = 14

  is_date: (potential_date) -> 
    Object.prototype.toString.call(potential_date) == '[object Date]'

  parse_date: (date) ->
    # months are 0 indexed
    groups = @format.match(/%([a-zA-Z])/g)

    formatted = @format 
    for item in groups
      formatted = formatted.replace(item, @parse_format(item)) 
    formatted
    
  parse_format: (format) ->
    switch format 
      when "%m" then @text.getMonth()+1
      when "%d" then @text.getDate()
      when "%Y" then @text.getFullYear()
      when "%H" then @text.getHours()
      when "%M" then @text.getMinutes()

  draw: () ->
    text = if @is_date(@text) then @parse_date(@text) else @text
    @element = @r.text(@x, @height - @size, text)
    @element.attr({ 
      "fill"        : "#333"
      "font-size"   : @size 
      "font-weight" : "bold"
    })

