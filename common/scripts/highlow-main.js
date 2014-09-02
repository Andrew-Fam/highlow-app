$(function () {


	var labelStyle = {
		fontFamily: '"Ek Mukta","Helvetica Neue",Arial, sans-serif',
		fontSize: '10px',
		color: 'white'
	},

	symbols = {},
	bets = [],
	createBetEntry = function (bet, point, index, type) {
		var time = new Date(point.x),
		expiry = new Date(highlow.expiryTime),
		strike = point.y.toFixed(3);

		if(type=="spread") {
			if(bet=="high") {
				strike = (point.y+0.005).toFixed(3);
			}
			if(bet=="low") {
				strike = (point.y-0.005).toFixed(3);
			}
		}


		var row = $('<tr id="investment-'+type+'-'+index+'">'+
			'<td class="investment-select">'+
			'</td>'+
				'<td class="investment-type '+type+'">'+ //Type
				'</td>'+
				'<td class="investment-asset">'+ //Asset
				$('.trading-platform-instrument-title').html()+
				'</td>'+
				'<td class="investment-strike highlow-'+bet+'"> '+ //Strike
				strike+
				'</td>'+
				'<td class="investment-time">'+ // Bet time
				time.getHours() + ':' + time.getMinutes() +
				'</td>'+
				'<td class="investment-expiry">'+ //Expiry
				expiry.getHours() + ':' + expiry.getMinutes() +
				'</td>'+
				'<td class="investment-status">Opened'+ //Status
				'</td>'+
				'<td class="investment-closing-rate">-'+ // Closing rate
				'</td>'+
				'<td>'+ // Investment value
				'$'+
				'<span class="investment-value">'+$('#investment-value-input').val()+
				'</span>'+
				'</td>'+
				'<td class="investment-payout">'+ // Payout
				'</td>'+
				'<td class="investment-sell"><button data-investment="'+$('#investment-value-input').val()+'" class="investment-sell-btn '+type+' btn btn-default font-m btn-sm-pad">SELL</button>'+
				'</td>'+
				'</tr>'
				);


		$('.trading-platform-investments-list').append(row);
		},
	addBettingButtons = function (series,renderer,type){

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

		// get the latest point in the series

		var point = series.points[series.points.length-2],
		
		// get position of latest point in the series (we want to position the high/low buttons relatively to the latest point)

		pointX = point.plotX,
		pointY = point.plotY;

		// now render the 2 buttons

		var high = renderer.image('common/images/graph-up.png',pointX+76,pointY-37, 27, 27);

		if(type=="spread") {
			high = renderer.image('common/images/graph-up-spread.png',pointX+76,pointY-37, 82, 27);
		}

		high.attr({
			zIndex:'10',
			id:'in-chart-high-bet'
		});

		high.on('click', function () {
			confirmBet('high',point,type);
			//placeBet('high',point,renderer);
		})

		// add click handler

		high.add();

		high.css({
			"cursor" : "pointer"
		});

		

		symbols[type].highButton = high;



		var low = renderer.image('common/images/graph-down.png',pointX+76,pointY+22, 27, 27);

		if(type=="spread") {
			low = renderer.image('common/images/graph-down-spread.png',pointX+76,pointY+22, 82, 27);
		}

		low.attr({
			zIndex:'10',
			id:'in-chart-low-bet'
		});

		low.on('click', function () {
			confirmBet('low',point,type);
			//placeBet('low',point,renderer);
		})

		// add click handler

		low.add();

		low.css({
			"cursor" : "pointer"
		});

		

		symbols[type].lowButton = low;


		if(type=="spread") {
			var highRate = renderer.text('<div>'+(point.y+0.005).toFixed(3)+'</div>',pointX+76+27,pointY-18);
			highRate.on('click', function () {
				confirmBet('high',point,type);
				//placeBet('low',point,renderer);
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

			var lowRate = renderer.text('<div>'+(point.y-0.005).toFixed(3)+'</div>',pointX+76+27,pointY+41);
			lowRate.on('click', function () {
				confirmBet('low',point,type);
				//placeBet('low',point,renderer);
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
	updateBetStatus = function (rate,type) {


		if(bets[type]) {
			for (var i = 0; i < bets[type].length; i++) {
				var bet = bets[type][i],
				marker = bet.marker,
				point = bet.point,
				winning = false,
				tie = false,
				strike = bet.value;
				// update status


				if(type=="spread") {
					if(bet.bet=="high") {
						strike = (bet.value+0.005).toFixed(3);
					}
					if(bet.bet=="low") {
						strike = (bet.value-0.005).toFixed(3);
					}
				}


				switch(bet.bet) {
					case 'high' : {
						if (rate > strike) { // winning
							marker.attr({
								'href':"common/images/high-win.png",
								'zIndex' : 8
							});

							winning = true;

						} else if (rate < strike) { // losing
							marker.attr({
								'href':"common/images/high-lose.png",
								'zIndex' : 6
							});
						} else { // tie
							marker.attr({
								'href':"common/images/high-level.png",
								'zIndex' : 6
							});

							tie = true;
						}
						break;
					}
					case 'low' : {
						if (rate > strike) { //losing
							marker.attr({
								'href':"common/images/low-lose.png",
								'zIndex' : 6
							});
						} else if (rate < strike) { //winning
							marker.attr({
								'href':"common/images/low-win.png",
								'zIndex' : 8
							});

							winning = true;
						} else { // tie
							marker.attr({
								'href':"common/images/low-level.png",
								'zIndex' : 6
							});

							tie = true;
						}
						break;
					}
					default : break;
				}

				// update position (in case the vertical scale of the graph changes)

				marker.attr({
					x : point.plotX+40,
					y : point.plotY-24
				})

				// update table entry 

				if(winning) {
					$('#investment-'+type+'-'+i).removeClass().addClass('investment-winning');
				} else if(tie) {
					$('#investment-'+type+'-'+i).removeClass().addClass('investment-tying');
				} else {
					$('#investment-'+type+'-'+i).removeClass().addClass('investment-losing');
				}


				$('.investment-winning').each(function () {
					var payoutCell = $($(this).find('.investment-payout')),
					investmentCell = $($(this).find('.investment-value'));

					payoutCell.html('$'+investmentCell.html() * $('.trading-platform-main-controls-payout-rate').html());
				});

				$('.investment-tying').each(function () {
					var payoutCell = $($(this).find('.investment-payout')),
					investmentCell = $($(this).find('.investment-value'));

					payoutCell.html('$'+investmentCell.html());
				});


				$('.investment-losing .investment-payout').html('$0');
			}
		}

		
	},
	updateRate = function (rate,type) {

		var $currentRate = $('.current-rate'+(type?"-"+type:""));




		var lastRate = $currentRate.html();


		if(lastRate > rate) {
			$currentRate.removeClass('highlow-low highlow-high');
			$currentRate.addClass('highlow-low');
		} 

		if(lastRate < rate) {
			$currentRate.removeClass('highlow-low highlow-high');
			$currentRate.addClass('highlow-high');
		}



		$currentRate.html(" "+rate.toFixed(3));


		if(type=="spread") {
			var $currentRatePlus = $('.current-rate-spread-plus');
			var $currentRateTake = $('.current-rate-spread-take');

			$currentRatePlus.html(" "+(rate+0.005).toFixed(3));
			$currentRateTake.html(" "+(rate-0.005).toFixed(3));
		}
	},
	updateExpiryTime = function (closing) {
		var date = new Date(closing);

		$('.expiry-time').html(date.getHours()+":"+date.getMinutes());
		// $('.time-to-expiry').html(closing);
	},
	updateRemainingTime = function () {
		setTimeout(function(){

			var currentTime = new Date().getTime(),
			expiryTime = highlow.expiryTime;

			remainingTime = expiryTime - currentTime;

			remainingMinute = (remainingTime - remainingTime%60000) / 60000;

			remainingSecond = Math.floor((remainingTime%60000) / 1000);

			if(remainingSecond<0 & remainingMinute==0) {
				$('.time-to-expiry').html(' expired');
			} else {
				$('.time-to-expiry').html(" "+(remainingMinute<10?"0"+remainingMinute:remainingMinute)+":"+(remainingSecond<10?"0"+remainingSecond:remainingSecond));



				updateRemainingTime();
			}

			
		},1000);
	},
	confirmBet = function (bet,point,type){

		$('.trading-select-direction-'+type+'-'+bet).click();
		$('.trading-platform-invest-popup'+'.'+type).removeClass('concealed');
		// $('.trading-platform-invest-popup .current-rate').removeClass('highlow-low highlow-high').addClass('highlow-'+bet);
	},
	placeBet = function(bet,point,renderer,type) {
		var x = point.plotX,
		y = point.plotY,
		value = point.y;

		if(!bets[type]) {
			bets[type] = [];
		}


		if(bet!="high" && bet!="low") {
			displayError("Please select an option (High or Low)!");
			return;
		}

		// place bet point on graph

		switch(bet) {
			case 'high' : {
				var img = renderer.image('common/images/high-level.png',x+40,y-24,21,28);
				bets[type].push({
					marker : img,
					value : value,
					bet : bet,
					point : point,
					type: type
				});
				img.attr({
					zIndex : 10
				});
				img.add();
				break;
			}
			case 'low' : {
				var img = renderer.image('common/images/low-level.png',x+40,y-24,21,28);
				bets[type].push({
					marker : img,
					value : value,
					bet : bet,
					point : point,
					type: type
				});
				img.attr({
					zIndex : 10
				});
				img.add();
				break;
			}
			default : {
				break;
			}
		}

		// create new bet entry in table

		createBetEntry(bet,point,bets[type].length-1,type);

		displaySuccess("Investment successfully placed!");
	},
	triggerSell = function(type) {

		$('.trading-platform-sell-popup'+'.'+type).removeClass('concealed');


		console.log($('.trading-platform-sell-popup'+'.'+type));
	},
	randomValue = function(from, to, decimal) {

		var factor = 1;

		if(decimal) {
			factor = decimal>0? Math.pow(10,decimal): 1;
		}

		var to = to * factor,
		from = from * factor;

		return Math.floor(Math.random() * (to-from+1)+from)/factor;
	},
	highlow = {},
	spread = {},
	onDemand = {};


	//highlow chart

	highlow.data = [];

	highlow.currentTime = new Date().getTime();

	highlow.startingPoint = highlow.currentTime - (10*60*1000);
 

	// We want to generate mock data starting from 10 minutes ago
	// assuming data updates every 1 - 20 seconds

	// seed highlow data array with a value

	highlow.data.push([
		highlow.startingPoint,
		102.202
		]);

	// start adding value 1 second after the seed value, hence highlow.startingPoint + 1000 

	for (var i = highlow.startingPoint + 1000,j = 1; i < highlow.currentTime; i+=randomValue(1000, 20000), j++) {



		// 50% of going up or down by 0 to 0.003;

		var deviation = randomValue(0,0.002,3);

		var variation = Math.random() >= 0.5 ? deviation : -deviation;

		// next value calculated from variation deinfed above and previous value

		highlow.data.push([i, highlow.data[j-1][1] + variation]);
	}





	// Now let's assume, for the sake of the highlow, that the open time is 5 minutes ago (round to closest minute)

	highlow.openTime = (Math.round(highlow.currentTime / (1000 * 60 * 5))-1) * 1000 * 60 * 5;

	highlow.expiryTime = highlow.openTime + 15*60*1000;

	// add expire point

	highlow.data.push([highlow.expiryTime, null]);


	updateExpiryTime(highlow.expiryTime);



	Highcharts.setOptions({
		global: {
			useUTC: false
		}
	});


	

	$('#highlow-graph').highcharts({
		chart: {
			type: 'area',
			backgroundColor : '#3e424a',
			marginTop: 6,
			marginLeft: 50,
			renderTo: 'container',
			style : {
				fontFamily: '"Ek Mukta","Helvetica Neue",Arial, sans-serif',
				fontSize: '10px',
				color: 'white',
				overflow: 'visible'
			},
			startOnTick: false,
			endOnTick: false,
			events: {
				load: function () {

					var self = this;

					// Draw right border on the chart
					var ren = this.renderer;

					ren.path(['M', 830, 6, 'L', 830, 255])
					.attr({
						'stroke-width': 1,
						stroke: '#2c2f35'
					}).add();


					
				  	// set up the updating of the chart every 1 to 2 seconds

				  	function addPoint(prev) {
				  		setTimeout(function () {
				  			var x = (new Date()).getTime();
				  			var deviation = randomValue(0,0.001,3);
				  			var variation = Math.random() >= 0.5 ? deviation : -deviation;

				  			var y = prev + variation;

				  			// remove marker from second last item (remember last item is the expiry point, not the lastest price)
				  			series.points[series.points.length-2].update({
				  				marker : {
				  					enabled: false
				  				}
				  			});

				  			// remove plotline of previous data point


				  			self.yAxis[0].removePlotLine('current-value');

				  			// add trace line to newest data point

				  			self.yAxis[0].addPlotLine({
				  				color: '#ffffff',
				  				width: 1,
				  				dashStyle: 'ShortDash',
				  				value: y,
				  				zIndex: 4,
				  				id : 'current-value'
				  			});

				  			// add new point to simulate live data update


				  			series.addPoint({
				  				x : x,
				  				y : y,
				  				marker : {
				  					enabled : true,
				  					symbol : "url(common/images/graph-marker.png)"
				  				},
				  				states: {
				  					hover: {
				  						enabled: false
				  					}
				  				},
				  			});


				  			updateRate(y,'highlow');
				  			updateBetStatus(y,'highlow');

				  			// call the function within itself to simulate continuous live data stream

				  			addPoint(y);

				  			//

				  			addBettingButtons(series,ren,'highlow');


				  		}, Math.floor(randomValue(1000, 2000)));
					}

					//start adding point with last element from the highlow data as seed value

					addPoint(highlow.data[highlow.data.length-2][1]);
				}
			}
		},credits: {
			enabled: false
		},legend: {
			enabled: false
		},plotOptions: {
			area: {
				
				lineColor: '#ffa200',
				lineWidth: 2
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
			color: '#ffe048',
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
			gridLineColor: '#2c2f35',
			tickInterval : 0.002,
			tickWidth : 0,
			lineColor: '#2c2f35',
			lineWidth: 1,
			title: {
				text : null
			}
		},xAxis: {
			labels: {
				style: labelStyle
			},
			minPadding: 0,
			gridLineWidth: 1,
			gridLineColor: '#2c2f35',
			dateTimeLabelFormats: {
				second: '%H:%M',
				minute: '%H:%M',
				hour: '%H:%M:%S',
				day: '%e. %b %H:%M',
				week: '%e. %b %H:%M'
			},
			plotBands: [{
				color: 'rgba(77,81,88,0.55)',
				from: highlow.openTime, 
				to: highlow.expiryTime,
				zIndex: 2
			}],
			plotLines: [{
				color: 'rgba(255,255,255,0.7)',
				value:  highlow.openTime, 
				width: 1,
				zIndex: 1000
			},{
				color: 'rgba(255,255,255,0.7)',
				value:  highlow.expiryTime, 
				width: 1,
				zIndex: 1000
			}],
			tickInterval : '300000',
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


	var index = $("#highlow-graph").data('highchartsChart');
	var highlowGraph = Highcharts.charts[index];



	var series = highlowGraph.series[0];

	series.setData(highlow.data);

	highlowGraph.yAxis[0].addPlotLine({
		color: '#ffffff',
		width: 1,
		dashStyle: 'ShortDash',
		value: series.points[series.points.length-2].y,
		zIndex: 100,
		id: 'current-value'
	});

	series.points[series.points.length-2].update({
		marker : {
			enabled : true,
			symbol : "url(common/images/graph-marker.png)"
		}
	});

	updateRate(series.points[series.points.length-2].y,'highlow');
	addBettingButtons(series,highlowGraph.renderer,'highlow');

	$('.trading-platform-investments').on('click','.investment-sell-btn.highlow',function(){
		triggerSell('highlow');
	});

	$('.bet-high').click(function(){
		placeBet('high',series.points[series.points.length-2],highlowGraph.renderer,'highlow');
	});
	
	$('.bet-low').click(function(){
		placeBet('low',series.points[series.points.length-2],highlowGraph.renderer,'highlow');
	});

	$('.trading-platform-main-controls-place-bet.highlow').click(function(){
		var direction = $('input:radio[name="'+$(this).data('direction')+'"]:checked').val();
		placeBet(direction,series.points[series.points.length-2],highlowGraph.renderer,'highlow');
		$('.trading-platform-invest-popup.highlow').addClass('concealed');
	});

	// end highlow graph


	// spread graph	

	spread.data = [];

	spread.currentTime = new Date().getTime();

	spread.startingPoint = spread.currentTime - (10*60*1000);

	spread.data.push([
		spread.startingPoint,
		90.202
	]);

	for (var i = spread.startingPoint + 1000,j = 1; i < spread.currentTime; i+=randomValue(1000, 20000), j++) {


		// 50% of going up or down by 0 to 0.003;

		var deviation = randomValue(0,0.002,3);

		var variation = Math.random() >= 0.5 ? deviation : -deviation;

		// next value calculated from variation deinfed above and previous value

		spread.data.push([i, spread.data[j-1][1] + variation]);
	}


	spread.openTime = (Math.round(spread.currentTime / (1000 * 60 * 5))-1) * 1000 * 60 * 5;

	spread.expiryTime = spread.openTime + 15*60*1000;

	// add expire point

	spread.data.push([spread.expiryTime, null]);


	updateExpiryTime(spread.expiryTime,"spread");

	$('#spread-graph').highcharts({
		chart: {
			type: 'area',
			backgroundColor : '#3e424a',
			marginTop: 6,
			marginLeft: 50,
			renderTo: 'container',
			style : {
				fontFamily: '"Ek Mukta","Helvetica Neue",Arial, sans-serif',
				fontSize: '10px',
				color: 'white',
				overflow: 'visible'
			},
			startOnTick: false,
			endOnTick: false,
			events: {
				load: function () {

					var self = this;

					// Draw right border on the chart
					var ren = this.renderer;

					var series = this.series[0];

					ren.path(['M', 830, 6, 'L', 830, 255])
					.attr({
						'stroke-width': 1,
						stroke: '#2c2f35'
					}).add();


					
				  	// set up the updating of the chart every 1 to 2 seconds

				  	function addPoint(prev) {
				  		setTimeout(function () {
				  			var x = (new Date()).getTime();
				  			var deviation = randomValue(0,0.001,3);
				  			var variation = Math.random() >= 0.5 ? deviation : -deviation;

				  			var y = prev + variation;

				  			// remove marker from second last item (remember last item is the expiry point, not the lastest price)
				  			series.points[series.points.length-2].update({
				  				marker : {
				  					enabled: false
				  				}
				  			});

				  			// remove plotline of previous data point


				  			self.yAxis[0].removePlotLine('current-value');

				  			// add trace line to newest data point

				  			self.yAxis[0].addPlotLine({
				  				color: '#ffffff',
				  				width: 1,
				  				dashStyle: 'ShortDash',
				  				value: y,
				  				zIndex: 4,
				  				id : 'current-value'
				  			});

				  			// add new point to simulate live data update


				  			series.addPoint({
				  				x : x,
				  				y : y,
				  				marker : {
				  					enabled : true,
				  					symbol : "url(common/images/graph-marker.png)"
				  				},
				  				states: {
				  					hover: {
				  						enabled: false
				  					}
				  				},
				  			});


				  			updateRate(y,'spread');
				  			updateBetStatus(y,'spread');

				  			// call the function within itself to simulate continuous live data stream

				  			addPoint(y);

				  			//

				  			addBettingButtons(series,ren,'spread');


				  		}, Math.floor(randomValue(1000, 2000)));
					}

					//start adding point with last element from the highlow data as seed value

					addPoint(spread.data[spread.data.length-2][1]);
				}
			}
		},credits: {
			enabled: false
		},legend: {
			enabled: false
		},plotOptions: {
			area: {
				
				lineColor: '#ffa200',
				lineWidth: 2
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
			color: '#ffe048',
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
			gridLineColor: '#2c2f35',
			tickInterval : 0.002,
			tickWidth : 0,
			lineColor: '#2c2f35',
			lineWidth: 1,
			title: {
				text : null
			}
		},xAxis: {
			labels: {
				style: labelStyle
			},
			minPadding: 0,
			gridLineWidth: 1,
			gridLineColor: '#2c2f35',
			dateTimeLabelFormats: {
				second: '%H:%M',
				minute: '%H:%M',
				hour: '%H:%M:%S',
				day: '%e. %b %H:%M',
				week: '%e. %b %H:%M'
			},
			plotBands: [{
				color: 'rgba(77,81,88,0.55)',
				from: spread.openTime, 
				to: spread.expiryTime,
				zIndex: 2
			}],
			plotLines: [{
				color: 'rgba(255,255,255,0.7)',
				value:  spread.openTime, 
				width: 1,
				zIndex: 1000
			},{
				color: 'rgba(255,255,255,0.7)',
				value:  spread.expiryTime, 
				width: 1,
				zIndex: 1000
			}],
			tickInterval : '300000',
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

	var spreadIndex = $("#spread-graph").data('highchartsChart');
	var spreadGraph = Highcharts.charts[spreadIndex];



	var spreadSeries = spreadGraph.series[0];

	spreadSeries.setData(spread.data);

	spreadGraph.yAxis[0].addPlotLine({
		color: '#ffffff',
		width: 1,
		dashStyle: 'ShortDash',
		value: spreadSeries.points[spreadSeries.points.length-2].y,
		zIndex: 100,
		id: 'current-value'
	});

	spreadSeries.points[spreadSeries.points.length-2].update({
		marker : {
			enabled : true,
			symbol : "url(common/images/graph-marker.png)"
		}
	});

	updateRate(spreadSeries.points[spreadSeries.points.length-2].y,'spread');
	addBettingButtons(spreadSeries,spreadGraph.renderer,'spread');


	$('.trading-platform-investments').on('click','.investment-sell-btn.spread',function(){
		triggerSell('spread');
	});

	$('.bet-spread-high').click(function(){
		placeBet('high',spreadSeries.points[spreadSeries.points.length-2],spreadGraph.renderer,'spread');
	});
	
	$('.bet-spread-low').click(function(){
		placeBet('low',spreadSeries.points[spreadSeries.points.length-2],spreadGraph.renderer,'spread');
	});


	$('.trading-platform-main-controls-place-bet.spread').click(function(){
		var direction = $('input:radio[name="'+$(this).data('direction')+'"]:checked').val();
		placeBet(direction,spreadSeries.points[spreadSeries.points.length-2],spreadGraph.renderer,'spread');
		$('.trading-platform-invest-popup.spread').addClass('concealed');
	});

	// end spread graph


	$('.trading-platform-instrument-one-click-toggler').click(function(){
		var self = $(this),
		$platform = $('.trading-platform');

		if(self.hasClass('active')) {
			self.removeClass('active');
			$platform.removeClass('one-click');
		} else {
			self.addClass('active');
			$platform.addClass('one-click');
		}
	});


	$('.trading-platform-popup-wrapper').on('click','.close', function(event) {
		$(event.target).closest('.trading-platform-popup-wrapper').addClass('concealed');
	});
	$('.trading-platform-popup-wrapper').on('click',function(event) {
		if (!$(event.target).closest('.trading-platform-popup-content-inner-wrap').length) {
			$(this).addClass('concealed');
		}
	});
	

	$('.instrument-selector-widget').on('click','.instrument-selector-widget-collapse-toggle',function(event){
		var self = $(this),
		$parent = $($(event.target).closest('.instrument-selector-widget')),
		$instrumentPanels = $parent.find('.instrument-panel'),
		$instrumentSliders = $parent.find('.instrument-selector-widget-instruments-slider');
		if(self.hasClass('on')) {
			self.removeClass('on');
			// $instrumentPanels.removeClass('collapsed');
			$instrumentPanels.animate({
				height: '140px'
			},200,function(){
				$instrumentPanels.removeClass('collapsed');
			});
			$instrumentSliders.animate({
				'line-height' : '188px'
			},400);
		} else {
			self.addClass('on');
			// $instrumentPanels.addClass('collapsed');
			$instrumentPanels.animate({
				height: '36px'
			},200,function(){
				$instrumentPanels.addClass('collapsed');
			});

			$instrumentSliders.animate({
				'line-height' : '102px'
			},400);
		}
	});


	$('.tab-view').on('click','.tab-view-tab-selector', function(event){


		$($(event.target).closest('.tab-view').find('> .tab-view-body-wrapper > .tab-view-body > .tab-view-panel')).removeClass('active');
		$($(event.target).closest('.tab-view-tab-selectors').find('.tab-view-tab-selector')).removeClass('active');
		
		$($(this).data('target')).addClass('active');
		$(this).addClass('active');
	});

	$('.trading-platform-main-controls-select-direction .btn').click(function(){
		$('.trading-platform-main-controls-select-direction .btn').removeClass('active');
		if($(this).hasClass('active')) {
			$(this).removeClass('active');
		} else {
			$(this).addClass('active');
		}
	});

	// slider

	$('.page-container').each(function(){
		var $currentPage = $($(this).find('.page.active'));

		$currentPage.next('.page').addClass('next');
		$currentPage.prev('.page').addClass('prev');
	});

	$('.page-slider.forward').click(function(){
		var $target = $($(this).data('target')),
		$currentPage = $($target.find('.page.active'));
		if($currentPage.next('.page').length>0) {
			$currentPage.next('.page').animate({
				"left" : 0 
			},{
				duration: 500,
				complete: function () {
					$(this).addClass('active').removeClass('next');
					$(this).next('.page').addClass('next');
				}
			});
			$currentPage.animate({
				"left" : "-100%"
			},{
				duration: 500,
				complete: function() {
					$(this).removeClass('active').addClass('prev');
					$(this).prev('.page').removeClass('prev');
				}
			});
		}
	});

	$('.page-slider.backward').click(function(){
		var $target = $($(this).data('target')),
		$currentPage = $($target.find('.page.active'));
		if($currentPage.prev('.page').length>0) {
			$currentPage.prev('.page').animate({
				"left" : 0 
			},{
				duration: 500,
				complete: function () {
					$(this).addClass('active').removeClass('prev');
					$(this).prev('.page').addClass('prev');
				}
			});
			$currentPage.animate({
				"left" : "100%"
			},{
				duration: 500,
				complete: function() {
					$(this).removeClass('active').addClass('next');
					$(this).next('.page').removeClass('next');
				}
			});
		}
	});

	// update remaining time 

	updateRemainingTime();
});