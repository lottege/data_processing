window.onload = function() {
    var margin = {top: 20, right: 150, bottom: 40, left: 40},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var x = d3.scale.linear()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var color = d3.scale.category10();

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var tip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-10, 0])
        .style("font-weight", "bold")
        .style("font-size", "20px")
        .html(function(d) {
            return d.country
        });

svg.call(tip);

d3.json("data1.json", function(error, data) {
  if (error) throw error;

  data.forEach(function(d) {
    d.average_life_expectancy = parseFloat(d.average_life_expectancy.replace(/,/, '.'));
    d.average_well_being = parseFloat(d.average_well_being.replace(/,/, '.'));
  });

  x.domain(d3.extent(data, function(d) { return d["average_life_expectancy"]; })).nice();
  y.domain(d3.extent(data, function(d) { return d["average_well_being"]; })).nice();

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("average life expectancy");

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("average well-being")

  var dots = svg.selectAll(".dot")
      .data(data)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 3.5)
      .attr("cx", function(d, i) { return x(d.average_life_expectancy); })
      .attr("cy", function(d, i) { return y(d.average_well_being); })
      .attr("y", function(d, i) { return y(d.average_well_being); })
      .attr("x", function(d, i) { return x(d.average_life_expectancy); })
      .style("fill", function(d) { return color(d.region); })
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide);


  var legend = svg.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .attr("x", width + 10)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "start")
      .text(function(d) { return d; });
});

}
