
const filename = 'line_chart_data.json';

var parse  = d3.timeParse("%Y-%m-%d");

var functions = {};

d3.json(filename, function(data) {

  // Convert to array
  const partyNames = Object.keys(data);
  console.log(partyNames);
  const partyList = partyNames.map((name) => {
    return {
      name: name,
      entries: Object.keys(data[name]).map((startDate) => {
        var entry = data[name][startDate];
        const pctSi = entry.si / (entry.si + entry.no);
        return {startDate: +parse(startDate), pctSi: pctSi};
      })
    };
  });

  console.log(partyList);

  // set the dimensions and margins of the graph
  var margin = {top: 50, right: 20, bottom: 0, left: 100},
      width = 700 - margin.left - margin.right,
      height = pixelHeight - margin.top - margin.bottom;

  function render(list) {
    var svg = d3.select("#graph").selectAll('*').remove();

    var svg = d3.select("#graph").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        // .attr("preserveAspectRatio", "xMinYMin meet")
        // .attr("viewBox", "0 0 700 3000")
      .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");

    var y = d3.scaleBand()
                .range([height, 0])
                .padding(0.3);

    var x = d3.scaleLinear()
              .range([0, width]);

    // Scale the range of the data in the domains
    x.domain([0, 1]);
    y.domain(partyList.map(function(d) { return d.name; }));

    svg.append("line")
      .attr("x1", width)
      .attr("y1", -10)
      .attr("x2", width)
      .attr("y2", height)
      .attr("stroke-width", 1)
      .attr("stroke", "#CCCCCC");

    // var barHeight = (y.bandwidth() / periods.length) - 4;

    var xLine = d3.scaleTime()
      .domain([parse("2006-01-01"), parse("2018-01-01")])
      .range([0, width]);

    for (var i = partyList.length - 1; i >= 0; i--) {
      var selection = partyList[i];
      
      // GRAB THE VALUES TO USE

      // ====================================
      // set the ranges
      

      var yLine = d3.scaleLinear()
        .domain([1, 0])
        .range([y(selection.name), y(selection.name) + y.bandwidth()]);

      // define the line
      var valueline = d3.line()
        .x(function(d) { return xLine(d.startDate); })
        .y(function(d) { return yLine(d.pctSi); })
        .curve(d3.curveMonotoneX);

        // Add the valueline path.
      svg.append("path")
        .data([selection.entries])
        .attr("class", "line")
        .attr("d", valueline);

      var axisHeight = y(selection.name) + y.bandwidth();
      svg.append("g")
        .attr("transform", "translate(0," + axisHeight + ")")
        .call(d3.axisBottom(xLine));

      svg.append("g")
        .call(d3.axisLeft(yLine));
    }

    // ====================================

    d3.selectAll(".partyNames").remove();
    var text1 = svg.selectAll()
      .data(list)
      .enter()
      .append("text")
      .attr("class", "partyNames")
      .text( function (d) {
        return d.name;
      })
      .attr("text-anchor", "start")
      .attr("font-size", "14px")
      .attr("fill", "black")
      .attr("x", function (d) {
        return 7;
      })
      .attr("y", function (d) {
       return y(d.name) - 7;
      });

    svg.append("line")
      .attr("x1", 0)
      .attr("y1", -10)
      .attr("x2", 0)
      .attr("y2", height + 18)
      .attr("stroke-width", 2)
      .attr("stroke", "#000000");

    // INDICATOR
    svg.append("line")
      .attr("id", "indicatorX")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", width)
      .attr("y2", 0)
      .attr("stroke-width", 1)
      .attr("stroke", "#CCCCCC");

    svg.append("line")
      .attr("id", "indicatorY")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", 0)
      .attr("y2", height)
      .attr("stroke-width", 1)
      .attr("stroke", "#CCCCCC");

    // HIDDEN RECT FOR MOUSEOVER
    svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("mousemove", function() {
          var coordinates = d3.mouse(this);

          svg.select("#indicatorX")
            .attr("y1", coordinates[1])
            .attr("y2", coordinates[1]);

          svg.select("#indicatorY")
            .attr("x1", coordinates[0])
            .attr("x2", coordinates[0]);
        });

    functions.periods = function() {
      svg.selectAll(".markers").remove();
      ["2006-07-20", "2010-07-20", "2014-07-20"].forEach((date) => {
        svg.append("line")
          .attr("class", "markers")
          .attr("x1", xLine(parse(date)))
          .attr("y1", -10)
          .attr("x2", xLine(parse(date)))
          .attr("y2", height + 18)
          .attr("stroke-width", 1)
          .attr("stroke", "#ED6164");
      });
    };
    functions.inflection = function() {
      svg.selectAll(".markers").remove();
      ["2008-01-01", "2013-01-01"].forEach((date) => {
        svg.append("line")
          .attr("class", "markers")
          .attr("x1", xLine(parse(date)))
          .attr("y1", -10)
          .attr("x2", xLine(parse(date)))
          .attr("y2", height + 18)
          .attr("stroke-width", 1)
          .attr("stroke", "#3E92F7");
      });
    };
    functions.peace = function() {
      svg.selectAll(".markers").remove();
      svg.append("line")
        .attr("class", "markers")
        .attr("x1", xLine(parse("2016-11-24")))
        .attr("y1", -10)
        .attr("x2", xLine(parse("2016-11-24")))
        .attr("y2", height + 18)
        .attr("stroke-width", 1)
        .attr("stroke", "#62C975");
    };
  }

  
  
  render(partyList);
});

