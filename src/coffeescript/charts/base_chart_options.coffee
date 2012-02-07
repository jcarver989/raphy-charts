class BaseChartOptions

  @merge: (from = {}, to = {}) ->
    opts = {}

    for option, value of from
      opts[option] = value

    for option, value of to when to.hasOwnProperty(option)
      opts[option] = value

    return opts

  constructor: (options, defaults) ->
      opts = {}

      for option, value of defaults
        opts[option] = value

      for option, value of options when options.hasOwnProperty(option)
        opts[option] = value

      return opts
