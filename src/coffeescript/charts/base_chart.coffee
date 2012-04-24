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


is_element = (o) ->
  if o.tagName != undefined then true else false

class BaseChart
  constructor: (dom_container, options) ->
    container = if is_element(dom_container) then dom_container else document.getElementById(dom_container)
    [@width, @height] = @get_dimensions(container)
    @r = Raphael(container, @width, @height)
    @options = options

  get_dimensions: (container) ->
    width  = parseInt(container.style.width)
    height = parseInt(container.style.height)
    [width, height]


  clear: () ->
    @r.clear()
