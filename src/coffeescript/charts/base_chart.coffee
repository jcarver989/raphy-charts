is_element = (o) ->
  if o.hasOwnProperty("tagName") then true else false

class BaseChart
  constructor: (dom_container, options) ->
    container = if is_element(dom_container) then dom_container else document.getElementById(dom_container)
    console.log(this)
    [@width, @height] = @get_dimensions(container)
    @r = Raphael(container, @width, @height)
    @options = options

  get_dimensions: (container) ->
    width  = parseInt(container.style.width)
    height = parseInt(container.style.height)
    [width, height]

