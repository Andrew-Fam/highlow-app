highlowApp.marketSimulator = {
	instruments : [],
	spread: 0.005,
	rounding: 3,
	minInterval: 1000,
	maxInterval: 1500,
	maxChange: 0.0008,
	modelDataName: 'instrumentModel',
	start: function() {
		var self = this;
		for (var i = 0; i < this.instruments.length; i++) {
			var instrument  = this.instruments[i];

			instrument.update();
			instrument.updateTime();
		}
	},
	simulate: function(instrument) {
		var self = this;
	
		var deviation = highlowApp.randomValue(0,self.maxChange,4);

		// if the market has been moving up, there's more chance it's gonna go down this time

		var coefficient = 0.0016;



		var splitChance = 0.5;

		if(instrument.absoluteChange>0) {
			splitChance+=0.1;
		} else if(instrument.absoluteChange<0) {
			splitChance-=0.1;
		}

		if(instrument.absoluteChange>0.002) {
			splitChance+=0.3;
		} else if(instrument.absoluteChange<0.002) {
			splitChance-=0.3;
		}


		// console.log(splitChance);

		var variation = Math.random() >= splitChance ? deviation : -deviation;





		instrument.previousRate = parseFloat(instrument.currentRate);
		instrument.currentRate = parseFloat(instrument.currentRate + variation);




		instrument.absoluteChange += parseFloat(variation);

		if (instrument.type === 'spread') {
			instrument.upperRate = parseFloat(parseFloat(instrument.currentRate) + self.spread);
			instrument.lowerRate = parseFloat(parseFloat(instrument.currentRate) - self.spread);
		}

		var currentTime = new Date().getTime();

		if(instrument.active) {
			// update graph
			highlowApp
			.graph
			.addPoint(
				instrument,
				{
	  				x : currentTime,
	  				y : instrument.currentRate,
	  				marker : {
	  					enabled : true,
	  					symbol : "url(common/images/graph-marker.png)"
	  				},
	  				states: {
	  					hover: {
	  						enabled: false
	  					}
	  				},
	  				zIndex: 10
	  			}
  			);
		} 

		instrument.data.push({
			x: currentTime,
			y: instrument.currentRate,
			marker : {
				enabled: false
			}
		});


		self.updateUI(instrument.uid,instrument);

		self.updateBetStatus(instrument);

	},
	updateBetStatus: function(model) {
		// bet markers
 
		var currentTime = new Date().getTime();

		var graph = $('#'+model.type+"-graph").highcharts();

		var series = graph.series[0];

		var xAxis = graph.xAxis[0];

		var renderer = graph.renderer;
			
		for(var i=0; i< model.bets.length; i++) {

			var bet = model.bets[i],
				marker = bet.marker,
				rate = parseFloat(model.currentRate).toFixed(this.rounding),
				point = bet.point,
				winning = false,
				tie = false,
				strike = parseFloat(bet.strike).toFixed(this.rounding),
				expired = false,
				nonActive = false;

			if(bet.expireAt!=undefined) {
				if (bet.expireAt < currentTime && bet.closingRate==undefined) {
					expired = true;
					bet.expired = true;
					bet.closingRate = rate;
				}
			}

			nonActive = (expired || !bet.focused);

			


			if(model.active) {


				var pointX = point.plotX,
					pointY = point.plotY;

				var marker = bet.marker;


				marker.attr({
					x : point.plotX+39,
					y : point.plotY-24
				});

				// only update marker image if the bet is not expired yet

				if(!expired) {

					switch(bet.direction) {
						case 'high' : {
							if (rate > strike) { // winning
								marker.attr({
									'href':"common/images/high-win"+(nonActive?'-expired':"")+".png",
									'zIndex' : 10
								});

								
								winning = true;

							} else if (rate < strike) { // losing
								marker.attr({
									'href':"common/images/high-lose"+(nonActive?'-expired':"")+".png",
									'zIndex' : 11
								});


							} else { // tie
								marker.attr({
									'href':"common/images/high-level"+(nonActive?'-expired':"")+".png",
									'zIndex' : 10
								});

								tie = true;
							}
							break;
						}
						case 'low' : {
							if (rate > strike) { //losing
								marker.attr({
									'href':"common/images/low-lose"+(nonActive?'-expired':"")+".png",
									'zIndex' : 10
								});
							} else if (rate < strike) { //winning
								marker.attr({
									'href':"common/images/low-win"+(nonActive?'-expired':"")+".png",
									'zIndex' : 11
								});

								
								winning = true;
							} else { // tie
								marker.attr({
									'href':"common/images/low-level"+(nonActive?'-expired':"")+".png",
									'zIndex' : 10
								});

								tie = true;
							}
							break;
						}
						default : break;
					}

					if(bet.focused) {
						marker.attr({
							zIndex: 14
						});

						$($(marker.element).parent()).append(marker.element);
					}


				}


				if(model.type.indexOf('on-demand')>=0) {
					var plotBandId = model.type+"-plot-band-"+model.uid+"-"+i;
					var startLineId = model.type+"-start-plot-line-"+model.uid+"-"+i;
					var endLineId = model.type+"-end-plot-line-"+model.uid+"-"+i;
					var finishTextId = model.type+"-finish-text-"+model.uid+"_"+i;
					var finishLabelId = model.type+"-finish-label-"+model.uid+"_"+i;

					//@Working
					

					xAxis.removePlotBand(plotBandId);
					xAxis.removePlotLine(startLineId);
					xAxis.removePlotLine(endLineId);
				
					if(bet.focused) {

						xAxis.addPlotBand({
							color: 'rgba(77,81,88,0.55)',
							from: bet.betAt, 
							to: bet.expireAt,
							zIndex: 2,
							id: plotBandId
						});

						

						xAxis.addPlotLine({
							color: 'rgba(255,255,255,0.7)',
							value:  bet.betAt, 
							width: 1,
							zIndex: 1000,
							id: startLineId
						});

						

						xAxis.addPlotLine({
							color: 'rgba(255,255,255,0.7)',
							value:  bet.expireAt,
							width: 1,
							zIndex: 1000,
							id: endLineId
						});

						// add finish line label 
					
					
						var x = point.plotX, 
							labelX = Math.floor(xAxis.toPixels(bet.expireAt)-17),
							label = renderer.rect(labelX,52,17,177,0);

						var textX = labelX+4,
							textY = 141;

						if(bet.finishLabel == undefined) {

							bet.finishLabelId = finishLabelId;
							
							label.attr({
								fill: '#f8f7f5',
				                zIndex: 3
							});

							label.add();

							bet.finishLabel = label ;
						} else {
							bet.finishLabel.attr({
								x : labelX
							});
						}


						if(bet.finishText==undefined) {

							bet.finishTextId = finishTextId;

							text = renderer.text('loading...',textX,textY);

							text.css({
								"font-size" : "12px;",
								"color" : "#53565b"
							});


							

							text.attr({
								zIndex: 6,
								id: bet.finishTextId,
								transform: 'translate(0,0) rotate(90 '+textX+' '+textY+')',
								width: '177px',
								'text-anchor': 'middle'
							});

							text.add();


							bet.finishText = text;
						} else {

							bet.finishText.attr({
								x: textX,
								'transform': 'translate(0,0) rotate(90 '+textX+' '+textY+')'
							});
						}

						marker.attr({
							zIndex: 14
						});

						$($(marker.element).parent()).append(marker.element);
					} else {
						if(bet.finishText!=undefined) {
							bet.finishText.destroy();
							bet.finishLabel.destroy();
							bet.finishText = undefined;
							bet.finishLabel = undefined;
						}
					}


				}
				

				
				
				
			}

			

			// update bet entry in table 

			highlowApp.betSystem.updateBetEntry(bet,model);
			

			
			
		}
	},
	updateUI: function (uid,model) {
		var view = $('[data-uid="'+uid+'"]'),
			type = model.type,
			marketSimulator = this;

		var currentTime = new Date().getTime();

		if (model.type === 'spread') {

			var highDisplay = $(view.find('.instrument-panel-rate.highlow-high')),
			lowDisplay = $(view.find('.instrument-panel-rate.highlow-low'));

			highDisplay.html(" "+parseFloat(model.upperRate).toFixed(marketSimulator.rounding));

			lowDisplay.html(" "+parseFloat(model.lowerRate).toFixed(marketSimulator.rounding));

		} else {
			var rateDisplay = $(view.find('.instrument-panel-rate'));
			rateDisplay.html(" "+parseFloat(model.currentRate).toFixed(marketSimulator.rounding));
			if (model.currentRate>model.previousRate) {
				rateDisplay.removeClass('highlow-low').addClass('highlow-high');
			} else if(model.currentRate<model.previousRate) {
				rateDisplay.removeClass('highlow-high').addClass('highlow-low');
			}
		}


	},
	updateRemainingTime : function (model) {
		if(model.type.indexOf('on-demand') < 0) {
			var view = $('[data-uid="'+model.uid+'"]'),
			remainingTimeDisplay = $(view.find('.expiry-time')),
			currentTime = new Date().getTime(),
			remainingTimeText = "",
			mainViewId  = model.getMainViewId();



			remainingTime = model.expireAt - currentTime;

			// remainingHour = (remainingTime - remainingTime%(60*60*1000)) / (60*60*1000);

			// remainingMinute = ((remainingTime - remainingHour*(60*60*1000)) - (remainingTime - remainingHour*(60*60*1000))%60000) / 60000;

			// remainingSecond = Math.floor((remainingTime%60000) / 1000);

			// if(remainingSecond<0 & remainingMinute==0 & remainingHour == 0) {
			// 	remainingTimeText = ' expired';
			// 	model.expired = true;
			// } else if(remainingHour > 0) {
			// 	remainingTimeText = " "+(remainingHour<10?"0"+remainingHour:remainingHour)+":"+(remainingMinute<10?"0"+remainingMinute:remainingMinute);
			// } else {
			// 	remainingTimeText = " "+(remainingMinute<10?"0"+remainingMinute:remainingMinute)+":"+(remainingSecond<10?"0"+remainingSecond:remainingSecond);
			// }

			remainingTimeText = highlowApp.durationToText(remainingTime);

			if(remainingTime<=0) {
				model.expired = true;
			}

			if(model.active) {
				
				$('#' + mainViewId + ' .trading-platform-instrument-time-left').html(" " + remainingTimeText);

			}

			// remainingTimeDisplay.html(remainingTimeText);
		} else {
			// only update for focused bet
			if(model.focusedBet!=undefined) {


				// console.log('update on graph label for on-demand type');

				

				// console.log('updating');

				var message = "EXPIRY: ",
					remainingTimeText = "";

				var currentTime = new Date().getTime();

				var timeLeft = new Date(model.focusedBet.expireAt - currentTime);

				var minute = timeLeft.getMinutes(),
					second = timeLeft.getSeconds();

				if(minute>0) {
					message += minute>9?minute:("0"+minute);

					remainingTimeText += minute>9?minute:("0"+minute)+":";

					message += minute>1?" MINS ":" MIN ";
				} else {
					remainingTimeText += "0:";
				}

				if(second>0 || minute>0) {
					message += second>9?second:("0"+second);

					remainingTimeText += second>9?second:("0"+second);

					message += second>1?" SECS ":" SEC ";
				}

				if(currentTime > model.focusedBet.expireAt) {
					message = "EXPIRED";
					remainingTimeText = "expired";
				}

				
				if(model.focusedBet.finishText!=undefined) {
					model.focusedBet.finishText.attr({
						text: message
					});
				}



				// update text for the countdown on top right of the main view below instruments slider

				if(model.active) {
				
					mainViewId  = model.getMainViewId();

					$('#' + mainViewId + ' .trading-platform-instrument-time-left').html(" " + remainingTimeText);

				}

			}
		}
	},
	init: function() {
		var marketSimulator = this;
		// iterate through every instrument panel in the UI.

		$('.js-instrument-panel-original').each(function(){
			var instrumentModel = {},
			self = $(this);

			//get seed data from html markup

			var currentTime = new Date().getTime();

			instrumentModel.label = self.data('instrumentLabel');
			instrumentModel.type = self.data('tradingType');
			instrumentModel.durationLabel = self.data('instrumentDuration');
			instrumentModel.durationId = self.data('instrumentDurationId');
			instrumentModel.duration = self.data('instrumentDurationValue');
			instrumentModel.seedRate = self.data('instrumentSeedRate');
			instrumentModel.payoutRate = self.data('instrumentPayoutRate');
			instrumentModel.currentRate = parseFloat(instrumentModel.seedRate).toFixed(marketSimulator.rounding);
			instrumentModel.previousrate = instrumentModel.currentRate;
			instrumentModel.bets = [];
			instrumentModel.uid = self.data('uid');

			// Now let's assume that the open time is 5 minutes ago (round to closest minute), 
			// except for on-demand type, which doesn't have a fixed open time

			if(instrumentModel.type.indexOf('on-demand') < 0) {
				instrumentModel.openAt = (Math.round(currentTime / (1000 * 60 * 5))-1) * 1000 * 60 * 5;
				instrumentModel.expireAt = instrumentModel.openAt+instrumentModel.duration;
			}


		// Generate past data.

			instrumentModel.startingPoint = currentTime - (15*60*1000);
			instrumentModel.absoluteChange = 0;
			instrumentModel.data = [];

			// seed highlow data array with a value


			instrumentModel.data.push({
				x :	instrumentModel.startingPoint,
				y : instrumentModel.seedRate
			});

			// generate mock data from starting from 10 minutes ago
			// assuming updates every 1 - 2 seconds

			for (var i = instrumentModel.startingPoint + 1000,j = 1; i < currentTime; i+=highlowApp.randomValue(1000, 5000), j++) {



				// 50% of going up or down by 0 to 0.003;

				var deviation = highlowApp.randomValue(0,marketSimulator.maxChange,4);



				// if the market has been moving up, there's more chance it's gonna go down this time

				var splitChance = 0.5;

				if(instrumentModel.absoluteChange>0) {
					splitChance+=0.1;
				} else if(instrumentModel.absoluteChange<0) {
					splitChance-=0.1;
				}

				if(instrumentModel.absoluteChange>0.002) {
					splitChance+=0.3;
				} else if(instrumentModel.absoluteChange<-0.002) {
					splitChance-=0.3;
				}

				

				var variation = Math.random() >= splitChance ? deviation : -deviation;

				instrumentModel.absoluteChange += parseFloat(variation);


				// next value calculated from variation deinfed above and previous value

				var point = { 
					x : i ,
					y : instrumentModel.data[j-1]['y'] + variation
				};

				instrumentModel.data.push(point);

				instrumentModel.previousRate = instrumentModel.currentRate;
				instrumentModel.currentRate = point.y;
			}

			if (instrumentModel.type === 'spread') {
				instrumentModel.upperRate = parseFloat(instrumentModel.currentRate + marketSimulator.spread).toFixed(marketSimulator.rounding);
				instrumentModel.lowerRate = parseFloat(instrumentModel.currentRate - marketSimulator.spread).toFixed(marketSimulator.rounding);
			}

			instrumentModel.getMainViewId = function() {
				return instrumentModel.type+"-main-view";
			}

			instrumentModel.updateMainView = function() {
				var model = instrumentModel;
				var mainViewId  = model.getMainViewId();

				$('#'+mainViewId).data(marketSimulator.modelDataName,instrumentModel);

				


				$('#'+mainViewId+" .trading-platform-instrument-duration").html(" " + model.durationLabel);

				$('#'+mainViewId+" .trading-platform-instrument-closing-time").html(" "+ highlowApp.timeToText(model.expireAt));

				$('#'+model.type+"-mode .trading-platform-main-controls-payout-rate").html(model.payoutRate);

				$('#'+mainViewId+" .trading-platform-instrument-title, "+
					"#"+model.type+"-mode .trading-platform-main-controls-instrument-title, "+
					'.trading-platform-invest-popup.'+model.type+' .trading-platform-main-controls-instrument-title').html(" " + model.label);


				$('#'+mainViewId+" .trading-platform-maximum-return").html("$ "+parseFloat(model.payoutRate*$('#'+model.type+'-investment-value-input').val()).toFixed(2));

				if(model.active) {
					var mainViewRateDisplay = $('#' + model.getMainViewId() + ' .current-rate'),
					popupRateDisplay = $('.trading-platform-invest-popup.'+model.type+' .current-rate'),
					sellPopupRateDisplay = $('.trading-platform-sell-popup.'+model.type+' .current-rate');
					


					if (model.currentRate>model.previousRate) {
						mainViewRateDisplay.removeClass('highlow-low').addClass('highlow-high');
						popupRateDisplay.removeClass('highlow-low').addClass('highlow-high');
						sellPopupRateDisplay.removeClass('highlow-low').addClass('highlow-high');
					} else if(model.currentRate<model.previousRate) {
						mainViewRateDisplay.removeClass('highlow-high').addClass('highlow-low');
						popupRateDisplay.removeClass('highlow-high').addClass('highlow-low');
						sellPopupRateDisplay.removeClass('highlow-high').addClass('highlow-low');
					}

					mainViewRateDisplay.html(" " + parseFloat(model.currentRate).toFixed(marketSimulator.rounding));
					popupRateDisplay.html(" " + parseFloat(model.currentRate).toFixed(marketSimulator.rounding));
					sellPopupRateDisplay.html(" " + parseFloat(model.currentRate).toFixed(marketSimulator.rounding));
				}
			}

			instrumentModel.update = function(){
				var self = instrumentModel;
				marketSimulator.simulate(self);
				if(self.active) {
					self.updateMainView();
				}
				if(instrumentModel.expired) {

					if(instrumentModel.type.indexOf('on-demand') < 0) {
						instrumentModel.openAt = (Math.round(currentTime / (1000 * 60 * 5))-1) * 1000 * 60 * 5;
						instrumentModel.expireAt = instrumentModel.openAt+instrumentModel.duration;
					}
				} 
				setTimeout(self.update,Math.floor(highlowApp.randomValue(marketSimulator.minInterval, marketSimulator.maxInterval)));
			}

			instrumentModel.updateTime = function() {
				var self = instrumentModel;

				marketSimulator.updateRemainingTime(self);

				if(instrumentModel.expired) {
					return;
				} 
				setTimeout(self.updateTime,1000);
			}

			//attach the model to the UI

			$('[data-uid="'+self.data('uid')+'"]').data(marketSimulator.modelDataName,instrumentModel);

			// update closing time to instrument panel

			$('[data-uid="'+self.data('uid')+'"] .closing-at').html(highlowApp.timeToText(instrumentModel.expireAt));

			marketSimulator.instruments.push(instrumentModel);
		});

		marketSimulator.start();
	}
}