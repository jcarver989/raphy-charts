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
    data = args.data
    return if data.length < 1

    points = []
    for item in data 
      if item.length == 3 # has options
        points.push new Point(item[0], item[1], item[2])
      else
        points.push new Point(item[0], item[1])

    points_count  = @all_points.length
    @line_indices.push [points_count, points_count + points.length-1]
    @all_points.push.apply(@all_points, points)
    @line_options.push LineChartOptions.merge(@options, args.options)
    return

  draw_grid: (x_coordinates = [], y_coordinates = []) ->
    stroke = (path, color, width) ->
      path.attr({
        stroke: color
        "stroke-width" : width
      })

    x_offset = if @options.multi_axis then @options.x_padding * 2 else @options.x_padding

    height = @height - @options.y_padding
    width  = @width  - x_offset 
    paths = @r.set()

    for val in x_coordinates
      paths.push @r.path("M #{val}, #{@options.y_padding} L #{val}, #{height} Z")

    for val in y_coordinates
      paths.push @r.path("M #{@options.x_padding}, #{val} L #{width}, #{val} Z")


    # color the axis for easier reading
    if @options.multi_axis == true && @line_options.length == 2
        left_side   = @options.x_padding 
        left_stroke = @r.path("M #{left_side}, #{@options.y_padding} L #{left_side}, #{height} Z")

        right_side   = @width - @options.x_padding * 2
        right_stroke = @r.path("M #{right_side}, #{@options.y_padding} L #{right_side}, #{height} Z")

        stroke(left_stroke,  @line_options[0].line_color, 2).toBack()
        stroke(right_stroke, @line_options[1].line_color, 2).toBack()


    # do this last to avoid overwriting the multi axis colors
    stroke(paths, "#ddd", 1).toBack()

  create_scalers: (points) ->
    y = undefined
    max_x = undefined
    min_x = undefined
    max_y = undefined
    min_y = undefined

    if @options.scale == 'log'
      log = new LogScaler()
      log_points = (new Point(p.x, log(p.y)) for p in points)
      [max_x, min_x, max_y, min_y] = Scaling.get_ranges_for_points(log_points)
    else
      [max_x, min_x, max_y, min_y] = Scaling.get_ranges_for_points(points)

    if @options.y_axis_scale.length == 2
      [min_y, max_y] = @options.y_axis_scale
    
    x_offset = if @options.multi_axis then @options.x_padding * 2 else @options.x_padding 
    x = new Scaler()
    .domain([min_x, max_x])
    .range([@options.x_padding, @width - x_offset])

    y_scaler = new Scaler()
    .domain([min_y, max_y])
    .range([@options.y_padding, @height - @options.y_padding])

    # top of chart is 0,0 so need to reflect y axis
    linear = (i) => @height - y_scaler(i)

    if @options.scale == 'log'
      y = (i) -> linear(log(i))
    else
      y = linear

    [x, y]

  create_scalers_for_single_point: () ->
    y = (i) => 0.5 * (@height - @options.y_padding)
    x = (i) => 0.5 * (@width - @options.x_padding)
    [x, y]

  _draw_y_labels: (labels, x_offset = 0) ->
    fmt = @options.label_format
    size = @options.y_label_size
    font_family = @options.font_family
    color = @options.label_color || '#333'

    padding = size + 5

    # How far from the left are the labels going to be?
    offset = if @options.multi_axis && x_offset > 0 then x_offset else x_offset + padding

    # If there's a label for this axis then they need to be a little more to the
    # right to make space for the label.
    if @options.y_axis_name
      offset += (size * 1.75)
      # Create the label
      label_color = @options.axis_name_color || '#333'
      label_size  = @options.axis_name_size || size

      label = new Label(
        @r,
        5,
        @height / 2,
        @options.y_axis_name,
        fmt,
        label_size,
        font_family,
        label_color
      ).draw()

      # Rotate the label so you read it upwards - this will knock out the
      # X position
      label.transform("T0,0R270S1")

      # Fix the X position by taking the bounding box's X position and
      # translating to 0
      label.transform("...t0," + (label.getBBox()['x'] * -1))


    if labels.length == 1
      [x,y] = @create_scalers_for_single_point()
    else
      [x, y] = @create_scalers(labels)

    label_coordinates = []
    
    axis = new LabelSet(@r, fmt)
    .x((i) -> offset)
    .y((i) -> y(labels[i].y))
    .size(size)
    .color(color)

    for label in labels
      axis.draw(label.y)
      label_coordinates.push y(label.y)

    label_coordinates

  calc_y_label_step_size: (min_y, max_y, max_labels = @options.max_y_labels) ->
    step_size  = (max_y - min_y)/(max_labels-1)

    # round to nearest int
    if max_y > 1
      step_size = Math.round(step_size)
      step_size = 1 if step_size == 0

    step_size
    

  draw_y_labels: (points, x_offset = 0) ->
    [max_x, min_x, max_y, min_y] = Scaling.get_ranges_for_points(points)

    if @options.y_axis_scale.length == 2
      [min_y, max_y] = @options.y_axis_scale

    # draw 1 label if all values are the same
    return @_draw_y_labels([new Point(0, max_y)], x_offset) if max_y == min_y

    labels = []

    if @options.scale == 'log'
      log = new LogScaler()
      start = log(min_y)
      end   = log(max_y)
      step_size  = (end - start)/(@options.max_y_labels-1)
      label = min_y 
      n = 0

      while label <= max_y && n < @options.max_y_labels
        label = Math.pow(10, start + step_size * n) 
        labels.push new Point(0, label)
        n += 1
        
    else
      y = min_y
      step_size = @calc_y_label_step_size(min_y, max_y)

      while y <= max_y 
        labels.push new Point(0, y)
        y += step_size

    labels[labels.length-1].y = Math.round(max_y) if max_y > 1

    return @_draw_y_labels(labels, x_offset)

  draw_x_label: (raw_point, point) ->
    fmt = @options.label_format
    size = @options.x_label_size
    font_family = @options.font_family
    color = @options.label_color || '#333'

    # If the x label is named make room for it by nudging the labels a little
    # higher towards the graph
    if @options.x_axis_name
      y = @height - (size * 2)
    else
      y = @height - size

    label = if raw_point.is_date_type == true then new Date(raw_point.x) else Math.round(raw_point.x)
    new Label(
      @r,
      point.x,
      y,
      label,
      fmt,
      size,
      font_family,
      color
    ).draw()

  draw_x_labels: (raw_points, points) ->
    label_coordinates = []
    max_labels = @options.max_x_labels

    # Is this axis named? If so, add the label name to the axis
    if @options.x_axis_name
      color = @options.axis_name_color || '#333'
      label_size = @options.axis_name_size || @options.x_label_size
      label = new Label(
        @r,
        (@width / 2),
        @height - (@options.x_label_size / 2),
        @options.x_axis_name,
        @options.label_format,
        label_size,
        @options.font_family,
        color
      ).draw()

    # draw first
    @draw_x_label(raw_points[0], points[0])
    label_coordinates.push points[0].x
    return if max_labels < 2
    
    # draw last 
    last = points.length-1
    @draw_x_label(raw_points[last], points[last]) 
    label_coordinates.push points[last].x
    return if max_labels < 3

    len = points.length-1
    step_size  = len / (max_labels-1)

    # when irrational
    rounded_step_size = Math.round(step_size)
    step_size = rounded_step_size+1 if step_size != rounded_step_size

    # draw labels in between first and last
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

    [x, y] = if @all_points.length > 1 then @create_scalers(@all_points) else @create_scalers_for_single_point()

    for line_indices, i in @line_indices
      [begin, end] = line_indices
      raw_points = @all_points[begin..end]

      # scale points on their own axis if multi axis is set 
      if @options.multi_axis
        [line_x, line_y] = if @all_points.length > 2 then @create_scalers(raw_points) else @create_scalers_for_single_point()
      else
        line_x = x
        line_y = y

      points = (new Point(line_x(point.x), line_y(point.y)) for point in raw_points)
      options    = @line_options[i]
      @draw_line(raw_points, points, options)
      
      if i == 0
        @x_label_coordinates = @draw_x_labels(raw_points, points)  if @options.show_x_labels == true

        if @options.multi_axis && @options.show_y_labels == true
          @y_label_coordinates = @draw_y_labels(raw_points)
        else if @options.show_y_labels == true
          @y_label_coordinates = @draw_y_labels(@all_points)

        @draw_grid(@x_label_coordinates, @y_label_coordinates)     if @options.show_grid == true

      else if i == 1 && @options.multi_axis
        @draw_y_labels(raw_points, @width - @options.x_padding) if @options.show_y_labels == true

    return
      

exports.LineChart = LineChart
