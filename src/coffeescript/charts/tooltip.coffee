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


# @import effects.coffee 

class Tooltip
  constructor: (@r, target, text, hover_enabled = true) ->
    size = 30
    width = 50
    height = 25 
    offset = 10
    rounding = 5

    text = Math.round(text*100)/100 if typeof text == "number"
      

    box = target.getBBox()
    x = box.x
    y = box.y
    box_width = box.width
    box_height = box.height
    box_midpoint = (x + box_width/2)

    @popup = @r.set()
    
    @popup.push @r.rect(
      box_midpoint - width/2,
      y - (height + offset),
      width,
      height,
      rounding
    )

    @triangle = @r.triangle(
      box_midpoint,
      y - offset + 4,
      4 
    ).rotate(180)

    @popup.push @triangle

    @popup.attr({
      "fill" : "rgba(0,0,0,.4)"
      "fill-opacity": 0 
      "stroke" : "none"
    })

    @text = @r.text(box_midpoint, y - (height/2 + offset), text)
    @text.attr({ 
      "fill"        : "#fff"
      "font-size"   : 14 
      "text-anchor" : "middle" 
      "width"       : width
      "height"      : height 
      "fill-opacity": 0
      "font-weight" : "bold"
    })

    @popup.toFront()
    @text.toFront()

    if hover_enabled == true
      target.mouseover () => @show()
      target.mouseout  () => @hide()

  animate_opacity: (element, value, time = 200) ->
    element.animate({
      "fill-opacity" : value
    }, time, () =>
      if value == 0
        @text.toBack()
        @popup.toBack()
    )

  hide: () ->
    @animate_opacity(@popup, 0)
    @animate_opacity(@text, 0)

  show: () ->
    @popup.toFront()
    @text.toFront()
    @animate_opacity(@popup, 0.8)
    @animate_opacity(@text, 1)


  translate: (x, y) ->
    @popup.translate(x, y)
    @text.translate(x, y)
    # -2 * x due to 180 degree rotation above
    @triangle.translate(-2 * x, y)


exports.Tooltip = Tooltip
