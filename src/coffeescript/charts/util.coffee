class Util
  @clone: (obj) ->
    return obj unless obj? && typeof obj == 'object'
    copy = new obj.constructor()

    for key of obj
      copy[key] = Util.clone(obj[key])

    copy
