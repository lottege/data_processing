/**
* barchart.js
* Lotte Geeraedts
* Data Processing
* Studentnummer: 10529748
* Location: https://github.com/lottege/data_processing/blob/master/week_3/barchart.js
*
* This function is used in barchart.html to plot a barchart
* using data from uren.json.
*
* To make this code, the website https://d3js.org/ was frequently used.
**/

// set bounds
var margin = {top: 20, right: 30, bottom: 30, left: 40},
    width = 920 - margin.left - margin.right,
    barHeight = 420,
    height = 500 - margin.top - margin.bottom;

// set size of bars
var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], 0.1);

var y = d3.scale.linear()
    .range([height, 0]);

// initialize x and y axis
var xAxis = d3.svg.axis()
    .scale(x)
    .ticks(12)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .ticks(8)
    .orient("left");

// initialize tooltip
var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
    return "<strong>Uren:</strong> <span style='color:lightsteelblue'>" + d.uren + "</span>";
    })

// initialize chart sizes with bounds
var chart = d3.select(".chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// draw tip
chart.call(tip);

// get data from file and draw the bars
d3.json("uren.json", function(error, data) {
    data.forEach(function(d) {
    // transfers values into numbers
    d.uren = +d.uren;
    });

  // set domains
  x.domain(data.map(function(d) { return d.maand; }));
  y.domain([0, d3.max(data, function(d) { return d.uren; })]);

  var barWidth = width / data.length;

  chart.attr("height", barHeight * data.length);

  var bar = chart.selectAll("g")
      .data(data)
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(" + i * barWidth + ",0)"; });

  // draw x axis
  chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  // draw y axis
  chart.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  // draw bars
  chart.selectAll(".chart")
      .data(data)
    .enter().append("rect")
      .attr("class", "chart")
      .attr("x", function(d) { return x(d.maand); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.uren); })
      .attr("height", function(d) { return height - y(d.uren); })

      // activate tooltip when hovering over bars
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);
});
