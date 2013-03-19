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

# @import util.coffee

dateint_to_abbreviation = (dateint) ->
  switch dateint
    when 1 then "Jan"
    when 2 then "Feb"
    when 3 then "Mar"
    when 4 then "Apr"
    when 5 then "May"
    when 6 then "Jun"
    when 7 then "Jul"
    when 8 then "Aug"
    when 9 then "Sep"
    when 10 then "Oct"
    when 11 then "Nov"
    when 12 then "Dec"

format_number_commas = (number, percision = 2) ->
  rounding = if percision > 0 then Math.pow(10, percision) else 1
  value    = Math.round(number * rounding) / rounding 
  Util.commas(value)

format_number =  (number, percision = 2) -> 
  rounding = if percision > 0 then Math.pow(10, percision) else 1

  if number > 1000000
    millions = number / 1000000
    millions = Math.round(millions * rounding) / rounding 
    millions + "m"
  else if number > 1000
    thousands = number / 1000
    Math.round(thousands * rounding) / rounding + "k"
  else
    Math.round(number * rounding) / rounding


class LabelSet
  constructor: (@r, @format = "") ->
    @num = 0
    @font_family = "Helvetica, Arial, sans-serif"

  x: (@x_func)         -> this
  y: (@y_func)         -> this
  size: (@size)        -> this
  attr: (@options)     -> this
  color: (@color)      -> this
 
  draw: (text) ->
    @color = "#333" unless @color

    label = new Label(
      @r,
      @x_func(@num),
      @y_func(@num),
      text,
      @format,
      @size,
      @font_family,
      @color,
      @options
    )
    @num += 1
    label.draw()

class Label
  constructor: (@r, @x, @y, @text, @format = "", @size = 14, @font_family = "Helvetica, Arial, sans-serif", @color = "#333", @options = undefined) ->

  is_date: (potential_date) -> 
    Object.prototype.toString.call(potential_date) == '[object Date]'

  parse_date: (date) ->
    # months are 0 indexed
    groups = @format.match(/%([a-zA-Z])/g)

    formatted = @format 
    for item in groups
      formatted = formatted.replace(item, @parse_format(item)) 
    formatted

  meridian_indicator: (date) ->
    hour = date.getHours()
    if hour >= 12 then "pm" else "am"

  to_12_hour_clock: (date) ->
    hour = date.getHours()
    fmt_hour = hour % 12
    if fmt_hour == 0 then 12 else fmt_hour

  fmt_minutes: (date) ->
    minutes = date.getMinutes()
    if minutes < 10 then "0#{minutes}" else minutes
    
  parse_format: (format) ->
    switch format 
      when "%m" then @text.getMonth()+1
      when "%b" then dateint_to_abbreviation(@text.getMonth()+1)
      when "%d" then @text.getDate()
      when "%Y" then @text.getFullYear()
      when "%H" then @text.getHours()
      when "%M" then @fmt_minutes(@text)
      when "%I" then @to_12_hour_clock(@text) 
      when "%p" then @meridian_indicator(@text)

  draw: () ->
    text = "" 
    
    if @is_date(@text) 
      text = @parse_date(@text)
    else if typeof @text == "number" 
      text = format_number_commas(@text) 
    else
      text = @text

    @element = @r.text(@x, @y, text)
    width = @element.getBBox().width
    margin = 5

    @element.attr({ 
      "fill"        : @color
      "font-size"   : @size
      "font-weight" : "normal"
      "text-anchor" : "middle"
      "font-family" : @font_family
    })

    if @options?
      @element.attr(@options)
    else
      x = if @x < width then (width/2) + margin else @x
      @element.attr({
        "x"           : x
      })

    @element

