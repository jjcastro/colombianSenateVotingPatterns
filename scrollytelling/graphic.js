
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
	var height = 650 + margin*2
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

		// STEP 0
		() => {
			resetAxis();
			resetPeriodLabels();
			resetPartyLabels();
			resetMarks();
			resetFooter();

			d3.select('#white-affordance').style('opacity', '1');
			
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

		// STEP 1
		() => {
			resetAxis();
			resetPartyLabels();
			resetMarks();

			d3.select('.footer').style('opacity', '0.3');
			d3.select('#white-affordance').style('opacity', '0');

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
			resetMarks();

			svg.select('.periodLabel').selectAll('text')
				.transition()
				.duration(500)
				.attr('opacity', 1)
				.attr('y', function(d) {
					return yCenter[d] * height + 75;
				})
				.attr('x', width/2);

			svg.select('.partyLabel')
				.transition()
				.duration(500)
				.attr('opacity', 1);

			usePerPartyForces();

			simulation.alpha(1).restart();
		},

		() => {
			resetAxis();
			resetMarks();

			svg.select('.periodLabel').selectAll('text')
				.transition()
				.duration(500)
				.attr('opacity', 1)
				.attr('y', function(d) {
					return yCenter[d] * height + 75;
				})
				.attr('x', width/2);

			svg.select('.partyLabel')
				.transition()
				.duration(500)
				.attr('opacity', 1);

			showMark("CD1");

			usePerPartyForces();

			simulation.alpha(1).restart();
		},

		() => {
			resetPartyLabels();
			resetMarks();

			showAxis();

			useSupportForces();

			simulation.alpha(1).restart();
		},

		() => {
			resetPartyLabels();
			resetMarks();

			d3.select('.footer').style('opacity', '0.3');

			showAxis();

			showMark("CD2");
			showMark("TODOS1");

			useSupportForces();

			d3.select('#black-affordance').style('opacity', '0');
			simulation.alpha(1).restart();
		},

		() => {
			resetPartyLabels();
			resetMarks();
			resetFooter();

			showAxis();

			useSupportForces();

			d3.select('#black-affordance').style('opacity', '0.5');
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

	function setupCharts(param) {
		graphicVisEl.select('svg').remove();

		svg = graphicVisEl.append('svg')
			// .attr('width', width + 'px')
			// .attr('height', height + 'px')
			.attr("preserveAspectRatio", "xMinYMin meet")
   		.attr("viewBox", "0 0 " + (width+30) +  " " + height)

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

		var yOffset = 50;
	  
	  var axes = svg.append("g").attr("class", "axes");
    ticks.forEach((value, i) => {
    		if (!(i % 2)) {
    			axes.append("rect")
    				.attr("class", 'bandrect')
    				.attr("fill", "#f2f2f2")
						.attr("x", xScale(value))
						.attr("y", yOffset)
						.attr("width", tickDistance)
						.attr("height", 0);
    		}
    });

    var x_axis = d3.axisBottom()
                   .scale(xScale)
                   .tickFormat(d3.format(".0%"));
    axes.append("g")
    		.style("font", (window.isMobile ? "24":"14") + "px Archivo")
    	 .attr("class", "axes")
    	 .attr("transform", "translate(0 " + yOffset + ")")
       .call(x_axis);

    // ============================================
    // SET UP PERIOD LABELS

    var labels = svg.append("g")
										.attr("class", "periodLabel");

		labels.selectAll("text")								
			.data(Object.keys(yCenter))
			.enter()
			.append("text")
				.style("font", (window.isMobile ? "28":"16") + "px Archivo")
				.attr("text-anchor", "middle")
				.attr("x", function (d) { return yCenter[d] * width })
				.attr("y", function (d) { return yCenter[d] * height + 50 })
				.attr("dy", (window.isMobile ? 10 : 0))
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
			.attr("style", "stroke:rgba(0,0,0,0.3);stroke-width:2")
			.attr("x1", lineStart).attr("y1", dHeight)
			.attr("x2", lineEnd).attr("y2", dHeight);

		actualPartyLabels.append("line")
			.attr("style", "stroke:rgba(0,0,0,0.3);stroke-width:2")
			.attr("x1", lineStart).attr("y1", dHeight - 3)
			.attr("x2", lineStart).attr("y2", dHeight + 3);

		actualPartyLabels.append("line")
			.attr("style", "stroke:rgba(0,0,0,0.3);stroke-width:2")
			.attr("x1", lineEnd).attr("y1", dHeight - 3)
			.attr("x2", lineEnd).attr("y2", dHeight + 3);

		// ============================================
    // SET UP STORYTELLING MARKS

		drawMark("CD1", maps.partyXPos["Centro Democrático"], yCenter["2014-2018"], 100, 100);
		drawMark("CD2", 0.38, 0.83, 170, 100);
		drawMark("TODOS1", 0.7, 0.53, 230, 130);

		// ============================================
    // SET UP ARROW HEADS AND GRADIENT DEFINITIONS

		// Green marker
		var markers = {
			green: {color: "#377D22"},
			red: {color: "#EC483F"}
		};

		Object.keys(markers).forEach((key) => {
			svg.append("defs")
			  .append("marker")
			  .attr("id", "arrow-"+key)
			  .attr("markerWidth", 12)
			  .attr("markerHeight", 12)
			  .attr("viewBox", "0 0 12 12")
			  .attr("refX", 6)
			  .attr("refY", 6)
			  .attr("orient", "auto")
			  .append("path")
			  .attr("d", "M2,2 L10,6 L2,10 L6,6 L2,2")
				.attr("fill", markers[key].color);			
		})

		// Set up lines gradient
		var gradient = svg.select("defs")
				.append("linearGradient")
				.attr("id", "gradient-green")
				.attr("spreadMethod", "pad")
				.attr("x1", "0%")
				.attr("y1", "0%")
				.attr("x2", "100%")
				.attr("y2", "0%");

		gradient.append("stop")
			.attr("offset","0%")
			.attr("stop-color","#FFFFFF")
			.attr("stop-opacity","0")
		gradient.append("stop")
			.attr("offset","50%")
			.attr("stop-color","#FFFFFF")
			.attr("stop-opacity","1")
		gradient.append("stop")
			.attr("offset","100%")
			.attr("stop-color","#FFFFFF")
			.attr("stop-opacity","0");

		// ============================================
    // SET UP AXIS ARROWS AND GRADIENT

		const lineHeight = 30;

		svg.append("line")
			.attr("class", "axesRight")
      .attr("x1",width/2)  
      .attr("y1",lineHeight)  
      .attr("x2",width-35)  
      .attr("y2",lineHeight)  
      .attr("stroke", markers.green.color)  
      .attr("stroke-width", 3)
      .attr("marker-end","url(#arrow-green)");  

    svg.append("line")
    	.attr("class", "axesLeft")
      .attr("x1",width/2)  
      .attr("y1",lineHeight)  
      .attr("x2",30)  
      .attr("y2",lineHeight)  
      .attr("stroke", markers.red.color)  
      .attr("stroke-width",3)  
      .attr("marker-end","url(#arrow-red)");  

    svg.append("rect")
    	.attr("class", "axes")
      .attr("x",30)  
      .attr("y",10)  
      .attr("width",width-60)  
      .attr("height",30)  
      .attr("fill", "url(#gradient-green)")  
      .attr("marker-end","url(#arrow-red)"); 

    svg.append("text")
    	// .attr("text-anchor" "")
    	.text((window.isMobile ? "Anti-gobierno" : "Menos apoyo a iniciativas del gobierno"))
    	.style("font", (window.isMobile ? "28":"18") + "px Montserrat")
    	.attr("fill", markers.red.color)  
			.attr("class", "axesLeft")
    	.attr("x", 50)
    	.attr("y", 20);

    svg.append("text")
    	.attr("text-anchor", "end")
    	.text((window.isMobile ? "Pro gobierno" : "Más apoyo a iniciativas del gobierno"))
    	.style("font", (window.isMobile ? "28":"18") + "px Montserrat")
    	.attr("fill", markers.green.color) 
    	.attr("class", "axesRight")
    	.attr("x", width-60)
    	.attr("y", 20);

		// ============================================
    // RESET add ons TO STARTING STATE

    resetAxis();
    resetPeriodLabels();
    resetPartyLabels();
    resetMarks();

    // ============================================

		var chart = svg.append('g')
			.classed('chart', true)
			.attr('transform', 'translate(' + margin + ',' + margin + ')');

		var nodesSenado = data[param];

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
		    	if (window.isMobile) return;

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
		svg.selectAll(".axes")
			.transition()
			.duration(200)
    	.attr("opacity", 0);

    svg.selectAll(".axesRight")
			.transition()
			.duration(200)
    	.attr("opacity", 0)
    	.attr("transform", "translate(-100 0)");

    svg.selectAll(".axesLeft")
			.transition()
			.duration(200)
    	.attr("opacity", 0)
    	.attr("transform", "translate(100 0)");

    svg.selectAll(".bandrect")
			.transition()
			.duration(200)
    	.attr("height", 0);
	}

	function showAxis() {
		svg.selectAll(".axes")
			.transition()
			.duration(500)
			.attr("opacity", "1");

		svg.selectAll(".axesLeft")
			.transition()
			// .ease(d3.easeBounce)
			.duration(500)
			.delay(100)
    	.attr("opacity", 1)
    	.attr("transform", "translate(0 0)");

		svg.selectAll(".axesRight")
			.transition()
			// .ease(d3.easeBounce)
			.duration(500)
			.delay(400)
    	.attr("opacity", 1)
    	.attr("transform", "translate(0 0)");

    d3.selectAll(".bandrect")
			.transition()           // apply a transition
  		.duration(750)
  		.delay(function(d,i){return 100*i})
  			.attr("height", height);

  	svg.select('.periodLabel').selectAll('text')
			.transition()
			.duration(500)
			.attr('opacity', 1)
			.attr('y', function(d) {
				return yCenter[d] * height + 90;
			})
			.attr('x', width/2);
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

	function resetFooter() {
		d3.select('.footer').style('opacity', '0');
	}

	function resetMarks() {
		svg.selectAll('.mark')
			.transition()
			.duration(200)
			.attr('opacity', 0)
			.attr('transform', "scale(1.5)");
	}

	function setupProse() {
		console.log(window.isMobile);
		if (!window.isMobile) {
			// var height = window.innerHeight * 0.5
			// graphicProseEl.selectAll('.trigger')
			// 	.style('height', height + 'px');
		}
		
	}

	function drawMark(id, centerXPct, centerYPct, widthPx, heightPx) {
		svg.append('rect')
			.attr('id', id)
			.attr('class', 'mark')
			.attr('fill', 'rgba(1,1,1,0)')
			.attr('stroke', 'red')
			.attr('stroke-width', 3)
			.attr('transform-origin', 
					(centerXPct*100).toFixed(0) + "% " +
				  (centerYPct*100).toFixed(0) + "%")
			.attr('transform-box', 'fill-box')
			.attr('x', (centerXPct*width)-(widthPx/2))
			.attr('y', (centerYPct*height)-(heightPx/2))
			.attr('width', widthPx)
			.attr('height', heightPx)
			.attr('rx', heightPx*0.1)
			.attr('ry', heightPx*0.1);
	}

	function useSupportForces() {
		simulation
			.force('x', d3.forceX().x(function(d) {
			  return xScale(d.data.si / d.data.total);
			}))
			.force('y', d3.forceY().y(function(d) {
			  return (yCenter[d.data.period] * height) + 20;
			}))
		  .force('collision', d3.forceCollide().radius(function(d) {
		    return d.radius + 2;
		  }));
	}

	function usePerPartyForces() {
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
	}

	function showMark(id) {
		svg.select('.mark#' + id)
			.transition()
			.ease(d3.easeElastic)
			.duration(600)
			.attr('opacity', 1)
			.attr('transform', "scale(1)");

		svg.select('.mark#' + id)
			.on("mouseover", function() {
				if (window.isMobile) return;
				
				graphicProseEl.select('span#' + id)
					.attr("class", "active");
				d3.select(this)
					.transition()
					.duration(200)
					.attr('transform', "scale(1.1)");
			})
			.on("mouseout", function() {
				graphicProseEl.select('span#' + id)
					.attr("class", " ");
				d3.select(this)
					.transition()
					.duration(200)
					.attr('transform', "scale(1)");
			});
	}

	function init() {
		setupCharts("Senado")
		setupProse()
		update(0)
	}
	
	init()
	
	return {
		update: update,
	}
}