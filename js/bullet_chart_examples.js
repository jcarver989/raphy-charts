function bullet_chart() {
  clear_chart('bulletchart');
  var bullet = new Charts.BulletChart('bulletchart', {
    area_color: "#222222",
    area_width: 50,

    line_width: 15,
    line_color: "#08aadd",

    average_height: 20,
    average_width: 4, 
    average_color: "#fff",

    y_padding: 80
  });

  bullet.add("foo", 50, 30, 100);
  bullet.add("doo", 70, 60, 100);
  bullet.add("moo", 20, 10, 100);
  bullet.draw();
}


$(document).ready(function() {
  $("#bullet-charts").bind("draw", function() {
    bullet_chart();
  });
});
