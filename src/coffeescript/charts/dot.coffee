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


class Dot
  constructor: (@r, @point, @opts, @scale_factor = 1.5) ->
    @element = @r.circle(point.x, point.y, @opts.dot_size)
    @style_dot()
    @attach_handlers() if @opts.hover_enabled

  style_dot: () ->
    @element.attr({
      "fill"         : @opts.dot_color
      "stroke"       : @opts.dot_stroke_color 
      "stroke-width" : @opts.dot_stroke_size 
    })

    @element.toFront()

  activate: () ->
    @element.attr({ "fill" : "#333"})
    @element.animate({ 
      "r" : @opts.dot_size * @scale_factor
    }, 200)

  deactivate: () ->
    shrink_factor = 1 / @scale_factor
    @element.attr({ "fill" : @opts.dot_color })
    @element.animate({
      "r" : @opts.dot_size
    }, 200)

  attach_handlers: () ->
    @element.mouseover () => @activate()
    @element.mouseout  () => @deactivate()

  hide: () ->
    @element.hide()
