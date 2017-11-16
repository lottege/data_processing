var margin = {top: 20, right: 30, bottom: 30, left: 40},
    width = 920 - margin.left - margin.right,
    barHeight = 420,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .ticks(12)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .ticks(8)
    .orient("left");

var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
    return "<strong>Uren:</strong> <span style='color:lightsteelblue'>" + d.uren + "</span>";
    })

var chart = d3.select(".chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

chart.call(tip);

d3.json("uren.json", function(error, data) {
    data.forEach(function(d) {
    d.uren = +d.uren;
    });

  x.domain(data.map(function(d) { return d.maand; }));
  y.domain([0, d3.max(data, function(d) { return d.uren; })]);

  var barWidth = width / data.length;

  chart.attr("height", barHeight * data.length);

  var bar = chart.selectAll("g")
      .data(data)
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(" + i * barWidth + ",0)"; });

  chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  chart.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  chart.selectAll(".chart")
      .data(data)
    .enter().append("rect")
      .attr("class", "chart")
      .attr("x", function(d) { return x(d.maand); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.uren); })
      .attr("height", function(d) { return height - y(d.uren); })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)
});
