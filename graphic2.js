
/* 
	I've created a function here that is a simple d3 chart.
	This could be anthing that has discrete steps, as simple as changing
	the background color, or playing/pausing a video.
	The important part is that it exposes and update function that
	calls a new thing on a scroll trigger.
*/
window.createGraphic2 = function(partyData, personData, maps) {

	var parse  = d3.timeParse("%Y-%m-%d");

	var graphicVisEl2 = d3.select('.graphic2__vis')
	var graphicProseEl2 = d3.select('.graphic2__prose')

	var margin = 40
	// 500x500 chart
	var height = 600 
	var width = 900

	var chart2 = null;

	var xLine = null;
	var yLine1 = null;
	var yLine2 = null;
	var board1 = null;
	var board2 = null;
	
	// actions to take on each step of our scroll-driven story
	var steps = [
		() => {
			console.log("step1");

			clearEverything();

			addLine("Centro Democrático", 1, true);
			addLine("PDA - Polo Democrático Alternativo", 1, true);
			addLine("Colombia Humana", 1, true);
			addLine("Alianza Verde", 1, true);

			addLine("Opción Ciudadana", 0, true);
			addLine("Conservador Colombiano", 0, true);
			addLine("Partido de la U - Partido Social de Unidad Nacional", 0, true);
			addLine("Liberal Colombiano", 0, true);
			addLine("Cambio Radical", 0, true);

		},
		() => {
			console.log("step2");
			// chart2.selectAll(".linedata").remove();
			animateLines();
		},
		() => {
			console.log("step3");
			clearEverything();

			addLine("Conservador Colombiano", 0, true);
			addLine("Roberto Victor Gerlein Echeverria", 0, false);

			addLine("Liberal Colombiano", 1, true);
			addLine("Jaime Enrique Durán Barrera", 1, false);

			animateLines();
		},
		() => {
			console.log("step4");
			clearEverything();

			addLine("Opción Ciudadana", 0, true);
			addLine("Nerthink Mauricio Aguilar Hurtado", 0, false);

			addLine("PDA - Polo Democrático Alternativo", 1, true);
			addLine("Carlos Germán  Navas Talero", 1, false);

			animateLines();
		},
		() => {
			console.log("step5");
			clearEverything();

			addLine("Centro Democrático", 0, true);
			addLine("Pierre Eugenio   Garcia Jacquier", 0, false);

			addLine("Partido de la U - Partido Social de Unidad Nacional", 1, true);
			addLine("Carlos Enrique Soto Jaramillo", 1, false);

			animateLines();
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

	function addLine(name, graphIndex, isParty) {

		var array = convertToLineArray(isParty ? partyData[name] : personData[name]);
		
		// define the line
    var valueline = d3.line()
      .x(function(d) { return xLine(d.startDate); })
      .y(function(d) { return graphIndex == 0 ? yLine1(d.pctSi) : yLine2(d.pctSi); })
      .curve(d3.curveMonotoneX);

    console.log(maps.partyColors[name]);
    var color = maps.partyColors[name] ? maps.partyColors[name] : "#444444";

		// Add the valueline path.
    var path = chart2.append("path")
      .data([array])
      .attr("class", "linedata")
      .style("stroke", color)
      .attr("d", valueline)
      .attr("stroke-dasharray", function(d){ return this.getTotalLength() })
      .attr("stroke-dashoffset", function(d){ return this.getTotalLength() });

    var selectedBoard = graphIndex == 0 ? board1 : board2;
    var currentNum = selectedBoard.selectAll('.legendItem').size()
    var offSet = 30 * currentNum;

    var base = selectedBoard.append('g')
   		.attr('class', 'legendItem');

    base.append('circle')
      .attr("cx", 0)
      .attr("cy", offSet)
      .attr("r", 6)
      .style("fill", color);


    var prettyName = maps.partyNames[name] ? maps.partyNames[name] : name;

  	base.append('text')
  		.attr('dy', 5 + offSet)
  		.attr('dx', 10)
  		.text(isParty ? prettyName : name);
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

   	chart2 = svg2.append('g')
			.classed('chart', true)
			.attr('transform', 'translate(' + 60 + ',' + 0 + ')');

   	xLine = d3.scaleTime()
      .domain([parse("2006-01-01"), parse("2018-01-01")])
      .range([0, width/2]);   

    var linePadding = 90;
    yLine1 = d3.scaleLinear()
      .domain([1, 0])
      .range([(linePadding/2), height/2 - (linePadding/2)]);
    yLine2 = d3.scaleLinear()
      .domain([1, 0])
      .range([height/2 + (linePadding/2), height-(linePadding/2)]);
    
    chart2.append("g")
      .call(d3.axisBottom(xLine))
      .style("font", "12px Archivo")
      .attr("transform", "translate(0 " + (height/2-(linePadding/2)) + ")")

     chart2.append("g")
      .call(d3.axisBottom(xLine))
      .style("font", "12px Archivo")
      .attr("transform", "translate(0 " + (height-(linePadding/2)) + ")")
    //   .selectAll(".tick line")
  		// .attr("transform", "translate(0, 20)");

  	var axis1 = d3.axisLeft(yLine1)
  		.tickFormat(d3.format(".0%"))
  		.tickSize(-width/2)
  		.ticks(5);
    chart2.append("g")
	    .style("font", "14px Archivo")
	    .call(axis1)
	    .select(".domain").remove();
    
    var axis2 = d3.axisLeft(yLine2)
  		.tickFormat(d3.format(".0%"))
  		.tickSize(-width/2)
  		.ticks(5);

    chart2.append("g")
	    .style("font", "14px Archivo")
	    .call(axis2)
    	.select(".domain").remove();

    var xBoardPadding = 20;
    board2 = chart2.append("g")
    	.attr("transform", "translate(" + ((width/2)+xBoardPadding) + " " + ((height/2)+(linePadding/2)) + ")");
    board1 = chart2.append("g")
    	.attr("transform", "translate(" + ((width/2)+xBoardPadding) + " " + (linePadding/2) + ")");
	}

	function setupProse() {
		var height = window.innerHeight * 0.5
		graphicProseEl2.selectAll('.trigger2')
			.style('height', height + 'px')
	}

	function clearEverything() {
		chart2.selectAll(".linedata").remove();
		board1.selectAll('*').remove();
		board2.selectAll('*').remove();
	}

	function animateLines() {
		chart2.selectAll(".linedata")
    		.transition()
    				.delay(function(d,i){ return 100*i; })
            .duration(500)
            .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0)
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