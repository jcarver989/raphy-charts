# Copyright 2012 Joshua Carver  
#  
# Licensed under the Apache License, Version 2.0 (the "License"); 
# you may not use this file except in compliance with the License. 
# You may obtain a copy of the License at 
#  
# http://www.apache.org/licenses/LICENSE-2.0 
#  
# Unless required by applicable law or agreed to in writing, software 
# distributed under the License is distributed on an "AS IS" BASIS, 
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. 
# See the License for the specific language governing permissions and 
# limitations under the License. 


# @import scaling.coffee
# @import tooltip.coffee
# @import dot.coffee
# @import bezier.coffee
# @import util.coffee

class Line
  constructor: (@r, @raw_points, @scaled_points, @height, @width, @options = {}) ->
    # Contains an array of glow elements when a user is hovering over the line
    @glow_elements = []
    @line_set = @r.set()

    @visible = if options['show_line'] == true then true else false

  draw: ->
    path = Bezier.create_path(@scaled_points, @options.smoothing)
    @draw_area(path) if @options.fill_area
    @draw_curve(path)
    @draw_dots_and_tooltips(@scaled_points, @raw_points) if @options.dot_size > 0

    # Add this stuff to our set for future manipulation. This contains
    # everything in this line but the area - because
    @line_set.push path

    # Add an event listener to watch for hovers over 
    @line_set.hover(
      ->
        @glow()
      ,
      ->
        @remove_glow()
      ,
      @,
      @
    )

    return

  draw_curve: (path) ->
    curve = @r.path path
    curve.attr({
      "stroke"       : @options.line_color
      "stroke-width" : @options.line_width
    }).toFront()

    # Add the curve to our set
    @line_set.push curve
    curve

  draw_area: (path) ->
    points = @scaled_points
    padded_height = @height - @options.y_padding

    final_point = points[points.length-1]
    first_point = points[0]

    path += "L #{final_point.x}, #{padded_height} "
    path += "L #{first_point.x}, #{padded_height} "
    path += "Z"

    @area = @r.path(path)
    @area.attr({
      "fill" : @options.area_color 
      "fill-opacity" : @options.area_opacity 
      "stroke" : "none"
    })
    @area.toBack()

  draw_dots_and_tooltips: () ->
    scaled_points = @scaled_points
    raw_points    = @raw_points
    tooltips     = []
    dots         = []
    max_point     = 0
    min_point     = 0

    # draw individual points
    for point, i in scaled_points
      raw_point = raw_points[i] # unscaled
      max_point = i if raw_point.y >= raw_points[max_point].y
      min_point = i if raw_point.y < raw_points[min_point].y

      options = Util.clone(@options)
      options.hover_enabled = !raw_point.options.show_dot

      dot = new Dot(@r, point, options)
      tooltip = new Tooltip(@r, dot.element, raw_point.options.tooltip || raw_point.y, options.hover_enabled)
      tooltip.hide()
      dots.push dot
      tooltips.push tooltip

      # Push the dot to our set - we don't need the tooltip because we shouldn't
      # be able to hover over a dot to show it.
      @line_set.push dot.element

      if raw_point.options.no_dot == true
        dot.hide()

      if raw_point.options.show_dot == true
        dot.activate()
        tooltip.show()

    if @options.label_max
      tooltips[max_point].show()
      dots[max_point].activate()

    if @options.label_min
      tooltips[min_point].show()
      dots[min_point].activate()

  hide: ->
    @area.hide()
    @line_set.hide()
    @remove_glow()
    @visible = false

  show: ->
    @area.show()
    @line_set.show()
    @visible = true

  toggle: ->
    if @visible
      @hide()
    else
      @show()

  glow: ->
    return unless @visible
    @line_set.forEach( (item) ->
      @glow_elements.push(item.glow({ opacity: 0.1 }))
    , @)

  remove_glow: ->
    for i in @glow_elements
      i.remove()

