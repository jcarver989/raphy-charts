class Label
  constructor: (@r, @height, @x, @text) ->
    @size = 14

  is_date: (potential_date) -> 
    Object.prototype.toString.call(potential_date) == '[object Date]'

  parse_date: (date) ->
    # months are 0 indexed
    "#{date.getMonth()+1}/#{date.getDate()}"

  draw: () ->
    text = if @is_date(@text) then @parse_date(@text) else @text
    @element = @r.text(@x, @height - @size, text)
    @element.attr({ 
      "fill"        : "#333"
      "font-size"   : @size 
      "font-weight" : "bold"
    })

