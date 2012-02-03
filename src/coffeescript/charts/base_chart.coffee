class BaseChart
  constructor: (dom_id, options) ->
    container = document.getElementById(dom_id)
    [@width, @height] = @get_dimensions(container)
    @r = Raphael(container, @width, @height)
    @options = options

  get_dimensions: (container) ->
    width  = parseInt(container.style.width)
    height = parseInt(container.style.height)
    [width, height]

