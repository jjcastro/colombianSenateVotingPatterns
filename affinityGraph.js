
function affinityGraph(data, color) {

  const map = {};

  var list = data.sort((a, b) => {
    return a.count - b.count;
  });

  // set the dimensions and margins of the graph
  var margin = {top: 50, right: 50, bottom: 0, left: 0},
      width = 960 - margin.left - margin.right,
      height = (list.length * 20) - margin.top - margin.bottom;

  // set the ranges
  var y = d3.scaleBand()
            .range([height, 0])
            .padding(0.1);

  var x = d3.scaleLinear()
            .range([0, (width/2) - margin.right]);

  d3.select("#affinity > svg").remove();
  d3.select("#affinity").style("display", "block");
            
  // append the svg object to the body of the page
  // append a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  var svgAff = d3.select("#affinity").append("svg")
      // .attr("width", width + margin.left + margin.right)
      // .attr("height", height + margin.top + margin.bottom)
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 0 960 2000")
    .append("g")
      .attr("transform", 
            "translate(" + margin.left + "," + margin.top + ")");

  // format the data
  list.forEach(function(d) {
    d.count = +d.count;
    d.nos = 0;

  });

  // Scale the range of the data in the domains
  x.domain([0, d3.max(list, function(d){ return d.count; })])
  y.domain(list.map(function(d) { return d.target.name; }));
  //y.domain([0, d3.max(data, function(d) { return d.count; })]);

  // append the rectangles for the bar chart
  svgAff.selectAll(".barS")
      .data(list)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return width/2; })
      .attr("width", function(d) {return x(d.count); } )
      .attr("y", function(d) { return y(d.target.name); })
      .attr("height", y.bandwidth())
      .attr('fill', function(d) {
        return color(d.target.party)
      });

  // svgAff.selectAll(".barN")
  //     .data(list)
  //   .enter().append("rect")
  //     .attr("class", "bar")
  //     .attr("x", function(d) { return (width/2) - x(d.nos); })
  //     .attr("width", function(d) {return x(d.nos); } )
  //     .attr("y", function(d) { return y(d.target.name); })
  //     .attr("height", y.bandwidth())
  //     .attr('fill', '#C63933');

  // TEXT LABELS
  // ========================

  var text1 = svgAff.selectAll()
      .data(list)
      .enter()
      .append("text")
      .text( function (d) {
        return d.count;
      })
      .attr("text-anchor", "start")
      .attr("font-size", "14px")
      .attr("fill", "black")
      .attr("x", function (d) {
        console.log(d);
        return (x(d.count)) + width/2.0 + 5;
      })
      .attr("y", function (d) {
       return y(d.target.name) + 13;
      });

  svgAff.append("line")
      .attr("x1", width/2)
      .attr("y1", -10)
      .attr("x2", width/2)
      .attr("y2", height + 18)
      .attr("stroke-width", 2)
      .attr("stroke", "#000000");

  var names = svgAff.selectAll()
      .data(list)
      .enter()
      .append("text")
      .text( function (d) {
        return d.target.name;
      })
      .attr("text-anchor", "end")
      .attr("font-size", "14px")
      .attr("fill", "black")
      .attr("x", function (d) {
        return width/2 - 10;
      })
      .attr("y", function (d) {
       return y(d.target.name) + 13;
      });

  // svgAff.append("text")
  //     .attr("x", width/2)
  //     .attr("y", -15)
  //     .attr("text-anchor", "middle")
  //     .text("VS")
  //     .style("fill", "#000000")
  //     .style("font-weight", "bold");

  svgAff.append("text")
      .attr("x", width *  0.25)
      .attr("y", -15)
      .attr("text-anchor", "middle")
      .text("Nombre")
      .style("fill", "#000000")
      .style("font-weight", "bold");

  svgAff.append("text")
      .attr("x", width * 0.75)
      .attr("y", -15)
      .attr("text-anchor", "middle")
      .text("Afinidad")
      .style("fill", "#000000")
      .style("font-weight", "bold");

  svgAff.append("text")
      .attr("x", width + 30)
      .attr("y", -20)
      .attr("text-anchor", "end")
      .text("Cerrar")
      .style("fill", "#000000")
      .style("font-weight", "bold")
      .on("click", function() {
        d3.select("#affinity").style("display", "none");
      });

}