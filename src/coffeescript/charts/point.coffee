class Point
  @date_regex: /\/|,|\.|\-/ 
  constructor: (x, @y) ->
    @x = if typeof x == "string" then @parse_x(x) else x


  toString: ->
    return @x unless @type == "date"
    date = new Date(@x)
    [date.getMonth() + 1, date.getDate()].join("/")

  # parse potential dates
  parse_x: (x) ->
    parts = x.split(Point.date_regex)
    return x unless parts.length > 1

    # probably a date
    if parts.length <= 3
      try
        numbers = (parseInt(i) for i in parts)
        month = numbers[0]-1 # jan = 0
        day   = numbers[1]
        year  = if numbers.length == 3 then numbers[2] else new Date().getFullYear()
        @type = "date"
        date = new Date(year, month, day)
        return date.getTime()
      catch e
        return x
