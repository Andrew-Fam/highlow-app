$(function () {


	var labelStyle = {
		fontFamily: '"Ek Mukta","Helvetica Neue",Arial, sans-serif',
		fontSize: '10px',
		color: 'white'
	},

	symbols = {},
	bets = [],
	createBetEntry = function (bet, point, index) {
		var time = new Date(point.x),
		expiry = new Date(demo.expiryTime);
		var row = $('<tr id="investment-'+index+'">'+
				'<td>'+
				'</td>'+
				'<td class="investment-type">'+ //Type
				'</td>'+
				'<td class="investment-asset">'+ //Asset
					$('.trading-platform-instrument-title').html()+
				'</td>'+
				'<td class="investment-strike highlow-'+bet+'"> '+ //Strike
					point.y.toFixed(3)+
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
				'<td class="investment-sell"><button class="investment-sell-btn btn btn-default font-m btn-sm-pad">SELL</button>'+
				'</td>'+
			'</tr>'
		);


		$('.trading-platform-investments-list').append(row);
	},
	addBettingButtons = function (series,renderer){
		// remove old button added with the last data point
		if(symbols.highButton) {
			symbols.highButton.destroy();
		}
		
		if(symbols.lowButton) {
			symbols.lowButton.destroy();
		}


		// get the latest point in the series

		var point = series.points[series.points.length-2],
		
		// get position of latest point in the series (we want to position the high/low buttons relatively to the latest point)

		pointX = point.plotX,
		pointY = point.plotY;

		// now render the 2 buttons

		var high = renderer.image('common/images/graph-up.png',pointX+76,pointY-37, 27, 27);

		high.attr({
			zIndex:'10',
			id:'in-chart-high-bet'
		});

		high.on('click', function () {
			placeBet('high',point,renderer);
		})

		// add click handler

		high.add();

		high.css({
			"cursor" : "pointer"
		});

		

		symbols.highButton = high;



		var low = renderer.image('common/images/graph-down.png',pointX+76,pointY+22, 27, 27);

		low.attr({
			zIndex:'10',
			id:'in-chart-low-bet'
		});

		low.on('click', function () {
			placeBet('low',point,renderer);
		})

		// add click handler

		low.add();

		low.css({
			"cursor" : "pointer"
		});

		

		symbols.lowButton = low;
	},
	updateBetStatus = function (rate) {
		for (var i = 0; i < bets.length; i++) {
			var bet = bets[i],
				marker = bet.marker,
				point = bet.point,
				winning = false,
				tie = false;
			// update status

			switch(bet.bet) {
				case 'high' : {
					if (rate > bet.value) { // winning
						marker.attr({
							'href':"common/images/high-win.png",
							'zIndex' : 8
						});

						winning = true;

					} else if (rate < bet.value) { // losing
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
					if (rate > bet.value) { //losing
						marker.attr({
							'href':"common/images/low-lose.png",
							'zIndex' : 6
						});
					} else if (rate < bet.value) { //winning
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

			// update position 

			marker.attr({
				x : point.plotX+50,
				y : point.plotY-24
			})

			// update table entry 

			if(winning) {
				$('#investment-'+i).removeClass().addClass('investment-winning');
			} else if(tie) {
				$('#investment-'+i).removeClass().addClass('investment-tying');
			} else {
				$('#investment-'+i).removeClass().addClass('investment-losing');
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
	},
	updateRate = function (rate) {
		$('.current-rate').html(" "+rate.toFixed(3));
	},
	updateExpiryTime = function (closing) {
		var date = new Date(closing);

		$('.expiry-time').html(date.getHours()+":"+date.getMinutes());
		// $('.time-to-expiry').html(closing);
	},
	updateRemainingTime = function () {
		setTimeout(function(){

			var currentTime = new Date().getTime(),
				expiryTime = demo.expiryTime;

				remainingTime = expiryTime - currentTime;

				remainingMinute = (remainingTime - remainingTime%60000) / 60000;

				remainingSecond = Math.floor((remainingTime%60000) / 1000);

			if(remainingSecond<0 & remainingMinute==0) {
				$('.time-to-expiry').html(' expired');
			} else {
				$('.time-to-expiry').html(" "+(remainingMinute<10?"0"+remainingMinute:remainingMinute)+":"+(remainingSecond<10?"0"+remainingSecond:remainingSecond));

				console.log('updating times');


				updateRemainingTime();
			}

			
		},1000);
	},
	placeBet = function(bet,point,renderer) {
		var x = point.plotX,
			y = point.plotY,
			value = point.y;


		

		// place bet point on graph

		switch(bet) {
			case 'high' : {
				var img = renderer.image('common/images/high-level.png',x+50,y-24,21,28);
				img.attr({
					'zIndex': 10
				});
				bets.push({
					marker : img,
					value : value,
					bet : bet,
					point : point
				});
				img.attr({
					zIndex : 6
				});
				img.add();
				break;
			}
			case 'low' : {
				var img = renderer.image('common/images/low-level.png',x+50,y-24,21,28);
				img.attr({
					'zIndex': 10
				});
				bets.push({
					marker : img,
					value : value,
					bet : bet,
					point : point
				});
				img.attr({
					zIndex : 6
				});
				img.add();
				break;
			}
			default : {
				break;
			}
		}

		// create new bet entry in table

		createBetEntry(bet,point,bets.length-1);
	},
	demo = {};


	demo.data = [];

	demo.currentTime = new Date().getTime();

	demo.startingPoint = demo.currentTime - (10*60*1000);


	demo.randomValue = function(from, to, decimal) {

		var factor = 1;

		if(decimal) {
			factor = decimal>0? Math.pow(10,decimal): 1;
		}

		var to = to * factor,
		from = from * factor;

		return Math.floor(Math.random() * (to-from+1)+from)/factor;
	} 

	// We want to generate mock data starting from 10 minutes ago
	// assuming data updates every 1 - 20 seconds

	// seed demo data array with a value

	demo.data.push([
		demo.startingPoint,
		102.202
	]);

	// start adding value 1 second after the seed value, hence demo.startingPoint + 1000 

	for (var i = demo.startingPoint + 1000,j = 1; i < demo.currentTime; i+=demo.randomValue(1000, 20000), j++) {



		// 50% of going up or down by 0 to 0.003;

		var deviation = demo.randomValue(0,0.002,3);

		var variation = Math.random() >= 0.5 ? deviation : -deviation;

		// next value calculated from variation deinfed above and previous value

		demo.data.push([i, demo.data[j-1][1] + variation]);
	}





	// Now let's assume, for the sake of the demo, that the open time is 5 minutes ago (round to closest minute)

	demo.openTime = (Math.round(demo.currentTime / (1000 * 60 * 5))-1) * 1000 * 60 * 5;

	demo.expiryTime = demo.openTime + 15*60*1000;

	// add expire point

	demo.data.push([demo.expiryTime, null]);


	updateExpiryTime(demo.expiryTime);



	Highcharts.setOptions({
		global: {
			useUTC: false
		}
	});


	$('#live-graph').highcharts({
		chart: {
			type: 'area',
			backgroundColor : '#3e424a',
			marginTop: 6,
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
				  			var deviation = demo.randomValue(0,0.001,3);
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


				  			updateRate(y);
							updateBetStatus(y);

				  			// call the function within itself to simulate continuous live data stream

				  			addPoint(y);

				  			//

				  			addBettingButtons(series,ren);


				  		}, Math.floor(demo.randomValue(1000, 2000)));
				  	}

					//start adding point with last element from the demo data as seed value

					addPoint(demo.data[demo.data.length-2][1]);
				}
			}
		},credits: {
		 	enabled: false
		},legend: {
			enabled: false
		},plotOptions: {
			area: {
				
				lineColor: '#ff9639',
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
			color: '#ffc539',
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
				from: demo.openTime, 
				to: demo.expiryTime,
				zIndex: 2
			}],
			plotLines: [{
				color: 'rgba(255,255,255,0.7)',
				value:  demo.openTime, 
				width: 1,
				zIndex: 1000
			},{
				color: 'rgba(255,255,255,0.7)',
				value:  demo.expiryTime, 
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


	var index = $("#live-graph").data('highchartsChart');
	var liveGraph = Highcharts.charts[index];

	

	var series = liveGraph.series[0];

	series.setData(demo.data);

	liveGraph.yAxis[0].addPlotLine({
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

	updateRate(series.points[series.points.length-2].y);
	addBettingButtons(series,liveGraph.renderer);

	$('.bet-high').click(function(){
		placeBet('high',series.points[series.points.length-2],liveGraph.renderer);
	});
	
	$('.bet-low').click(function(){
		placeBet('low',series.points[series.points.length-2],liveGraph.renderer);
	});

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



	// update remaining time 

	updateRemainingTime();
});