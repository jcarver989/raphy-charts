# @import point.coffee 

Raphael.fn.triangle = (cx, cy, r) ->
    r *= 1.75
    this.path("M".concat(cx, ",", cy, "m0-", r * .58, "l", r * .5, ",", r * .87, "-", r, ",0z"))


# Utility mehtods for visual augmentations like shading, dashed lines etc.
class Effects
  constructor: (@r) ->


  black_nub: (target, h_padding = 10, v_padding = 8, offset = 0, rounding = 0) ->
    box = target.getBBox()
    x = box.x
    y = box.y
    box_width = box.width
    box_height = box.height
    box_midpoint = (x + box_width/2)

    width  = box_width  + (2 * h_padding)
    height = box_height + (2 * v_padding)

    popup = @r.set()
    
    popup.push @r.rect(
      box_midpoint - width/2,
      y - v_padding,
      width,
      height,
      rounding
    )

    popup.push(@r.triangle(
      x + box_width + h_padding + 2,
      y + 2 + (0.5 * box_height),
      4 
    ).rotate(90))

    popup.attr({
      "fill" : "#333"
      "stroke" : "transparent"
      "stroke-width" : 0
    }).toBack()

  straight_line: (start_point, end_point) ->
    @r.path("M#{start_point.x},#{start_point.y}L#{end_point.x},#{end_point.y}")

  vertical_dashed_line: (start_point, end_point, dash_width = 3, spacing = 10) ->
    height = end_point.y - start_point.y
    ticks = Math.floor(height / spacing)

    dashes = @r.set()

    for i in [0..ticks-1] 
      continue if i % 2 != 0
      rect = @r.rect(
        start_point.x - (0.5 * dash_width),
        i * spacing + start_point.y,
        dash_width,
        spacing
      )

      dashes.push(rect)

    dashes


  get_points_along_top_of_bbox: (rect, y_offset = 0) ->
    bounding_box = rect.getBBox()
    x1 = bounding_box.x
    x2 = bounding_box.x + bounding_box.width
    y1 = bounding_box.y + y_offset 
    y2 = y1 # straight line
    [new Point(x1, y1), new Point(x2, y2)]

  # rectangles only
  one_px_highlight: (rect) ->
    [start, end] = @get_points_along_top_of_bbox(rect, 2)
    @straight_line(start, end).attr({
      "stroke-width" : 1 
      "stroke" : "rgba(255,255,255,0.3)"
    })

    @straight_line

  one_px_shadow: (rect) ->
    [start, end] = @get_points_along_top_of_bbox(rect)
    @straight_line(start, end).attr({
      "stroke-width" : 0.5 
      "stroke" : "rgba(0,0,0,0.5)"
    })

    @straight_line


exports.Effects = Effects
