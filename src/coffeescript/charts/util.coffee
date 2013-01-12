class Util
  @clone: (obj) ->
    return obj unless obj? && typeof obj == 'object'
    copy = new obj.constructor()

    for key of obj
      copy[key] = Util.clone(obj[key])

    copy


  @comma = (value) ->
    str = value.toString()
    formatted = ""

    i = 0
    j = str.length - 1

    while (j >= 0)
      formatted += str.charAt(i)
      formatted += "," if j % 3 == 0 && j != 0
      i++
      j--

    formatted

  @commas = (value) ->
    # non decimals, decimals
    parts = value.toString().split(".")

    if parts.length == 1
      @comma(parts[0])
    else
      @comma(parts[0]) + "." + parts[1]
