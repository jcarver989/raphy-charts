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


# @import base_chart_options.coffee

class IndexChartOptions extends BaseChartOptions
  @DEFAULTS: {
      bar_margin: 30

      bar_bg_color: "#bdced3"
      bar1_color: "90-#2f5e78-#4284a8"
      bar2_color: "90-#173e53-#225d7c"

      x_padding: 160
      x_padding_right: 100 
      y_padding: 50

      bg_bar_padding: 14

      rounding: 3
      dash_width: 3 

      label_size: 14

      font_family: "Helvetica, Arial, sans-serif"
  }


  constructor: (options) ->
    return super(options, IndexChartOptions.DEFAULTS)
