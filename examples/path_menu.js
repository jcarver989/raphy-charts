$(document).ready(function() {
  var categories = ['company_size', 'industry', 'functional_area', 'seniority'];
  var category_opts = {
    company_size: { fill_color: "#6a329e" },
    industry: { fill_color: "#00a6dd" },
    functional_area: { fill_color: "#659e32" },
    seniority: { fill_color: "#b85d26" }
  }

  for (category in data) {
    var segments = data[category];
    if (categories.indexOf(category) == -1) continue;
    var menu = new Charts.PathMenu(category, category_opts[category]);

    for (var i = 0, len = segments.length; i < len; i++) {
      var segment = segments[i];
      var segment_children = segment.children;
      var children = [];

      for (var j = 0, jlen = segment_children.length; j < jlen; j++) {
        var segment_child = segment_children[j];
        children.push({
          label: segment_child.name,
          value: segment_child.count
        });
      }

      menu.add({
        label: segment.name,
        value: segment.count,
        children: children
      });
    }
    menu.draw();
  }



  }); 




