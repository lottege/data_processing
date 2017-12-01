/**
* lines.js
* Lotte Geeraedts
* Data Processing
* Studentnummer: 10529748
* Location: https://github.com/lottege/data_processing/blob/master/week_5/lines.js
*
* This function is used in lines.html to make a linegraph
* using data from data1.json. This visualizes the rain in the year 2016
*
* To make this code, the website https://bl.ocks.org/mbostock/3887118 was frequently used.
**/
window.onload = function() {
    var svg = d3.select("chart"),
        margin = {top: 20, right: 80, bottom: 30, left: 50},

        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom,
        g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var parseTime = d3.timeParse("%Y%m%d");

    // Set scales
    var x = d3.scaleTime().range([0, width]),
        y = d3.scaleLinear().range([height, 0]);

    // Create three different lines
    var valueline1 = d3.line()
        .curve(d3.curveBasis)
        .x(function(d) { return x(d.Date1); })
        .y(function(d) { return y(d.Avg); });

    var valueline2 = d3.line()
        .curve(d3.curveBasis)
        .x(function(d) { return x(d.Date1); })
        .y(function(d) { return y(d.Min); });

    var valueline3 = d3.line()
        .curve(d3.curveBasis)
        .x(function(d) { return x(d.Date1); })
        .y(function(d) { return y(d.Max); });

    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    function draw(data, measure) {

      var data = data[measure];

      // format the data
      data.forEach(function(d) {
          d.Date1 = parseTime(d.Date1.replace(/\s/g, ''));
          d.Avg = +d.Avg.replace(/\s/g, '');
          d.Min = +d.Min.replace(/\s/g, '');
          d.Max = +d.Max.replace(/\s/g, '');
      });

      // Scale the range of the data
      x.domain(d3.extent(data, function(d) { return d.Date1; }));
      y.domain([d3.min(data, function(d) {
          return Math.min(d.Min); }), d3.max(data, function(d) {
          return Math.max(d.Max); })]);

      console.log(data);

      // Add the valueline path.
      svg.append("path")
          .data([data])
          .attr("class", "line1")
          .attr("d", valueline1);
      // Add the valueline path.
      svg.append("path")
          .data([data])
          .attr("class", "line2")
          .attr("d", valueline2);
      // Add the valueline path.
      svg.append("path")
          .data([data])
          .attr("class", "line3")
          .attr("d", valueline3);

      // Add the X Axis
      svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x));

      // Add the Y Axis
      svg.append("g")
          .call(d3.axisLeft(y));
      }
    // Get the data
    d3.json("data1.json", function(error, data) {
      if (error) throw error;

      // trigger render
      draw(data, "Netherlands");
    });
}
