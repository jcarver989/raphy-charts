class Point
  constructor: (x, @y) ->
    if @is_date(x)
      @x = x.getTime()
      @is_date_type = true 
    else
      @x = x

    return

  is_date: (potential_date) -> 
    Object.prototype.toString.call(potential_date) == '[object Date]'

exports.Point = Point
