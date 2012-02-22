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


class BulletChartOptions
  @DEFAULTS: {
    line_width: 4 
    line_color: "#000"

    area_color: "#00aadd"
    area_width: 20 
    area_opacity: 0.2 

    bar_margin: 8 

    show_average: true

    average_width: 4
    average_height: 8
    average_color: "#000" 

    font_family: "Helvetica, Arial, sans-serif"
    x_label_size: 14
    y_label_size: 14

    x_padding: 45
    y_padding: 40
  }


  @merge: (from = {}, to = {}) ->
    opts = {}

    for option, value of from
      opts[option] = value

    for option, value of to when to.hasOwnProperty(option)
      opts[option] = value

    return opts


  constructor: (options) ->
    opts = {}

    for option, value of BulletChartOptions.DEFAULTS
      opts[option] = value

    for option, value of options when options.hasOwnProperty(option)
      opts[option] = value

    return opts
