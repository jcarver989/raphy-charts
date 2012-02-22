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


# @import point.coffee
# @import bezier.coffee
# @import scaling.coffee
# @import tooltip.coffee
# @import dot.coffee
# @import line_chart_options.coffee
# @import line.coffee
# @import line_bar.coffee
# @import grid.coffee
# @import base_chart.coffee


class LineChart extends BaseChart
  constructor: (dom_id, options = {}) ->
    super dom_id, new LineChartOptions(options)
    @padding = 26

    @all_points   = []
    @line_indices = []
    @line_options = []

  add_line: (args) ->
    point_pairs = args.data
    return if point_pairs.length < 1

    points = (new Point(pair[0], pair[1]) for pair in point_pairs)
    points_count  = @all_points.length
    @line_indices.push [points_count, points_count + points.length-1]
    @all_points.push.apply(@all_points, points)
    @line_options.push LineChartOptions.merge(@options, args.options )
    return

  draw_grid: (x_coordinates = [], y_coordinates = []) ->

    height = @height - @options.y_padding
    width  = @width  - @options.x_padding
    paths = @r.set()

    for val in x_coordinates
      paths.push @r.path("M #{val}, #{@options.y_padding} L #{val}, #{height} Z")

    for val in y_coordinates
      paths.push @r.path("M #{@options.x_padding}, #{val} L #{width}, #{val} Z")

    paths.attr({
      stroke: "#ccc"
      "stroke-width": 1
    }).toBack()

  _draw_y_labels: (labels) ->
    fmt = @options.label_format
    size = @options.y_label_size
    font_family = @options.font_family
    padding = size + 5 
    scaled_labels = Scaling.scale_points(@width, @height, labels, @options.x_padding, @options.y_padding)

    label_coordinates = []
    for label, i in scaled_labels
      new Label(
        @r, 
        padding, 
        label.y, 
        labels[i].y, 
        fmt, 
        size,
        font_family
      ).draw()
      label_coordinates.push label.y

    label_coordinates

  calc_y_label_step_size: (min_y, max_y, max_labels = @options.max_y_labels) ->
    step_size  = (max_y - min_y)/(max_labels-1)

    # round to nearest int
    if max_y > 1
      step_size  = Math.round(step_size)
      step_size = 1 if step_size == 0

    step_size
    

  draw_y_labels: ->
    [max_x, min_x, max_y, min_y] = Scaling.get_ranges_for_points(@all_points)

    # draw 1 label if all values are the same
    return @_draw_y_labels([new Point(0, max_y)]) if max_y == min_y
       
    y = min_y
    step_size = @calc_y_label_step_size(min_y, max_y)
    labels = []

    while y <= max_y 
      labels.push new Point(0, y)
      y += step_size

    labels[labels.length-1].y = Math.round(max_y) if max_y > 1

    return @_draw_y_labels(labels)

    


  draw_x_label: (raw_point, point) ->
    fmt = @options.label_format
    size = @options.x_label_size
    font_family = @options.font_family

    label = if raw_point.is_date_type == true then new Date(raw_point.x) else Math.round(raw_point.x)
    new Label(
      @r, 
      point.x, 
      @height - size, 
      label, 
      fmt,
      size,
      font_family
    ).draw()

  draw_x_labels: (raw_points, points) ->
    label_coordinates = []
    max_labels = @options.max_x_labels

    # draw first
    @draw_x_label(raw_points[0], points[0])
    label_coordinates.push points[0].x
    return if max_labels < 2
    
    # draw last 
    last = points.length-1
    @draw_x_label(raw_points[last], points[last]) 
    label_coordinates.push points[last].x
    return if max_labels < 3

    len = points.length-2
    step_size  = len / (max_labels-1)

    # when irrational
    rounded_step_size = Math.round(step_size)
    step_size = rounded_step_size+1 if step_size != rounded_step_size

    i = step_size 
    while i < len
      raw_point = raw_points[i]
      point     = points[i] 
      @draw_x_label(raw_point, point)
      label_coordinates.push point.x
      i += step_size

    label_coordinates

  draw_line: (raw_points, points, options) ->
    if @options.render == "bar"
      new LineBar(
        @r,
        raw_points,
        points,
        @height,
        @width,
        options
      ).draw()
    else
      new Line(
        @r,
        raw_points,
        points,
        @height,
        @width,
        options
      ).draw()


  clear: () ->
    super()
    @all_points   = []
    @line_indices = []
    @line_options = []

  draw: () ->
    return if @all_points.length < 1

    @r.clear()
    @scaled_points = Scaling.scale_points(@width, @height, @all_points, @options.x_padding, @options.y_padding)

    for line_indices, i in @line_indices
      [begin, end] = line_indices
      points     = @scaled_points[begin..end]
      raw_points = @all_points[begin..end]
      options    = @line_options[i]
      @draw_line(raw_points, points, options)
      
      if i == 0
        @x_label_coordinates = @draw_x_labels(raw_points, points) if @options.show_x_labels == true
        @y_label_coordinates = @draw_y_labels()   if @options.show_y_labels == true
        @draw_grid(@x_label_coordinates, @y_label_coordinates) if @options.show_grid == true

    return
      



exports.LineChart = LineChart
