
/* 
	I've created a function here that is a simple d3 chart.
	This could be anthing that has discrete steps, as simple as changing
	the background color, or playing/pausing a video.
	The important part is that it exposes and update function that
	calls a new thing on a scroll trigger.
*/
window.createGraphic = function(data, maps) {

	var graphicVisEl = d3.select('.graphic__vis')
	var graphicProseEl = d3.select('.graphic__prose')

	var margin = 20
	// 500x500 chart
	var height = 600 + margin*2
	var width = 900 + margin*2

	var yCenter = {
		"2006-2010": 0.2,
		"2010-2014": 0.5,
		"2014-2018": 0.8
	};

	var svg = null;
	var simulation = null;
	var nodes = [];
	var xScale = null
	var xPositionScale = null;
	var ticked = null;

	var tooltip = null;
	
	// actions to take on each step of our scroll-driven story
	var steps = [

		() => {
			resetAxis();
			resetPeriodLabels();
			resetPartyLabels();
			
			simulation
			  .force('x', d3.forceX().x(function(d) {
				  return width / 2;
				}))
				.force('y', d3.forceY().y(function(d) {
				  return height / 2;
				}))
			  .force('collision', d3.forceCollide().radius(function(d) {
			    return d.radius + 2;
			  }));

			simulation.alpha(1).restart();

		},

		() => {
			resetAxis();
			resetPartyLabels();

			svg.select('.periodLabel').selectAll('text')
				.transition()
				.duration(500)
				.attr('opacity', 1)
				.attr("x", function (d) { return yCenter[d] * width })
				.attr("y", function (d) { return yCenter[d] * height + 120 });

			simulation
			  .force('x', d3.forceX().x(function(d) {
				  return yCenter[d.data.period] * width;
				}))
				.force('y', d3.forceY().y(function(d) {
				  return yCenter[d.data.period] * height;
				}))
			  .force('collision', d3.forceCollide().radius(function(d) {
			    return d.radius + 2;
			  }));

			simulation.alpha(1).restart();
		},

		() => {
			resetAxis();

			svg.select('.periodLabel').selectAll('text')
				.transition()
				.duration(500)
				.attr('opacity', 1)
				.attr('y', function(d) {
					return yCenter[d] * height + 90;
				})
				.attr('x', width/2);

			svg.select('.partyLabel')
				.transition()
				.duration(500)
				.attr('opacity', 1);

			simulation
			  .force('x', d3.forceX().x(function(d) {
				  var location = maps.partyXPos[d.data.partido];
				  return xPositionScale(location ? location : 0.9);
				}))
				.force('y', d3.forceY().y(function(d) {
				  return yCenter[d.data.period] * height;
				}))
			  .force('collision', d3.forceCollide().radius(function(d) {
			    return d.radius + 2;
			  }));

			simulation.alpha(1).restart();
		},

		() => {
			resetPartyLabels();

			svg.select(".axes")
				.transition()
				.duration(500)
				.attr("opacity", "1")

			d3.selectAll(".bandrect")
				.transition()           // apply a transition
    		.duration(750)
    		.delay(function(d,i){return 100*i})
    			.attr("transform", "translate(0 0)");

    	svg.select('.periodLabel').selectAll('text')
				.transition()
				.duration(500)
				.attr('opacity', 1)
				.attr('y', function(d) {
					return yCenter[d] * height + 70;
				})
				.attr('x', width/2);

			simulation
				.force('x', d3.forceX().x(function(d) {
				  return xScale(d.data.si / d.data.total);
				}))
				.force('y', d3.forceY().y(function(d) {
				  return yCenter[d.data.period] * height;
				}))
			  .force('collision', d3.forceCollide().radius(function(d) {
			    return d.radius + 2;
			  }));

			simulation.alpha(1).restart();
		},

		() => {
			resetPartyLabels();

			simulation
				.force('x', d3.forceX().x(function(d) {
				  return xScale(d.data.si / d.data.total);
				}))
				.force('y', d3.forceY().y(function(d) {
				  return yCenter[d.data.period] * height;
				}))
			  .force('collision', d3.forceCollide().radius(function(d) {
			    return d.radius + 2;
			  }));

			simulation.alpha(1).restart();
		},
	]

	// update our chart
	function update(step) {
		steps[step].call()
	}
	
	// little helper for string concat if using es5
	function translate(x, y) {
		return 'translate(' + x + ',' + y + ')'
	}

	function colorScale(party) {
		if (maps.partyColors[party] != null) {
			return maps.partyColors[party];
		}
	  return "#666666";
	}

	function setupCharts() {

		svg = graphicVisEl.append('svg')
			// .attr('width', width + 'px')
			// .attr('height', height + 'px')
			.attr("preserveAspectRatio", "xMinYMin meet")
   		.attr("viewBox", "0 0 " + width +  " " + height)

		// Tooltip
		tooltip = d3.select("body")
		  .append("div")   
		  .attr("class", "tooltip")               
		  .style("opacity", 0);

		// Tooltip
		d3.select("div.tooltip")
		  .append("h3");
		d3.select("div.tooltip")
		  .append("p");
		d3.select("div.tooltip")
		  .append("h4")
		  .attr("class", "party");

		xScale = d3.scaleLinear().domain([0.28, 1.02]).range([0, width]);
		xPositionScale = d3.scaleLinear().domain([0, 1]).range([0, width]);

		// ============================================
		// SET UP AXIS

		var ticks = xScale.ticks();
		var tickDistance = xScale(ticks[1]) - xScale(ticks[0]);
	  
	  var axes = svg.append("g").attr("class", "axes");
    ticks.forEach((value, i) => {
    		if (!(i % 2)) {
    			axes.append("rect")
    				.attr("class", 'bandrect')
    				.attr("fill", "#f2f2f2")
						.attr("x", xScale(value))
						.attr("y", 0)
						.attr("width", tickDistance)
						.attr("height", height);
    		}
    });

    var x_axis = d3.axisBottom()
                   .scale(xScale)
                   .tickFormat(d3.format(".0%"));
    axes.append("g")
    	 .attr("class", "axes")
       .call(x_axis);

    // ============================================
    // SET UP PERIOD LABELS

    var labels = svg.append("g")
										.attr("class", "periodLabel");

		labels.selectAll("text")								
			.data(Object.keys(yCenter))
			.enter()
			.append("text")
				.attr("text-anchor", "middle")
				.attr("x", function (d) { return yCenter[d] * width })
				.attr("y", function (d) { return yCenter[d] * height + 50 })
				.text(function (d) {
					return d;
				});

		// ============================================
		// SET UP PARTY NAME LABELS

		partyNamesDiv = svg.append("g")
										.attr("class", "partyLabel");

		var labelXPos = maps.partyXPos;
		var actualPartyLabels = partyNamesDiv.selectAll("text")
			.data(Object.keys(maps.partyLabelsInfo))
			.enter()
			.append("g")
				.style("position", "absolute")
				// .attr("y", 12)
				.attr("transform", function(d) { 
					console.log(labelXPos[d]);
					return "translate(" + labelXPos[d] * width + " 12)"
				});

		actualPartyLabels.append("text")
			.attr("text-anchor", "middle")
			.text(function (d) {
				return maps.partyLabelsInfo[d].lines[0];
			});
		actualPartyLabels.append("text")
			.attr("dy", 24)
			.attr("text-anchor", "middle")
			.text(function (d) {
				return maps.partyLabelsInfo[d].lines[1];
			});

		var lineStart = (d) => { return (maps.partyLabelsInfo[d].width/2) * -1 };
		var lineEnd   = (d) => { return (maps.partyLabelsInfo[d].width/2) };
		var dHeight = 40;

		actualPartyLabels.append("line")
			.attr("style", "stroke:rgb(0,0,0,0.3);stroke-width:2")
			.attr("x1", lineStart).attr("y1", dHeight)
			.attr("x2", lineEnd).attr("y2", dHeight);

		actualPartyLabels.append("line")
			.attr("style", "stroke:rgb(0,0,0,0.3);stroke-width:2")
			.attr("x1", lineStart).attr("y1", dHeight - 3)
			.attr("x2", lineStart).attr("y2", dHeight + 3);

		actualPartyLabels.append("line")
			.attr("style", "stroke:rgb(0,0,0,0.3);stroke-width:2")
			.attr("x1", lineEnd).attr("y1", dHeight - 3)
			.attr("x2", lineEnd).attr("y2", dHeight + 3);


		// ============================================
    // RESET add ons TO STARTING STATE

    resetAxis();
    resetPeriodLabels();
    resetPartyLabels();

    // ============================================

		var chart = svg.append('g')
			.classed('chart', true)
			.attr('transform', 'translate(' + margin + ',' + margin + ')');

		var nodesSenado = data["Senado"];

		nodes = nodesSenado.map(function(d) {
		  return {
		  	data: d,
		  	title: maps.relevantPeople[d.nombre],
		  	radius: maps.relevantPeople[d.nombre] ? 8 : 4,
  		}
		});

		simulation = d3.forceSimulation(nodes)
			.on('tick', ticked);

		function ticked() {
		  var u = d3.select('svg')
		    .selectAll('circle')
		    .data(nodes)

		  u.enter()
		    .append('circle')
		    .attr('r', function(d) {
		      return d.radius
		    })
		    .merge(u)
		    .attr('cx', function(d) {
		      return d.x
		    })
		    .attr('cy', function(d) {
		      return d.y
		    })
		    .style('fill', function(d) {
		      return colorScale(d.data.partido);
		    })
		    .on("mouseover", function(d) {      
	        tooltip.transition()        
	          .duration(200)      
	          .style("opacity", .9);   

	        tooltip.select("h3")
	          .text(d.data.nombre);

	        var prettyName = maps.partyNames[d.data.partido];
	        tooltip.select("h4.party")
	          .text(prettyName ? prettyName : d.data.partido )
	          .style("background-color", colorScale(d.data.partido));
	        tooltip.select("p")
	          .text(d.title == null ? "" : d.title);
	        tooltip
	          .style("left", (d3.event.pageX) + "px")
	          .style("top", (d3.event.pageY - 28) + "px");
     	  })
  			.on("mouseout", function(d) {       
	        tooltip.transition()
	          .duration(500)
	          .style("opacity", 0);   
	      }); 

		  u.exit().remove()
		}
	}

	function resetAxis() {
		svg.select(".axes")
			.transition()
			.duration(200)
    	.attr("opacity", 0)

    svg.selectAll(".bandrect")
			.transition()
			.duration(200)
    	.attr("transform", "translate(0 -" + height + ")");
	}

	function resetPeriodLabels() {
		svg.select('.periodLabel').selectAll('text')
			.transition()
			.duration(200)
			.attr('opacity', 0);
	}

	function resetPartyLabels() {
		svg.select('g.partyLabel')
			.transition()
			.duration(200)
			.attr('opacity', 0);
	}

	function setupProse() {
		var height = window.innerHeight * 0.5
		graphicProseEl.selectAll('.trigger')
			.style('height', height + 'px')
	}

	function init() {
		setupCharts()
		setupProse()
		update(0)
	}
	
	init()
	
	return {
		update: update,
	}
}