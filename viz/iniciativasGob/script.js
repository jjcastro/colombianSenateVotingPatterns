
const filename = 'data.json';

const periods = [
  "2006-2010",
  "2010-2014",
  "2014-2018"
];

var filter = {};

d3.json(filename, function(data) {

  // Convert to array
  const partyNames = Object.keys(data);
  const partyList = partyNames.map((name) => {
    return {
      name: name,
      votes: data[name]
    };
  });

  // set the dimensions and margins of the graph
  var margin = {top: 50, right: 20, bottom: 0, left: 100},
      width = 700 - margin.left - margin.right,
      height = 3000 - margin.top - margin.bottom;

  function render(list) {
    var svg = d3.select("#graph").selectAll('*').remove();

    var svg = d3.select("#graph").append("svg")
        // .attr("width", width + margin.left + margin.right)
        // .attr("height", height + margin.top + margin.bottom)
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 700 3000")
      .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");

    var y = d3.scaleBand()
                .range([height, 0])
                .padding(0.3);

    var x = d3.scaleLinear()
              .range([0, width]);

    // Scale the range of the data in the domains
    x.domain([0, 1])
    y.domain(partyList.map(function(d) { return d.name; }));

    svg.append("text")
      .attr("x", width/2)
      .attr("y", -15)
      .attr("text-anchor", "middle")
      .text("50%")
      .style("fill", "#000000")
      .style("font-weight", "bold");

    svg.append("text")
      .attr("x", width)
      .attr("y", -15)
      .attr("text-anchor", "middle")
      .text("100%")
      .style("fill", "#000000")
      .style("font-weight", "bold");

    svg.append("line")
      .attr("x1", width/2)
      .attr("y1", -10)
      .attr("x2", width/2)
      .attr("y2", height)
      .attr("stroke-width", 1)
      .attr("stroke", "#CCCCCC");

    svg.append("line")
      .attr("x1", width)
      .attr("y1", -10)
      .attr("x2", width)
      .attr("y2", height)
      .attr("stroke-width", 1)
      .attr("stroke", "#CCCCCC");

    var barHeight = (y.bandwidth() / periods.length) - 4;

    // append the rectangles for the bar chart
    for (var i = 0; i < periods.length; i++) {
      
            svg.selectAll(".barSi" + i).remove();
      svg.selectAll(".barSi" + i)
        .data(list)
        .enter().append("rect")
        .attr("class", "barSi" + i)
        .attr("x", function(d) { return 0; })
        .attr("width", function(d) {
          d.widthSi = x(d.votes[periods[i]].si / d.votes[periods[i]].total);
          return d.widthSi;
        })
        .attr("y", function(d) { return y(d.name) + (i*(barHeight+2)); })
        .attr("height", barHeight)
        .attr('fill', '#6ABB63');

      svg.selectAll(".barNo" + i).remove();
      svg.selectAll(".barNo" + i)
        .data(list)
        .enter().append("rect")
        .attr("class", "barNo" + i)
        .attr("x", function(d) { return 0 + d.widthSi; })
        .attr("width", function(d) {
          d.widthNo = x(d.votes[periods[i]].no / d.votes[periods[i]].total);
          return d.widthNo;
        })
        .attr("y", function(d) { return y(d.name) + (i*(barHeight+2)); })
        .attr("height", barHeight)
        .attr('fill', '#BB0000');

      svg.selectAll(".barSr" + i).remove();
      svg.selectAll(".barSr" + i)
        .data(list)
        .enter().append("rect")
        .attr("class", "barSr" + i)
        .attr("x", function(d) { return 0 + d.widthSi + d.widthNo; })
        .attr("width", function(d) {
          d.widthNo = x(d.votes[periods[i]].sr / d.votes[periods[i]].total);
          return d.widthNo;
        })
        .attr("y", function(d) { return y(d.name) + (i*(barHeight+2)); })
        .attr("height", barHeight)
        .attr('fill', '#888888');

      svg.selectAll(".barEmpty" + i).remove();
      svg.selectAll(".barEmpty" + i)
        .data(list)
        .enter().append("rect")
        .attr("class", "barEmpty" + i)
        .attr("x", 0)
        .attr("width", function(d) { 
          if (d.votes[periods[i]].total == 0) {
            return x(1)
          }
          else return 0;
        })
        .attr("y", function(d) { return y(d.name) + (i*(barHeight+2)); })
        .attr("height", barHeight)
        .attr('fill', "url(#lightstripe)");

      d3.selectAll(".periodName" + i).remove();
      var text1 = svg.selectAll()
        .data(list)
        .enter()
        .append("text")
        .attr("class", "periodName" + i)
        .text(periods[i])
        .attr("text-anchor", "end")
        .attr("font-size", "14px")
        .attr("fill", "black")
        .attr("x", function (d) {
          return -5;
        })
        .attr("y", function(d) {
          return y(d.name) + (i*(barHeight+2)) + barHeight - 2;
        });
    }

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
  }
  
  render(partyList);

  var periodCountDifference = (a, b) => {
    var aCount = 0;
    var bCount = 0;
    periods.forEach((p) => {
      aCount += a.votes[p].total > 0 ? 1 : 0;
      bCount += b.votes[p].total > 0 ? 1 : 0;
    });
    return aCount - bCount;
  }

  filter.votesNo = () => {
    var sorted = partyList.sort((a, b) => {
      if (periodCountDifference(a, b) != 0) {
        return periodCountDifference(a, b);
      } else {
        var aCount = 0;
        var bCount = 0;
        var aTotal = 0;
        var bTotal = 0;

        periods.forEach((p) => {
          aCount += a.votes[p].total > 0 ? 1 : 0;
          bCount += b.votes[p].total > 0 ? 1 : 0;

          aTotal += a.votes[p].no / a.votes[p].total;
          bTotal += b.votes[p].no / b.votes[p].total;
        });

        console.log(a.name, aTotal / aCount);
        return (bCount/bTotal) - (aCount/aTotal);
      }
    });
    render(sorted);
  };
  filter.votesYes = () => {
    var sorted = partyList.sort((a, b) => {
      if (periodCountDifference(a, b) != 0) {
        return periodCountDifference(a, b);
      } else {
        var aCount = 0;
        var bCount = 0;
        var aTotal = 0;
        var bTotal = 0;

        periods.forEach((p) => {
          aCount += a.votes[p].total > 0 ? 1 : 0;
          bCount += b.votes[p].total > 0 ? 1 : 0;

          aTotal += a.votes[p].si / a.votes[p].total;
          bTotal += b.votes[p].si / b.votes[p].total;
        });

        console.log(a.name, aTotal / aCount);
        return (bCount/bTotal) - (aCount/aTotal);
      }
    });
    render(sorted);
  };
  filter.participation = () => {
    var sorted = partyList.sort((a, b) => {
      var aCount = 0;
      var bCount = 0;
      periods.forEach((p) => {
        aCount += a.votes[p].total;
        bCount += b.votes[p].total;
      });

      return aCount - bCount;
    });
    render(sorted);
  };
});

