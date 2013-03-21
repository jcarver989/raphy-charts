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
    @lines        = []
    @legend       = @r.set()

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

    padding = size + 5 
    offset = if @options.multi_axis && x_offset > 0 then x_offset else x_offset + padding

    if labels.length == 1
      [x,y] = @create_scalers_for_single_point()
    else
      [x, y] = @create_scalers(labels)

    label_coordinates = []
    
    axis = new LabelSet(@r, fmt)
    .x((i) -> offset)
    .y((i) -> y(labels[i].y))
    .size(size)

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
      line = new LineBar(
        @r,
        raw_points,
        points,
        @height,
        @width,
        options
      )
    else
      line = new Line(
        @r,
        raw_points,
        points,
        @height,
        @width,
        options
      )
    line.draw()
    line.hide() unless options['show_line']
    @lines.push line


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

    # Create the legend for our graph, if we need to
    @draw_legend() if @options['show_legend']

    return
      
  # Draws a legend in the top right hand corner, giving a name to each line
  # colour
  #
  draw_legend: ->
    @legend.clear()

    # We need to remember our X position for each line create a legend for
    # - this allows us to put them next to each other
    current_x = 0

    # Loop through each line option
    for line_option, count in @line_options
      # Create a set to hold the thumbnail and label for a particular line. This
      # will allow us to add a hover and click state to the thumbnail and the
      # label at the same time.
      set = @r.set()

      thumbnail = @r.rect(current_x, 1, 15, 10).attr({
        fill: line_option['line_color']
        stroke: line_option['line_color']
        cursor: 'pointer'
        'stroke-opacity': 0
      })
      # We have to add this to the thumbnail and the label because you can't
      # bind a scope to the click/mousedown element in raphael, therefore we
      # can't access the "set" line property when we click one of the two.
      thumbnail.line  =  @lines[count]
      if line_option['show_line']
        thumbnail.full = true
      else
        thumbnail.attr({
          'stroke-opacity': 1
          'fill-opacity'  : 0
        })
        thumbnail.full = false
      set.push(thumbnail)
      @legend.push(thumbnail)

      current_x += 23

      line_name = line_option['line_name'] || 'Line ' + count
      label = @r.text(current_x, 0, line_name)
      label.attr({
        fill: '#333',
        cursor: 'pointer'
        'font-size' : 10,
        'font-weight' : 'normal',
        'text-anchor' : 'start',
        'font-family' : 'Helvetica',
      })
      label.line =  @lines[count]
      # Save a reference to the thumbnail in our label so we can set the stroke
      # or fill when we click on the label
      label.thumbnail = thumbnail
      # Ensure the label's Y axis is actually 0, because for some reason setting
      # the to 0 doesn't actually make it 0
      label.transform("...t0," + (label.getBBox()['y'] * -1))
      current_x += label.getBBox()['width'] + 25
      set.push(label)
      @legend.push(label)

      # Add hover to the line set so the line glows when you're over it
      set.hover(
        ->
          @line.glow()
        ,
        ->
          @line.remove_glow()
      )

      set.click(->
        @line.toggle()
        # We're technically hovering so we should call glow anyway - this wont
        # work because of the visible check if we've just hidden, and it will
        # make the experience a little bit better, because the glow won't appear
        # until the mouse moves otherwise.
        @line.glow()

        # Switch between a stroke and a fill - this will show us
        # a visible/hidden state for the line
        thumbnail = this.thumbnail || this
        if thumbnail.full
          thumbnail.attr({
            'stroke-opacity': 1
            'fill-opacity'  : 0
          })
          thumbnail.full = false
        else
          thumbnail.attr({
            'stroke-opacity': 0
            'fill-opacity'  : 1
          })
          thumbnail.full = true
      )


    # Take the entire legend's width and the padding at the right of the graph
    # to determine our X transform
    legend_x = (@width - (@legend.getBBox()['width'] + @options.x_padding))

    legend_y = (@options.y_padding / 2) - (@legend.getBBox()['height'] / 2)

    @legend.transform("...t" + legend_x + "," + legend_y)


exports.LineChart = LineChart
