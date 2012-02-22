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


class Grid
  constructor: (@r, @width, @height, @points, @options) ->

  draw: ->
    grid_lines = Math.round(@points.length / @options.step_size)
    height = @height - @options.y_padding
    width = @width  - @options.x_padding
    x_step_size = Math.round(width  / grid_lines)
    y_step_size = Math.round(height / grid_lines)
    y = @options.y_padding
    paths = @r.set()

    for point, i in @points when i % @options.step_size == 0
      x = @points[i].x
      paths.push @r.path("M #{x}, #{@options.y_padding} L #{x}, #{height} Z")

    for i in [0..grid_lines]
      paths.push @r.path("M #{@options.x_padding}, #{y} L #{width}, #{y} Z") if y <= height
      y += y_step_size

    paths.attr({
      stroke: "#ccc"
      "stroke-width": 1
    }).toBack()

