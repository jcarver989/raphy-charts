class Label
  constructor: (@r, @x, @y, @text, @format, @size = 14) ->

  is_date: (potential_date) -> 
    Object.prototype.toString.call(potential_date) == '[object Date]'

  parse_date: (date) ->
    # months are 0 indexed
    groups = @format.match(/%([a-zA-Z])/g)

    formatted = @format 
    for item in groups
      formatted = formatted.replace(item, @parse_format(item)) 
    formatted

  to_12_hour_clock: (date) ->
    hour = date.getHours()
    indicator = if hour >= 12 then "pm" else "am"
    "#{hour % 12}#{indicator}"

  format_number: (number) ->
    if number >= 1000000
      number / 1000000}
    Math.round(number*10)/10
    
  parse_format: (format) ->
    switch format 
      when "%m" then @text.getMonth()+1
      when "%d" then @text.getDate()
      when "%Y" then @text.getFullYear()
      when "%H" then @text.getHours()
      when "%M" then @text.getMinutes()
      when "%I" then @to_12_hour_clock(@text) 

  draw: () ->
    text = "" 
    
    if @is_date(@text) 
      text = @parse_date(@text)
    else if typeof @text == "number" 
      text = @format_number(@text) 
    else
      text = @text

    @element = @r.text(@x, @y, text)
    @element.attr({ 
      "fill"        : "#333"
      "font-size"   : @size
      "font-weight" : "bold"
    })

