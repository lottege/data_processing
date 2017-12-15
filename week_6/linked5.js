/**
* linked5.js
* Lotte Geeraedts
* Data Processing
* Studentnummer: 10529748
* Location: https://github.com/lottege/data_processing/blob/master/week_6/linked5.js
*
* This function is used in linked3.html to make a linked barchart and piechart
* using data from the html file. This visualizes the grades I scored during the data processing course.
*
* To make this code, the website http://bl.ocks.org/NPashaP/96447623ef4d342ee09b was frequently used.
**/

// get data from html file
function dashboard(id, fData){
    var barColor = '#F25D50';
    // colors found via color.adobe.com
    function segColor(c){ return {scope:"#092140",
                                  correctness:"#024959",
                                  design:"#F2C777",
                                  style:"#224732"}[c]; }

    fData.forEach(function(d) {
    // transfers values into numbers
    d.grade.scope = +d.grade.scope;
    d.grade.correctness = +d.grade.correctness;
    d.grade.design = +d.grade.design;
    d.grade.style = +d.grade.style;
    });

    // calculate end grade with the always long formula
    fData.forEach(function(d){d.total=((((d.grade.correctness*3)+
                             (d.grade.design*2)+(d.grade.style))*
                              d.grade.scope)/15).toFixed(1);});

    // set sizes of bars
    function histoGram(fD){
        var hG={},    hGDim = {t: 60, r: 0, b: 30, l: 0};
        hGDim.w = 350 - hGDim.l - hGDim.r,
        hGDim.h = 300 - hGDim.t - hGDim.b;

        //create svg for barchart
        var hGsvg = d3.select(id).append("svg")
            .attr("width", hGDim.w + hGDim.l + hGDim.r)
            .attr("height", hGDim.h + hGDim.t + hGDim.b).append("g")
            .attr("transform", "translate(" + hGDim.l + "," + hGDim.t + ")");

        // create function for x-axis
        var x = d3.scale.ordinal().rangeRoundBands([0, hGDim.w], 0.1)
                .domain(fD.map(function(d) { return d[0]; }));

        // add x-axis
        hGsvg.append("g").attr("class", "x axis")
            .attr("transform", "translate(0," + hGDim.h + ")")
            .call(d3.svg.axis().scale(x).orient("bottom"));

        // create function for y-axis
        var y = d3.scale.linear().range([hGDim.h, 0])
                .domain([0, d3.max(fD, function(d) { return d[1]; })]);


        // append bars
        var bars = hGsvg.selectAll(".bar").data(fD).enter()
                .append("g").attr("class", "bar");

        // create the rectangles.
        bars.append("rect")
            .attr("x", function(d) { return x(d[0]); })
            .attr("y", function(d) { return y(d[1]); })
            .attr("width", x.rangeBand())
            .attr("height", function(d) { return hGDim.h - y(d[1]); })
            .attr('fill',barColor)
            .on("mouseover",mouseover)
            .on("mouseout",mouseout);

        // interaction while hovering
        function mouseover(d){
            var st = fData.filter(function(s){ return s.week == d[0];})[0],
                nD = d3.keys(st.grade).map(function(s){ return {type:s, grade:st.grade[s]};});

            pC.update(nD);
            leg.update(nD);
        }

        function mouseout(d){
            // reset the charts
            pC.update(tF);
            leg.update(tF);
        }

        // create the grade/score on top of the bars
        bars.append("text").text(function(d){ return d3.format(",")(d[1])})
            .attr("x", function(d) { return x(d[0])+x.rangeBand()/2; })
            .attr("y", function(d) { return y(d[1])-5; })
            .attr("text-anchor", "middle");

        // function to update the bars
        hG.update = function(nD, color){
            // update the domain depending on the new variables
            y.domain([0, d3.max(nD, function(d) { return d[1]; })]);

            // update bars with new data
            var bars = hGsvg.selectAll(".bar").data(nD);

            // change color and height of bars
            bars.select("rect").transition().duration(500)
                .attr("y", function(d) {return y(d[1]); })
                .attr("height", function(d) { return hGDim.h - y(d[1]); })
                .attr("fill", color);

            // move the values on top of the bars
            bars.select("text").transition().duration(500)
                .text(function(d){ return d3.format(",")(d[1])})
                .attr("y", function(d) {return y(d[1])-5; });
        }
        return hG;
    }

    // function for the pie chart
    function pieChart(pD){
        var pC ={},    pieDim ={w:200, h: 200};
        pieDim.r = Math.min(pieDim.w, pieDim.h) / 2;

        // create svg for pie chart
        var piesvg = d3.select(id).append("svg")
            .attr("width", pieDim.w).attr("height", pieDim.h).append("g")
            .attr("transform", "translate("+pieDim.w/2+","+pieDim.h/2+")");

        // function to draw the arcs of the pie slices
        var arc = d3.svg.arc().outerRadius(pieDim.r - 10).innerRadius(0);

        // function to calculate the pie slice angles
        var pie = d3.layout.pie().value(function(d) {return d.grade;});

        // draw the slices
        piesvg.selectAll("path").data(pie(pD)).enter().append("path").attr("d", arc)
            .each(function(d) { this._current = d; })
            .style("fill", function(d) { return segColor(d.data.type); })
            .on("mouseover",mouseover).on("mouseout",mouseout);

        function mouseover(d){
            // call the update function of histogram with new data.
            hG.update(fData.map(function(v){
                return [v.week,v.grade[d.data.type]];}),segColor(d.data.type));
        }

        function mouseout(d){
            // call the update function of histogram with total data
            hG.update(fData.map(function(v){
                return [v.week,v.total];}), barColor);
        }

        // function to update the pie chart
        pC.update = function(nD){
            piesvg.selectAll("path").data(pie(nD)).transition().duration(500)
                .attrTween("d", arcTween);
        }

        // function to animate a smooth bridge between new values in the chart
        function arcTween(a) {
            var i = d3.interpolate(this._current, a);
            this._current = i(0);
            return function(t) { return arc(i(t));    };
        }
        return pC;
    }

    // function legend
    function legend(lD){
        var leg = {};

        // create table for legend
        var legend = d3.select(id).append("table").attr('class','legend');

        // create one row per segment
        var tr = legend.append("tbody").selectAll("tr").data(lD).enter().append("tr");

        // create the first column for each segment.
        tr.append("td").append("svg").attr("width", '16').attr("height", '16').append("rect")
            .attr("width", '16').attr("height", '16')
			.attr("fill",function(d){ return segColor(d.type); });

        // create the second column for each segment.
        tr.append("td").text(function(d){ return d.type;});

        // create the third column for each segment.
        tr.append("td").attr("class",'legendFreq')
            .text(function(d){ return d3.format(",")(d.grade);});

        // function to update the legend
        leg.update = function(nD){
            var l = legend.select("tbody").selectAll("tr").data(nD);
            l.select(".legendFreq").text(function(d){ return d3.format(",")(d.grade);});
        }

        // calculate percentage
        function getLegend(d,aD){
            return d3.format("%")(d.grade/d3.sum(aD.map(function(v){ console.log(v.grade); return v.grade; })));
        }

        return leg;
    }

    // calculate total grades by segment for all weeks
    var tF = ['scope','correctness','design', 'style'].map(function(d){
        return {type:d, grade: d3.mean(fData.map(function(t){ return t.grade[d];}))};
    });

    // calculate total grades by week for all segment
    var sF = fData.map(function(d){return [d.week,d.total];});

    // create barchart, piechart and legend
    var hG = histoGram(sF),
        pC = pieChart(tF),
        leg= legend(tF);
}


