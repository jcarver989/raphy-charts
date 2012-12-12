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


class Point
  constructor: (x, @y, @options = {}) ->
    if @is_date(x)
      @x = x.getTime()
      @is_date_type = true 
    else
      @x = x

    return

  is_date: (potential_date) -> 
    Object.prototype.toString.call(potential_date) == '[object Date]'

exports.Point = Point
