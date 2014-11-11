highlowApp.graph = {
	graphs : {},
	onGraphUI : {},
	init : function (){

		Highcharts.setOptions({
		    plotOptions: {
		        series: {
		            animation: false
		        }
		    },
		    global : {
		    	useUTC: false
		    }
		});

		this.prepareGraph('#highlow-graph');
		this.prepareGraph('#spread-graph');
		this.prepareGraph('#on-demand-graph',2*60*1000);
		this.prepareGraph('#spread-on-demand-graph',2*60*1000);

		this.graphs['highlow'] = Highcharts.charts[$("#highlow-graph").data('highchartsChart')];
		this.graphs['spread'] = Highcharts.charts[$("#spread-graph").data('highchartsChart')];
		this.graphs['on-demand'] = Highcharts.charts[$("#on-demand-graph").data('highchartsChart')];
		this.graphs['spread-on-demand'] = Highcharts.charts[$("#spread-on-demand-graph").data('highchartsChart')];
	},
	indexOfPointByXRecursive: function(points, x, lowerBoundary, upperBoundary) {

		// Fool check...

	    if (upperBoundary < lowerBoundary) {
	        return null;
	    }
	    // get mid point

	    var mid = Math.floor((lowerBoundary+upperBoundary)/2);

	    if (points[mid].x > x)
	        return this.indexOfPointByXRecursive(points, x, lowerBoundary, mid-1);
	    else if (points[mid].x < x)
	        return this.indexOfPointByXRecursive(points, x, mid+1, upperBoundary);
	    else
	        return mid;
	},
	loadInstrument: function (model) {

		var currentTime = new Date().getTime();

		

		$('#'+model.type+"-graph").highcharts().destroy();

		this.prepareGraph('#'+model.type+"-graph");

		this.graphs[model.type] = $('#'+model.type+"-graph").highcharts();

		var graph = this.graphs[model.type];

		var renderer = graph.renderer;

		// add graph closing line;

		var resize = $('#'+model.type+"-graph").closest('.trading-platform-live-graph').hasClass('pushed');

		if(resize) {
			var closingLine = renderer.path(['M', 789, 6, 'L', 789, 274])
			.attr({
				'stroke-width': 1,
				stroke: '#252323'
			}).add();
			

			// add graph bottom line;

			var bottomLine = renderer.path(['M', 49, 275, 'L', 789, 275])
			.attr({
				'stroke-width': 1,
				stroke: '#252323'
			}).add();
		} else {
			var closingLine = renderer.path(['M', 830, 6, 'L', 830, 274])
			.attr({
				'stroke-width': 1,
				stroke: '#252323'
			}).add();
			

			// add graph bottom line;

			var bottomLine = renderer.path(['M', 49, 275, 'L', 830, 275])
			.attr({
				'stroke-width': 1,
				stroke: '#252323'
			}).add();
			}

		

		var series = graph.series[0];

		// make sure the graph data and model data doesn't intertwine

		var data = JSON.parse(JSON.stringify(model.data));

		series.setData(data, true, false, false);

		var xAxis = graph.xAxis[0];




		if(model.type==="on-demand") {
			
			xAxis.setExtremes(currentTime-10*60*1000,currentTime+3*60*1000,true);
		
		} else {
			
			xAxis.setExtremes(model.openAt-5*60*1000,model.openAt+20*60*1000,true);
			
			var plotBandId = model.type+"-plot-band";
			var startLineId = model.type+"-start-plot-line";
			var endLineId = model.type+"-end-plot-line";

			xAxis.removePlotBand(plotBandId);
			
			xAxis.addPlotBand({
				color: 'rgba(255,255,255,0.08)',
				from: model.openAt, 
				to: model.expireAt,
				zIndex: 2,
				id: plotBandId
			});

			xAxis.removePlotLine(startLineId);

			xAxis.addPlotLine({
				color: 'rgba(255,255,255,0.7)',
				value:  model.openAt, 
				width: 1,
				zIndex: 1000,
				id: startLineId
			});

			xAxis.removePlotLine(endLineId);

			xAxis.addPlotLine({
				color: 'rgba(255,255,255,0.7)',
				value:  model.expireAt, 
				width: 1,
				zIndex: 1000,
				id: endLineId
			});

		}

		series.points[series.points.length-1].update({
			marker : {
				enabled : true,
				symbol : "url(common/images/graph-marker.png)",
				zIndex : 1000
			},
			states: {
				hover: {
					enabled: false
				}
			},
			zIndex: 1000
		});

		// add trace line to newest data point

		graph.yAxis[0].addPlotLine({
			color: '#ffffff',
			width: 1,
			dashStyle: 'ShortDash',
			value: model.currentRate,
			zIndex: 4,
			id : 'current-value'
		});

		this.updateOnGraphUI(model,series.points[series.points.length-1]);

		
		// reload bet points 

		// go through all bets associated with this instrument

		for(var i=0; i< model.bets.length; i++) {



			var bet = model.bets[i];



			// reset finish text for on-demand bets

			if(model.type.indexOf('on-demand')>=0) {
				bet.finishLabel = undefined;
				bet.finishText = undefined;
			}


			// do a binary search in the series.points to find the right point.

			bet.point = series.points[this.indexOfPointByXRecursive(series.points,bet.x,0,series.points.length-1)];

			this.placeBet(bet);

			
		}


	},
	updateOnGraphUI: function (model,point) {

		var symbols = this.onGraphUI,
		type = model.type;

		if(!symbols[type]) {
			symbols[type] = {};
		}

		// remove old button added with the last data point
		if(symbols[type].highButton) {
			symbols[type].highButton.destroy();
		}
		
		if(symbols[type].lowButton) {
			symbols[type].lowButton.destroy();
		}

		if(symbols[type].lowRate) {
			symbols[type].lowRate.destroy();
		}

		if(symbols[type].highRate) {
			symbols[type].highRate.destroy();
		}

		var graph = this.graphs[model.type];

		var series = graph.series[0];

		var renderer  = graph.renderer;

		
		var xAxis = graph.xAxis[0],
		yAxis = graph.yAxis[0];

		yAxis.removePlotLine('current-value');

		// add trace line to newest data point

		yAxis.addPlotLine({
			color: '#ffffff',
			width: 1,
			dashStyle: 'ShortDash',
			value: point.y,
			zIndex: 4,
			id : 'current-value'
		});



		if(model.type==="on-demand") {

			// set graph range

			xAxis.setExtremes(point.x-7*60*1000,point.x+3*60*1000,true);

		} else {

			// set graph range

			xAxis.setExtremes(point.x-10*60*1000,point.x+12*60*1000,true);

		}

		// get the extremes of y Axis to check if the current point is going to fall off screen

		var currentYExtremes = yAxis.getExtremes();


		var bottomExtreme = currentYExtremes.min,
		topExtreme = currentYExtremes.max;

		var yMiddle = (topExtreme + bottomExtreme) / 2;

		var safeZone = 0.005;
		var interval = 0.002;
		var bufferZone = interval*1;
		var tickCount = 8;

		var newTopExtreme = topExtreme,
		newBottomExtreme = bottomExtreme;

	





		if( point.y>yMiddle) {
			// check if point is too close to top edge
			

			if(topExtreme - point.y < safeZone) {

				newTopExtreme  += safeZone - (topExtreme-point.y);
				newBottomExtreme = newTopExtreme - interval*tickCount;

				yAxis.setExtremes(newBottomExtreme,newTopExtreme,true);

			} 
		} else {
			// check if point is too close to bottom edge

			if(point.y - bottomExtreme < safeZone) {

				newBottomExtreme -= safeZone-(point.y-bottomExtreme);
				newTopExtreme = newBottomExtreme + interval*tickCount;

				yAxis.setExtremes(newBottomExtreme,newTopExtreme,true);

			}
		}


		// get position of latest point in the series (we want to position the high/low buttons relatively to the latest point)

		pointX = point.plotX,
		pointY = point.plotY;


		var	highX = pointX+76,
			highY = pointY-37,
			lowX = pointX+76,
			lowY = pointY+22;

		if(highY<5 || lowY>230) {
			highY = pointY - 7;
			highX = pointX + 68;
			lowY = pointY - 7;
			lowX = pointX + 104;

			if(type=="spread") {
				lowX = lowX + 69;
			}
		}

		// now render the 2 buttons

		var high = renderer.image('common/images/graph-up.png',highX,highY, 27, 27);

		if(type=="spread") {
			high = renderer.image('common/images/graph-up-spread.png',highX,highY, 96, 27);
		}

		high.attr({
			zIndex:'10',
			id:'in-chart-high-bet'
		});

		high.on('click', function () {
			highlowApp.betSystem.confirmBet('high',point,model.type);
		})

		// add click handler

		high.add();

		high.css({
			"cursor" : "pointer"
		});

		symbols[type].highButton = high;

		// 

		var low = renderer.image('common/images/graph-down.png',lowX,lowY, 27, 27);

		if(type=="spread") {
			low = renderer.image('common/images/graph-down-spread.png',lowX,lowY, 96, 27);
		}

		low.attr({
			zIndex:'10',
			id:'in-chart-low-bet'
		});

		low.on('click', function () {
			highlowApp.betSystem.confirmBet('low',point,model.type);
		})

		// add click handler

		low.add();

		low.css({
			"cursor" : "pointer"
		});

		symbols[type].lowButton = low;

		if(type=="spread") {
			var highRate = renderer.text('<div class="on-graph-button">'+(point.y+0.005).toFixed(3)+'</div>',highX+27,highY+19);
			highRate.on('click', function () {
				highlowApp.betSystem.confirmBet('high',point,model.type);
			})
			highRate.attr({
				zIndex:'10',
				id:'in-chart-spread-high-bet-rate'
			});
			highRate.css({
				"cursor" : "pointer",
				"font-size" : "16px;",
				"color" : "white"
			});
			highRate.add();

			var lowRate = renderer.text('<div class="on-graph-button">'+(point.y-0.005).toFixed(3)+'</div>',lowX+27,lowY+19);
			lowRate.on('click', function () {
				highlowApp.betSystem.confirmBet('low',point,model.type);
			});
			lowRate.css({
				"cursor" : "pointer",
				"font-size" : "16px;",
				"color" : "white"
			});
			lowRate.attr({
				zIndex:'10',
				id:'in-chart-spread-low-bet-rate'
			});

			lowRate.add();

			symbols[type].highRate = highRate;

			symbols[type].lowRate = lowRate;
		}



	},
	placeBet : function(betObject) {

		var graph = $('#'+betObject.type+"-graph").highcharts();

		var series = graph.series[0];

		var renderer = graph.renderer;

		if(betObject.marker!=undefined) {
			betObject.marker.destroy();
		}

		var pointX = betObject.point.plotX,
		pointY = betObject.point.plotY;

		// if(betObject.type.indexOf('on-demand')<0) {
			switch(betObject.direction) {
				case 'high' : {
					var img = renderer.image('common/images/high-level.png',pointX+40,pointY-24,21,28);

					img.on('click', betObject.focus);

					img.css({
						'cursor' : 'pointer'
					});

					img.attr({
						zIndex : 10
					});
					img.add();
					betObject.marker = img;
					break;
				}
				case 'low' : {
					var img = renderer.image('common/images/low-level.png',pointX+40,pointY-24,21,28);

					img.on('click', betObject.focus);

					img.css({
						'cursor' : 'pointer'
					});

					img.attr({
						zIndex : 10
					});
					img.add();
					betObject.marker = img;
					break;
				}
				default : {
					break;
				}
			}

		// } else {


		// }


	},
	addPoint: function (model,point) {



		var graph = this.graphs[model.type];

		var series = graph.series[0];

		series.points[series.points.length-1].update({
			marker : {
				enabled: false
			}
		});

		series.addPoint(point,true,false,false);


		this.updateOnGraphUI(model,series.points[series.points.length-1]);
		

	},
	prepareGraph: function (id,xInterval) {
		var labelStyle = {
			fontFamily: '"Roboto","Helvetica Neue",Helvetica, Arial, sans-serif',
			fontSize: '10px',
			color: 'white'
		};

		var xTickInterval = ""+(5*60*1000);

		if(xInterval) {
			xTickInterval = ""+xInterval;
		}


		return $(id).highcharts({
			chart: {
				type: 'area',
				animation: false,
				backgroundColor : '#353535',
				marginTop: 6,
				marginLeft: 50,
				renderTo: 'container',
				style : {
					fontFamily: '"Roboto","Helvetica Neue",Helvetica, Arial, sans-serif',
					fontSize: '10px',
					color: 'white',
					overflow: 'visible'
				},
				startOnTick: false,
				endOnTick: false
			},credits: {
				enabled: false
			},legend: {
				enabled: false
			},plotOptions: {
				area: {
					lineColor: '#ffa200',
					lineWidth: 2,
					marker: {
		                enabled: false
		            }
				},
				series: {
					marker : {
						enabled : false,
						states : {
							hover : {
								enabled : false
							}
						},
						zIndex : 10000
					}
				}
			},series : [{
				color: {
				    linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
				    stops: [
				        [0, '#ffe048'],
				        [1, '#ffc539']
				    ]
				},
				fillOpacity: '1',
				name : '',
				type: 'area',
				data : [],
				threshold: null,
				marker : {
					enabled: false
				}
			}],yAxis: {
				labels: {
					style: labelStyle,
					format: '{value:.3f}'
				},
				gridLineWidth: 1,
				gridLineColor: '#252323',
				tickInterval : 0.002,
				tickWidth : 0,
				lineColor: '#252323',
				lineWidth: 1,
				startOnTick: false,
				endOnTick: true,
				title: {
					text : null
				}
			},xAxis: {
				labels: {
					style: labelStyle
				},
				minPadding: 0,
				gridLineWidth: 1,
				gridLineColor: '#252323',
				dateTimeLabelFormats: {
					second: '%H:%M',
					minute: '%H:%M',
					hour: '%H:%M:%S',
					day: '%e. %b %H:%M',
					week: '%e. %b %H:%M'
				},
				ordinal : false,
				lineColor: '#252323',
				lineWidth: 1,
				tickInterval : xTickInterval,
				tickWidth : 0,
				type: 'datetime',
				lineColor: 'transparent'
			},title: {
				text: ''
			},
			tooltip : {
				enabled: false
			},
			subtitle: {
				text: ''
			}
		});
	}
}