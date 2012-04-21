function path_menu() {
  clear_chart('fly-1');

  var menu = new Charts.PathMenu("fly-1", {});

  menu.add({
    label: "Manufacturing",
    value: 3000,
    children: [
      { label: "Automobiles", value: 1500 },
      { label: "Aerospace",   value: 1500 },
    ]
  });

  menu.add({
    label: "Software",
    value: 5000,
    children: [
      { label: "Cloud Based", value: 1500 },
      { label: "OEM Based",   value: 1500 },
      { label: "Gaming",      value: 2000 }
    ]
  })

  menu.add({
    label: "Food",
    value: 400,
    children: [
      { label: "Groceries",     value: 100 },
      { label: "Restaurants",   value: 150 },
      { label: "Snacks",        value: 150 }
    ]
  })

  menu.add({
    label: "Movies",
    value: 1500,
    children: []
  });

  menu.add({
    label: "Consumer Electronics",
    value: 1500,
    children: []
  });


  menu.add({
    label: "Real Estate",
    value: 1500,
    children: []
  });


  menu.add({
    label: "Commercial Banking",
    value: 1500,
    children: []
  });

  menu.draw();
}


$(document).ready(function() {
  $("#fly-charts").bind('draw', function() {
    path_menu();
  });
});
