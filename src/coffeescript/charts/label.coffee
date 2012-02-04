class LabelFactory
  constructor: (@r, @format = "") ->
    @num = 0
    @font_family = "Helvetica, Arial, sans-serif"
    @color = "#333"

  x: (@x_func)         -> this
  y: (@y_func)         -> this
  size: (@size)        -> this
  attr: (@options)     -> this
 
  build: (text) ->
    label = new Label(
      @r,
      @x_func(@num),
      @y_func(@num),
      text,
      @format,
      @size,
      @font_family,
      @color,
      @options
    )
    @num += 1
    label

class Label
  constructor: (@r, @x, @y, @text, @format = "", @size = 14, @font_family = "Helvetica, Arial, sans-serif", @color = "#333", @options = undefined) ->

  is_date: (potential_date) -> 
    Object.prototype.toString.call(potential_date) == '[object Date]'

  parse_date: (date) ->
    # months are 0 indexed
    groups = @format.match(/%([a-zA-Z])/g)

    formatted = @format 
    for item in groups
      formatted = formatted.replace(item, @parse_format(item)) 
    formatted

  meridian_indicator: (date) ->
    hour = date.getHours()
    if hour >= 12 then "pm" else "am"

  to_12_hour_clock: (date) ->
    hour = date.getHours()
    fmt_hour = hour % 12
    if fmt_hour == 0 then 12 else fmt_hour

  format_number: (number) -> 
    if number > 1000000
      millions = number / 1000000
      millions = Math.round(millions * 100) / 100 
      millions + "m"
    else if number > 1000
      thousands = number / 1000
      Math.round(thousands * 10) / 10 + "k"
    else
      Math.round(number*10)/10

  fmt_minutes: (date) ->
    minutes = date.getMinutes()
    if minutes < 10 then "0#{minutes}" else minutes
    
  parse_format: (format) ->
    switch format 
      when "%m" then @text.getMonth()+1
      when "%d" then @text.getDate()
      when "%Y" then @text.getFullYear()
      when "%H" then @text.getHours()
      when "%M" then @fmt_minutes(@text)
      when "%I" then @to_12_hour_clock(@text) 
      when "%p" then @meridian_indicator(@text)

  draw: () ->
    text = "" 
    
    if @is_date(@text) 
      text = @parse_date(@text)
    else if typeof @text == "number" 
      text = @format_number(@text) 
    else
      text = @text

    @element = @r.text(@x, @y, text)
    width = @element.getBBox().width
    margin = 5

    @element.attr({ 
      "fill"        : @color
      "font-size"   : @size
      "font-weight" : "normal"
      "text-anchor" : "middle"
      "font-family" : @font_family
    })

    if @options?
      @element.attr(@options)
    else
      x = if @x < width then (width/2) + margin else @x
      @element.attr({
        "x"           : x
      })

