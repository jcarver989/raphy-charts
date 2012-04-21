function index_chart() {
  clear_chart('indexchart');

   var node = document.getElementById('indexchart');
   var index = Charts.IndexChart(node);
   index.add("Retail",18316,65)
   index.add("IT Software",28977,1331)
   index.add("Engineering/Technical",28977,282)
   index.add("Education",20839,106)
   index.add("Media & Internet",22488,92)
   index.add("Business Services",19397,85)
   index.add_guide_line("Average", 100, 1)
   index.add_guide_line("Above Average", 500, 0.25)
   index.add_guide_line("High", 1000, 0.25)
   index.add_raw_label("Uniques")
   index.draw()
}


$(document).ready(function() {
  $("#index-charts").bind('draw', function() {
    index_chart();
  });
});
