
/* 
	I've created a function here that is a simple d3 chart.
	This could be anthing that has discrete steps, as simple as changing
	the background color, or playing/pausing a video.
	The important part is that it exposes and update function that
	calls a new thing on a scroll trigger.
*/
window.createGraphic2 = function(partyData, personData, maps) {
  console.log(personData);

	var parse  = d3.timeParse("%Y-%m-%d");

	var graphicVisEl2 = d3.select('.graphic2__vis')
	var graphicProseEl2 = d3.select('.graphic2__prose')

	var margin = 40
	// 500x500 chart
	var height = 600 
	var width = 900

	var linesChart = null;
  var linesHolder = null;

	var xLine = null;
	var yLine1 = null;
	var yLine2 = null;
	var board1 = null;

  const anchoViz2 = 0.85;
	
	// actions to take on each step of our scroll-driven story
	var steps = [
		() => {

			clearEverything();
      resetAxis();
      resetArrows();
      resetMarks();

		},
		() => {
			clearEverything();
      resetMarks();
      showAxis();
      resetArrow('bottom');
      showArrow('top');

      d3.select('#black-affordance').style('opacity', '0.5');

		},
		() => {
			clearEverything();
      resetMarks();
      showAxis();
      resetArrow('bottom');
      showArrow('top');

      d3.select('#black-affordance').style('opacity', '0');

      addLine("Partido de la U - Partido Social de Unidad Nacional", "main", 0, true);
      animateLines();
		},
    () => {
      clearEverything();
      showAxis();
      resetArrow('bottom');
      showArrow('top');

      addLine("Partido de la U - Partido Social de Unidad Nacional", "main", 0, true);
      drawLines();

      showMark('down');
    },
		() => {
			// console.log("step4");
			clearEverything();
      resetMarks();
      showAxis();
      resetArrow('bottom');
      showArrow('top');

      addLine("Partido de la U - Partido Social de Unidad Nacional", "main", 0, true);

      drawLines();

      addLine("Conservador Colombiano", "new", 0, true);
      addLine("Liberal Colombiano", "new", 0, true);
      addLine("Cambio Radical", "new", 0, true);

			animateLines();
		},
		() => {
			clearEverything();
      resetMarks();
      showAxis();
      showArrow('top');

      // Grey out the top arrow
      d3.selectAll(".top")
        .transition()
        .duration(400)
        .attr("opacity", 0.2);

      showArrow('bottom');

      addLine("Partido de la U - Partido Social de Unidad Nacional", "gov", 0, true);
      addLine("Conservador Colombiano", "gov", 0, true);
      addLine("Liberal Colombiano", "gov", 0, true);
      addLine("Cambio Radical", "gov", 0, true);

      drawLines();
      greyOutLines("gov", false);

      // addLine("Centro Democrático", "opp", 1, true);
      addLine("PDA - Polo Democrático Alternativo", "opp", 1, true);

			animateLines("opp", 200);
		},
    () => {
      clearEverything();
      resetMarks();
      showAxis();
      showArrow('top');

      // Grey out the top arrow
      d3.selectAll(".top")
        .transition()
        .duration(200)
        .attr("opacity", 0.2);

      showArrow('bottom');

      addLine("Partido de la U - Partido Social de Unidad Nacional", "paz", 0, true);
      addLine("Conservador Colombiano", "paz", 0, true);
      addLine("Liberal Colombiano", "paz", 0, true);
      addLine("Cambio Radical", "paz", 0, true);
      drawLines();
      greyOutLines("paz", true);

      addLine("PDA - Polo Democrático Alternativo", "paz2", 1, true);
      drawLines();
      greyOutLines("paz2", false);

      addLine("Alianza Verde", "verde", 1, true);
      animateLines("verde", 200);
    },
    () => {
      clearEverything();
      showAxis();
      showArrow('top');
      showArrow('bottom');

      // Grey out the top arrow
      d3.selectAll(".axes, .axesText")
        .transition()
        .duration(200)
        .attr("opacity", 0.2);

      addLine("Partido de la U - Partido Social de Unidad Nacional", "paz", 0, true);
      addLine("Conservador Colombiano", "paz", 0, true);
      addLine("Liberal Colombiano", "paz", 0, true);
      addLine("Cambio Radical", "paz", 0, true);
      addLine("PDA - Polo Democrático Alternativo", "paz", 1, true);
      drawLines();
      greyOutLines("paz", true);

      addLine("Alianza Verde", "paz2", 1, true);
      drawLines();
      greyOutLines("paz2", false);

      showMark('paz1');
      showMark('paz2');
    },
    () => {
      clearEverything();
      resetMarks();
      showAxis();
      showArrow('top');

      // Grey out the top arrow
      d3.selectAll(".top")
        .transition()
        .duration(400)
        .attr("opacity", 0.2);

      showArrow('bottom');

      addLine("Partido de la U - Partido Social de Unidad Nacional", "pazold", 0, true);
      addLine("Conservador Colombiano", "pazold", 0, true);
      addLine("Liberal Colombiano", "pazold", 0, true);
      addLine("Cambio Radical", "pazold", 0, true);
      addLine("PDA - Polo Democrático Alternativo", "pazold", 1, true);
      addLine("Alianza Verde", "pazold", 1, true);
      drawLines();
      greyOutLines("pazold", true);
      
      drawLines();

      addLine("Centro Democrático", "centro", 1, true);
      animateLines("centro", 200);
    },
    () => {
      clearEverything();
      resetMarks();
      showAxis();
      showArrow('top');

      // Grey out the top arrow
      d3.selectAll(".top")
        .transition()
        .duration(400)
        .attr("opacity", 0.2);

      showArrow('bottom');

      addLine("Partido de la U - Partido Social de Unidad Nacional", "pazold", 0, true);
      addLine("Conservador Colombiano", "pazold", 0, true);
      addLine("Liberal Colombiano", "pazold", 0, true);
      addLine("Cambio Radical", "pazold", 0, true);
      addLine("PDA - Polo Democrático Alternativo", "pazold", 1, true);
      addLine("Alianza Verde", "pazold", 1, true);
      drawLines();
      greyOutLines("pazold", true);
      drawLines();
      addLine("Centro Democrático", "centro", 1, true);
      drawLines();

      showMark('guerra');
    },
    () => {
      clearEverything();
      resetMarks();
      showAxis();
      showArrow('top');
      showArrow('bottom');

      addLine("Partido de la U - Partido Social de Unidad Nacional", "all", 0, true);
      addLine("Conservador Colombiano", "all", 0, true);
      addLine("Liberal Colombiano", "all", 0, true);
      addLine("Cambio Radical", "all", 0, true);
      addLine("PDA - Polo Democrático Alternativo", "all", 1, true);
      addLine("Centro Democrático", "all", 1, true);
      addLine("Alianza Verde", "all", 1, true);
      drawLines();
      greyOutLines("all", true);
    }
	]

	// update our chart
	function update(step) {
		steps[step].call()
	}
	
	// little helper for string concat if using es5
	function translate(x, y) {
		return 'translate(' + x + ',' + y + ')'
	}

	function addLine(name, extraClass, graphIndex, isParty) {

		var array = convertToLineArray(isParty ? partyData[name] : personData[name]);
		
		// define the line
    var valueline = d3.line()
      .x(function(d) { return xLine(d.startDate); })
      .y(function(d) { return  yLine1(d.pctSi); })//graphIndex == 0 ? yLine1(d.pctSi) : yLine2(d.pctSi); })
      .curve(d3.curveMonotoneX);

    console.log(maps.partyColors[name]);
    var color = maps.partyColors[name] ? maps.partyColors[name] : "#444444";

		// Add the valueline path.
    var path = linesHolder.append("path")
      .data([array])
      .attr("class", "linedata " + (extraClass != null ? extraClass:""))
      .attr("stroke", color)
      .attr("d", valueline)
      .attr("stroke-dasharray", function(d){ return this.getTotalLength() })
      .attr("stroke-dashoffset", function(d){ return this.getTotalLength() });

    var selectedBoard = board1;

    var base = selectedBoard.append('g')
   		.attr('class', 'legendItem ' + (extraClass != null ? extraClass:""));

    base.append('circle')
      .attr("cx", selectedBoard.node().getBBox().width)
      .attr("cy", 0)
      .attr("r", 6)
      .style("fill", color);

    var prettyName = maps.partyNames[name] ? maps.partyNames[name] : name;

  	var textE = base.append('text')
  		.attr('dy', 5)
  		.attr('dx', selectedBoard.node().getBBox().width)
      .style('padding-right', '20px')
  		.text((isParty ? prettyName : name) + "");

    textE.append('tspan')
      .attr('x', selectedBoard.node().getBBox().width)
      .attr('opacity', '0')
      .text("_");
	}

	function convertToLineArray(map) {
		return Object.keys(map).map((startDate) => {
      var entry = map[startDate];
      const pctSi = entry.si / (entry.si + entry.no);
      return {startDate: +parse(startDate), pctSi: pctSi};
    });
	}

	function setupCharts() {

    var svg2 = graphicVisEl2.append('svg')
      // .attr('width', width + 'px')
      // .attr('height', height + 'px')
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 0 " + width +  " " + height)

    // ============================================
    // SET UP ARROW HEADS AND GRADIENT DEFINITIONS

    // Green marker
    var markers = {
      green: {color: "#377D22"},
      red: {color: "#EC483F"}
    };

    Object.keys(markers).forEach((key) => {
      svg2.append("defs")
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

    svg2.select("defs")
      .append("marker")
        .attr("id", "triangle")
        .attr("markerWidth", 5)
        .attr("markerHeight", 5)
        .attr("viewBox", "0 0 20 20")
        .attr("refX", 1)
        .attr("refY", 5)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M 0 0 L 10 5 L 0 10 z")
        .attr("fill", "#f00");      

    // Set up lines gradient
    var gradient = svg2.select("defs")
        .append("linearGradient")
        .attr("id", "gradient-vertical")
        .attr("spreadMethod", "pad")
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "0%")
        .attr("y2", "100%");

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

    const linePos = 30;

    svg2.append("line")
      .attr("class", "axes top")
      .attr("x1",linePos)  
      .attr("y1",height/2)  
      .attr("x2",linePos)  
      .attr("y2",30)  
      .attr("stroke", markers.green.color)  
      .attr("stroke-width", 3)
      .attr("marker-end","url(#arrow-green)");  

    svg2.append("line")
      .attr("class", "axes bottom")
      .attr("x1",linePos)  
      .attr("y1",height/2)  
      .attr("x2",linePos)  
      .attr("y2",height - 30)  
      .attr("stroke", markers.red.color)  
      .attr("stroke-width",3)  
      .attr("marker-end","url(#arrow-red)");  

    svg2.append("rect")
      .attr("class", "axesrect")
      .attr("x",15)  
      .attr("y",30)  
      .attr("width",30)  
      .attr("height",height-60)  
      .attr("fill", "url(#gradient-vertical)");

    svg2.append("text")
      .text("Más gobiernista")
      .style("font", (window.isMobile ? "28":"18") + "px Montserrat")
      .attr("fill", markers.green.color) 
      .attr("text-anchor", "end")
      .attr("class", "axesText top")
      .attr("transform", "translate(20 60) rotate(-90)");

    var yPos = height - 60;
    svg2.append("text")
      .text("Menos gobiernista")
      .style("font", (window.isMobile ? "28":"18") + "px Montserrat")
      .attr("fill", markers.red.color)  
      .attr("class", "axesText bottom")
      .attr("transform", "translate(20 "+yPos+") rotate(-90)");

    // ============================================
    // SET UP AXIS ARROWS AND GRADIENT
		
   	linesChart = svg2.append('g')
			.classed('chart', true)
			.attr('transform', 'translate(' + 90 + ',' + 0 + ')');

   	xLine = d3.scaleTime()
      .domain([parse("2009-12-01"), parse("2017-03-16")])
      .range([0, width*anchoViz2]);   

    var linePadding = 60;
    yLine1 = d3.scaleLinear()
      .domain([1, 0.3])
      .range([(linePadding), height - (linePadding)]);

    linesChart.append("g")
      .call(d3.axisBottom(xLine))
      .style("font", "12px Archivo")
      .attr("transform", "translate(0 " + (height-(linePadding)) + ")")

  	var axis1 = d3.axisLeft(yLine1)
  		.tickFormat(d3.format(".0%"))
  		.tickSize(5)
      .ticks(5);

    var ticks = yLine1.ticks(5);
    var tickDistance = yLine1(ticks[1]) - yLine1(ticks[0]);

    var yOffset = 50;

    ticks.forEach((value, i) => {
      if (!(i % 2) && i != ticks.length-1) {
        linesChart.append("rect")
          .attr("class", 'bandrect2')
          .attr("fill", "#f2f2f2")
          .attr("x", 0)
          .attr("y", yLine1(value))
          .attr("width", 0)
          .attr("height", tickDistance);
      }
    });

    linesChart.append("g")
	    .style("font", "14px Archivo")
	    .call(axis1);

    var xBoardPadding = 20;
    board1 = linesChart.append("g")
    	.attr("transform", "translate(0 " + (height-15) + ")");

    linesHolder = linesChart.append("g")
      .attr("class", ".linesHolder");

    // ============================================
    // CALLOUT MARKS

    addMark(58,  120, 260, 260, "down");

    addMark(624, 240, 715, 200, "paz1");
    addMark(624, 410, 715, 315, "paz2");

    addMark(624, 345, 715, 360, "guerra");

    // ============================================
    // RESETS

    resetArrows();
    resetAxis();
    resetMarks();
	}

	function setupProse() {
		// var height = window.innerHeight * 0.5
		// graphicProseEl2.selectAll('.trigger2')
		// 	.style('height', height + 'px')
	}

	function clearEverything() {
		linesChart.selectAll(".linedata").remove();
		board1.selectAll('*').remove();
		// board2.selectAll('*').remove();
	}

  function resetArrows() {
    resetArrow('top');
    resetArrow('bottom');
  }

  function resetArrow(position) {
    var translate = null;

    if (position == 'top') {
      translate = "translate(0 100)" 
    } else if (position == 'bottom') {
      translate = "translate(0 -100)"
    } else {
      console.log("WRONG position: should be top or bottom.");
    }
    
    d3.selectAll(".axes." + position)
      .transition()
      .duration(200)
      .attr("opacity", 0)
      .attr("transform", translate);

    d3.selectAll(".axesText." + position)
      .transition()
      .duration(200)
      .attr("opacity", 0);
  }

  function addMark(x1,y1,x2,y2,id) {
    linesChart.append("line")
      .attr("id", id)
      .attr("class", "mark")
      .attr("x1",x1)  
      .attr("y1",y1)  
      .attr("x2",x2)  
      .attr("y2",y2)  
      .attr("stroke", "red")
      .attr("stroke-width",6)  
      // .attr("marker-end","url(#triangle)");  
  }

  function resetMarks() {
    linesChart.selectAll('.mark')
      .attr("stroke-dasharray", function(d){ return this.getTotalLength() })
      .attr('stroke-dashoffset', function(d){ return this.getTotalLength() })
      .attr("marker-end","none");

    linesChart.selectAll('.mark')
      .transition()
      .duration(300);
  }

  function showMark(id) {
    linesChart.select('.mark#' + id)
      .transition()
      .duration(300)
      .ease(d3.easePolyOut)
      .attr('stroke-dashoffset', "0");

    linesChart.select('.mark#' + id)
      .transition()
      .duration(0)
      .delay(300)
      .attr("marker-end", "url(#triangle)")
      .attr("stroke-dasharray", "5, 5");

    linesChart.select('.mark#' + id)
      .on("mouseover", function() {
        if (window.isMobile) return;
        graphicProseEl2.select('span#' + id)
          .attr("class", "active");
      })
      .on("mouseout", function() {
        graphicProseEl2.select('span#' + id)
          .attr("class", " ");
      });
  }

  function showArrow(position) {
    d3.selectAll(".axes." + position)
      .transition()
      // .ease(d3.easeBounce)
      .duration(500)
      .delay(100)
      .attr("opacity", 1)
      .attr("transform", "translate(0 0)");

    d3.selectAll(".axesText." + position)
      .transition()
      // .ease(d3.easeBounce)
      .duration(500)
      .delay(100)
      .attr("opacity", 1);
  }

  function resetAxis() {
    d3.selectAll(".bandrect2")
      .transition()
      .duration(200)
      .attr("width", 0);
  }

  function showAxis() {
    d3.selectAll(".bandrect2")
      .transition()           
      .duration(750)
      .delay(function(d,i){return -100*i})
        .attr("width", width*anchoViz2);
  }

	function animateLines(elemClass, initialDelay) {
    var extraSel = (elemClass != null ? "."+elemClass : "");
    var extraDelay = (initialDelay != null ? initialDelay : 0)
		linesHolder.selectAll(".linedata" + extraSel)
    		.transition()
    				.delay(function(d,i){ return (200*i) + extraDelay; })
            .duration(500)
            .ease(d3.easeQuadInOut)
        .attr("stroke-dashoffset", 0)
	}

  function drawLines() {
    linesHolder.selectAll(".linedata")
        .attr("stroke-dashoffset", 0);
  }

  function greyOutLines(elemClass, instant) {
    linesHolder.selectAll("." + elemClass)
        .transition()
            .duration(instant ? 0 : 400)
        .attr("stroke", "rgb(220,220,220)");

    board1.selectAll("." + elemClass).remove();
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