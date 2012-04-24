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

class Scaler
  constructor: () ->
  domain: (points) ->
    @domain_min = Math.min.apply(Math.min, points)
    @domain_max = Math.max.apply(Math.max, points)
    this

  range:  (points) ->
    @range_min = Math.min.apply(Math.min, points)
    @range_max = Math.max.apply(Math.max, points)
    @scale

  scale: (value) =>
    domain_span = @domain_max - @domain_min
    range_span = @range_max - @range_min
    term1 = (@domain_max * @range_min - @domain_min * @range_max) / domain_span
    term2 = term1 + value * (range_span/domain_span)
    term2


class LogScaler
  constructor: (@base = 10) ->
    return @scale

  scale: (value) =>
    log = Math.log
    log(value) / log(@base)


class Scaling 
  @get_ranges_for_points: (points) ->
    xs = []
    ys = []

    for point in points
      xs.push(point.x)
      ys.push(point.y)

    max_x = Math.max.apply(Math.max, xs)
    max_y = Math.max.apply(Math.max, ys)
    
    min_x = Math.min.apply(Math.min, xs)
    min_y = Math.min.apply(Math.min, ys)

    [max_x, min_x, max_y, min_y]
  
  @threshold: (value, threshold) -> 
    if value > threshold then threshold else value

exports.Scaling = Scaling
exports.Scaler  = Scaler
