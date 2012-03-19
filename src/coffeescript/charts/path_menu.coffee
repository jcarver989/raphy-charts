# @import base_chart.coffee
# @import base_chart_options.coffee
# @import point.coffee

class PathMenuOptions extends BaseChartOptions
  @DEFAULTS: {
    main_circle_radius: 70
    child_radius_multiplier: 0.15
    hover_scale_multiplier:  1.2
    inactive_opacity: 0.4

    outer_radius_multiplier: 1.35
    outer_radius2_multiplier: 1.5 

    bounce_radius: 1.2
    fill_color: "#00a6dd"
  }

  constructor: (options) ->
    return super(options, PathMenuOptions.DEFAULTS)

point_on_circle = (center_point, r, theta) ->
  x = r * Math.cos(theta) + center_point.x
  y = r * Math.sin(theta) + center_point.y
  new Point(x, y)

# animation to move an obejct to a point and "bounce" back to another point
bounce_to_and_back = (shape, bounce_point, final_point, bounce_time, return_time) ->
  translate = (shape, point, time, callback = undefined) ->
    shape.animate({
      "x"  : point.x
      "y"  : point.y
      "cx" : point.x
      "cy" : point.y
    }, time, "<", callback)

  translate(shape, bounce_point, bounce_time, () ->
    translate(shape, final_point, return_time)
  )

draw_circle = (x, y, r, text_size) ->
  attrs = {
    fill: @options.fill_color
    stroke: "none"
  }

  set = @r.set()
  set.push @r.circle(x,y,r).attr(attrs)
  set.push @r.text(x, y, "+").attr({ "font-size" : text_size, "fill" : "#fff"})
  set.attr({ cursor: "pointer" }).toFront()


class PathMenu extends BaseChart
  constructor: (dom_id, options = {}) ->
    super(dom_id, new PathMenuOptions(options))
    @center_point       = new Point(@width/2, @height/2)
    @main_radius        = @options.main_circle_radius
    @child_radius       = @main_radius * @options.child_radius_multiplier

    # for animation
    @outer_radius       = @main_radius  * @options.outer_radius_multiplier
    @outer_radius2      = @outer_radius * @options.outer_radius2_multiplier 
    @bounce_radius      = @outer_radius * @options.bounce_radius

    @children = []


  add_hover: (circle) ->
    hover_in = (e) =>
      circle[0].animate({
        "r" : @options.hover_scale_multiplier * @child_radius 
        "opacity" : 1
        "stroke-width" : 2 
        "stroke" : "rgba(0,0,0,.4)"
      }, 200)

      circle[1].animate({
        "font-size" : 22 
        "opacity": 1
        "fill" : "#fff"
      }, 200)

      circle._label.animate({
          "opacity" : 1
      }, 200)

    hover_out = (e) =>
      circle[0].animate({
        r : @child_radius 
        opacity: @options.inactive_opacity 
        stroke: "none"
        "stroke-width" : 0
      }, 200)

      circle[1].animate({
        opacity: 0
      }, 200)

      circle._label.animate({
        "opacity" : 0 
      }, 200)

    circle._activate   = hover_in
    circle._deactivate = hover_out


    circle.hover hover_in, hover_out

  add: (data) ->
    @children.push(data)

  create_circles_along_radius: (items, circle_radius, outer_radius, callback) ->
    step_size = (2 * Math.PI) / 24 

    for item, i in items
      radians = i * step_size
      {x, y}  = point_on_circle(@center_point, outer_radius, radians)
      circle = @draw_circle(@center_point.x, @center_point.y, circle_radius, 16) 
      circle._realx   = x
      circle._realy   = y
      circle._radians = radians
      circle.attr({
        opacity: @options.inactive_opacity
      }).toFront()

      circle[1].attr({ opacity: 0 })

      @add_label_to_circle(item, circle)
      @add_hover(circle)
      callback(item, circle)

  bounce_circles: (parent_circle, circles) ->
    return unless circles

    base     = 100
    interval = 10 
    return_time = 100

    for circle, i in circles
      radians = circle._radians 
      {x,y} = point_on_circle(@center_point, @bounce_radius, radians)
      bounce_to = new Point(x, y)

      index = undefined
      return_to = undefined

      if parent_circle._active
        index = circles.length - i
        return_to = @center_point
        circle.toBack()
      else
        index = i
        return_to = new Point(circle._realx, circle._realy)
        circle.toFront()

      # circles animate last out first in
      bounce_time = base + index * interval

      bounce_to_and_back(
        circle, 
        bounce_to,
        return_to,
        bounce_time,
        return_time
      )

  add_click_to_circle: (circle, is_root = false) ->
    handler = (e) =>
      if circle._active 
        circle.hover(circle._activate, circle._deactivate) 
        degrees = 0

        if circle._children
          for child in circle._children when child._active
            child._deactivate()
            child._click_handler()
      else 
        circle.unhover(circle._activate, circle._deactivate)
        degrees = 45 

      @bounce_circles(circle, circle._children) 
      circle.animate({ 
        transform: "r#{degrees}"
      }, 200)

      circle._active = !circle._active

    circle._click_handler = handler
    circle.click handler
    
  add_label_to_circle: (data, circle) ->
    label = @r.text(
      circle._realx,
      circle._realy,
      data.label
    ).attr({
      "font-size" : 14
    })

    label2 = @r.text(
      circle._realx,
      circle._realy + 15,
      format_number(data.value)
    ).attr({
      "font-size" : 12
      "fill" : @options.fill_color
    }).toBack()

    labels = @r.set()
    labels.push(label)
    labels.push(label2)

    if circle._realx > @center_point.x 
      anchor = "start"
      offset = 30
    else 
      anchor = "end"
      offset = -30
    
    labels.attr({
      "text-anchor" : anchor 
      "x" : circle._realx + offset 
      "opacity" : 0
    })

    circle._label = labels

  add_grandchildren: (data, circle) ->
    return unless data.children
    circle._children = []

    @create_circles_along_radius data.children, @child_radius, @outer_radius2, (grandchild, grandchild_circle) =>
      circle._active = false
      circle._children.push(grandchild_circle)


  draw_circle: (x, y, r, text_size) ->
    attrs = {
      fill: @options.fill_color
      stroke: "none"
    }

    set = @r.set()
    set.push @r.circle(x,y,r).attr(attrs)
    set.push @r.text(x, y, "+").attr({ "font-size" : text_size, "fill" : "#fff"})
    set.attr({ cursor: "pointer" }).toFront()

  draw: () ->
    
    main_circle = @draw_circle @center_point.x, @center_point.y, @main_radius, 100
    main_circle._active = false
    main_circle._children = []
    @add_click_to_circle(main_circle, true)

    children = @children.length 
    step_size = (2 * Math.PI) / children

    @create_circles_along_radius @children, @child_radius, @outer_radius, (child, circle) =>
      @add_grandchildren(child, circle)
      @add_click_to_circle(circle)
      main_circle._children.push(circle)

    main_circle.toFront()



exports.PathMenu = PathMenu

