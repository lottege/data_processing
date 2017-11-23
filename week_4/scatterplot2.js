window.onload = function() {
    console.log("hoi");
    var margin = {top: 20, right: 20, bottom: 40, left: 100},
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

    d3.json("data1.json", function(error1, data1) {
    console.log("hoi");
        d3.json("data2.json", function(error2, data2) {
          var data = {};
          if (error1) throw error1;
          if (error2) throw error2;

          data1.forEach(function(d) {
            d["2010"] = +d["2010"];
          });
          data2.forEach(function(d) {
            d["2010"] = +d["2010"];
          });

          x.domain(d3.extent(data2, function(d) { return d["2010"]; })).nice();
          y.domain(d3.extent(data1, function(d) { return d["2010"]; })).nice();

          console.log(x(100), x.domain, x.range)

          svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis)
            .append("text")
              .attr("class", "label")
              .attr("x", width)
              .attr("y", -6)
              .style("text-anchor", "end")
              .text("Population");

          svg.append("g")
              .attr("class", "y axis")
              .call(yAxis)
            .append("text")
              .attr("class", "label")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", ".71em")
              .style("text-anchor", "end")
              .text("Agriculture")

          var dots = svg.selectAll(".dot")
              .data(data1)
              .enter().append("circle")
              .attr("class", "dot")
              .attr("r", 3.5)
              .attr("cx", function(d, i) { return x(data2[i]["2010"]); })
              .attr("cy", function(d, i) { return x(d["2010"]); })
//              .attr("y", function(d, i) { return y(d["2010"]); })
//              .attr("x", function(d, i) { console.log(x(data2[i]["2010"])); console.log(this); return x(data2[i]["2010"]); })
              .style("fill", function(d) { return color(d.species); });

//          dots[0].forEach(function(dot) {
//            //console.log(dot)
//            d3.select(dot).attr("cy", function(d) { return y(d["2010"]); })
//          })

          var legend = svg.selectAll(".legend")
              .data(color.domain())
            .enter().append("g")
              .attr("class", "legend")
              .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

//          legend.append("rect")
//              .attr("x", width - 18)
//              .attr("width", 18)
//              .attr("height", 18)
//              .style("fill", color);

          legend.append("text")
              .attr("x", width - 24)
              .attr("y", 9)
              .attr("dy", ".35em")
              .style("text-anchor", "end")
              .text(function(d) { return d; });
        });
});

}
