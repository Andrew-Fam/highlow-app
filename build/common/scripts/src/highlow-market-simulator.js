highlowApp.marketSimulator = {
	instruments : [],
	spread: 0.005,
	rounding: 3,
	minInterval: 1000,
	maxInterval: 1500,
	maxChange: 0.0006,
	modelDataName: 'instrumentModel',
	start: function() {
		var self = this;
		for (var i = 0; i < this.instruments.length; i++) {
			var instrument  = this.instruments[i];
			instrument.update();
			instrument.updateTime();
		}
	},
	pause: function(instrument) {
		instrument.pause = true;
		var currentTime = new Date().getTime();
		instrument.lastPause = currentTime;
	},
	resume: function(instrument) {

		var currentTime = new Date().getTime();
		instrument.pauseOffset += currentTime - instrument.lastPause;
		instrument.pause = false;
		instrument.update();
		instrument.updateTime();
	},
	reset: function(instrument,minutesIntoGame) {
		instrument.pause = true;
		instrument.bets = [];
		highlowApp.marketSimulator.initInstrument(instrument,minutesIntoGame);
		highlowApp.graph.loadInstrument(instrument);
		highlowApp.betSystem.reset();

		instrument.pause = false;
	},
	skip: function(instrument,duration,difference,update) {
		var self = this;

		var lastPoint = instrument.data[instrument.data.length-1];

		instrument.skipOffset+=duration;


		instrument.previousRate = parseFloat(instrument.currentRate);
		instrument.currentRate = parseFloat(instrument.currentRate + difference);

		instrument.absoluteChange += parseFloat(difference);

		if (instrument.type.indexOf('spread')>=0) {
			instrument.upperRate = parseFloat(parseFloat(instrument.currentRate) + self.spread);
			instrument.lowerRate = parseFloat(parseFloat(instrument.currentRate) - self.spread);
		}

		if(instrument.active) {
			// update graph
			highlowApp
			.graph
			.addPoint(
				instrument,
				{
	  				x : lastPoint.x+duration,
	  				y : lastPoint.y+difference,
	  				// marker : {
	  				// 	enabled : true,
	  				// 	symbol : "url(common/images/graph-marker.png)"
	  				// },
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
			x : lastPoint.x+duration,
	  		y : lastPoint.y+difference,
			marker : {
				enabled: false
			}
		});

		if(update) {
			self.updateUI(instrument.uid,instrument);
			self.updateBetStatus(instrument);
		}
	},
	skipSequence: function(sequence,instrument,delay,callback) {
		
		var self = this;

		var sequenceTimeout = {};

		var runSequence = function(i) {

			var item = sequence[i];

			self.skip(instrument,item[0],item[1],false);
			
			if(item[2]!=undefined) {
				highlowApp.betSystem.placeBet(item[2],instrument.type);
			}
			
		}

		for (var i=0; i<sequence.length; i++) {
			runSequence(i);
		}


		self.updateUI(instrument.uid,instrument);
		self.updateBetStatus(instrument);
	
		callback();
	},
	simulate: function(instrument) {
		var self = this;
	
		var deviation = highlowApp.randomValue(0,self.maxChange,5);

		// if the market has been moving up, there's more chance it's gonna go down this time

		var splitChance = 0.5;

		if(instrument.absoluteChange>0) {
			splitChance+=0.1;
		} else if(instrument.absoluteChange<0) {
			splitChance-=0.1;
		}

		if(instrument.absoluteChange>0.002) {
			splitChance+=0.3;
		} else if(instrument.absoluteChange<-0.002) {
			splitChance-=0.3;
		}

		// console.log(splitChance);

		var variation = Math.random() >= splitChance ? deviation : -deviation;

		instrument.previousRate = parseFloat(instrument.currentRate);
		instrument.currentRate = parseFloat(instrument.currentRate + variation);

		instrument.absoluteChange += parseFloat(variation);

		if (instrument.type.indexOf('spread')>=0) {
			instrument.upperRate = parseFloat(parseFloat(instrument.currentRate) + self.spread);
			instrument.lowerRate = parseFloat(parseFloat(instrument.currentRate) - self.spread);
		}

		var currentTime = new Date().getTime();


		// test if instrument has gone into deadzone or not (only applicable to none on-demand types)


		var offsetCurrentTime = currentTime-instrument.pauseOffset+instrument.skipOffset;

		if (instrument.type.indexOf('on-demand')<0 && instrument.type.indexOf('turbo')<0) {

			if(offsetCurrentTime>=instrument.expireAt-2*60*1000) {
				instrument.dead = true;
			}

		}

		if(instrument.active) {
			// update graph
			highlowApp
			.graph
			.addPoint(
				instrument,
				{
	  				x : offsetCurrentTime,
	  				y : parseFloat(instrument.currentRate.toFixed(instrument.pip)),
	  				// marker : {
	  				// 	enabled : true,
	  				// 	symbol : "url(common/images/graph-marker.png)"
	  				// },
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
			x: offsetCurrentTime,
			y: parseFloat(instrument.currentRate.toFixed(instrument.pip)),
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
				rate = parseFloat(model.currentRate).toFixed(model.pip),
				point = bet.point,
				winning = false,
				tie = false,
				strike = parseFloat(bet.strike).toFixed(model.pip),
				expired = false,
				nonActive = false;

			if(bet.expireAt!=undefined) {
				if (bet.expireAt < currentTime && !bet.expired) {
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


				var markerValueLabel = bet.markerValueLabel;

				var markerValueText = bet.markerValueText;

				var labelHighX = pointX+28,
				labelHighY = pointY-48,
				labelLowX = pointX+28,
				labelLowY = pointY+40,
				textHighX = labelHighX+21,
				textHighY = labelHighY+12,
				textLowX = labelLowX+21,
				textLowY = labelLowY+12;


				switch(bet.direction) {
					case 'high': {
						marker.attr({
							x : point.plotX+39,
							y : point.plotY-22
						});

						markerValueLabel.attr({
							x : labelHighX,
							y : labelHighY
						});

						markerValueText.attr({
							x : textHighX,
							y : textHighY
						});

						break;
					};
					case 'low': {
						marker.attr({
							x : point.plotX+39,
							y : point.plotY+5
						});

						markerValueLabel.attr({
							x : labelLowX,
							y : labelLowY
						});

						markerValueText.attr({
							x : textLowX,
							y : textLowY
						});


						break;
					}
				}

				var img = $($(marker.div).find('img'));



				// only update marker image if the bet is not expired yet

				if(!bet.expired) {

					switch(bet.direction) {
						case 'high' : {
							if (rate > strike) { // winning
								img.attr({
									'src':"common/images/high-win.png",
									'zIndex' : 10
								});
								
								winning = true;

							} else if (rate <= strike) { // losing
								img.attr({
									'src':"common/images/high-lose.png",
									'zIndex' : 11
								});
							} 
							// else { // tie
							// 	marker.attr({
							// 		'href':"common/images/high-level"+(nonActive?'-expired':"")+".png",
							// 		'zIndex' : 10
							// 	});

							// 	tie = true;
							// }
							break;
						}
						case 'low' : {
							if (rate >= strike) { //losing
								img.attr({
									'src':"common/images/low-lose.png",
									'zIndex' : 10
								});
							} else if (rate < strike) { //winning
								img.attr({
									'src':"common/images/low-win.png",
									'zIndex' : 11
								});

								
								winning = true;
							} 
							// else { // tie
							// 	marker.attr({
							// 		'href':"common/images/low-level"+(nonActive?'-expired':"")+".png",
							// 		'zIndex' : 10
							// 	});

							// 	tie = true;
							// }
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


				if(model.type.indexOf('on-demand')>=0 || model.type.indexOf('turbo')>=0) {
					

					var plotBandId = model.type+"-plot-band-"+model.uid+"-"+i;
					var startLineId = model.type+"-start-plot-line-"+model.uid+"-"+i;
					var endLineId = model.type+"-end-plot-line-"+model.uid+"-"+i;
					var finishTextId = model.type+"-finish-text-"+model.uid+"_"+i;
					var finishLabelId = model.type+"-finish-label-"+model.uid+"_"+i;


					bet.plotBandId = plotBandId,
					bet.startLineId = startLineId,
					bet.endLineId = endLineId,
					bet.finishTextId = finishTextId,
					bet.finishLabelId = finishLabelId;

					xAxis.removePlotBand(plotBandId);
					xAxis.removePlotLine(startLineId);
					xAxis.removePlotLine(endLineId);
				

					if((bet.focused || bet.hover) && !bet.expired) {

						var x = point.plotX;

						var textX = xAxis.toPixels(bet.expireAt)-91,
							textY = 9,
							arrowX = xAxis.toPixels(bet.expireAt)-7,
							arrowY = 14;


						if(highlowApp.jap) {
							textX = textX-64;
						} else {

						}


						var textAttribute = {};
						
						textAttribute = {
							id: bet.finishTextId,
							'text-anchor': 'end'
						};
						

						if(bet.focused && !bet.hover && model.hoveredBet) {
							
							xAxis.addPlotLine({
								color: 'rgba(255,255,255,0.34)',
								value:  bet.betAt, 
								width: 1,
								zIndex: 4,
								id: startLineId
							});

							xAxis.addPlotLine({
								color: 'rgba(255,255,255,0.34)',
								value:  bet.expireAt,
								width: 1,
								zIndex: 4,
								id: endLineId
							});

							textAttribute.zIndex = '6';
							

						} else {


							switch(bet.direction) {
								case 'high' : {
									if (rate > strike) { // winning

										xAxis.addPlotBand({
											color: 'rgba(143,195,60,0.45)',
											from: bet.betAt, 
											to: bet.expireAt,
											zIndex: 1,
											id: plotBandId
										});

									} else if (rate <= strike) { // losing
										
										xAxis.addPlotBand({
											color: 'rgba(20,20,20,0.3)',
											from: bet.betAt, 
											to: bet.expireAt,
											zIndex: 1,
											id: plotBandId
										});	

									} 
									
									break;
								}
								case 'low' : {
									if (rate >= strike) { //losing
										
										xAxis.addPlotBand({
											color: 'rgba(20,20,20,0.3)',
											from: bet.betAt, 
											to: bet.expireAt,
											zIndex: 1,
											id: plotBandId
										});

									} else if (rate < strike) { //winning
										
										xAxis.addPlotBand({
											color: 'rgba(229,79,55,0.3)',
											from: bet.betAt, 
											to: bet.expireAt,
											zIndex: 1,
											id: plotBandId
										});

									} 
									
									break;
								}
								default : break;
							}

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
								zIndex: 4,
								id: endLineId
							});

							if(bet.hover && !bet.focused) {
								textAttribute.zIndex = '15';
							} else {
								textAttribute.zIndex = '4';
							}

							$($(bet.markerValueText.element).parent()).append(bet.markerValueText.element);

							$($(marker.element).parent()).append(marker.element);

							marker.attr({
								zIndex: 14
							});
						}


						if(bet.finishText==undefined) {

							if(highlowApp.jap) {
								text = renderer.label('<span>お待ちください</span>',textX,textY,null,null,null,true,null,'expiry-timer-rate');

							} else {
								text = renderer.label('<span>loading...</span>',textX,textY,null,null,null,true,null,'expiry-timer-rate');
							}

							text.attr(textAttribute);

							text.add();

							bet.finishText = text;



							// expiry time arrow

							var arrowImgPath = 'common/images/expiry-timer-arrow.png';

							arrow = renderer.label(
								'<img src="'+arrowImgPath+'"/>',
								arrowX,
								arrowY,
								null,
								null,
								null,
								true
							);

							arrow.add();

							bet.finishLineArrow = arrow;



						} else {

							bet.finishText.attr({
								x: textX
							});

							bet.finishLineArrow.attr({
								x: arrowX
							});

						}

						if(bet.focused && !bet.hover && model.hoveredBet) {
							if(bet.finishText!=undefined) {
								bet.finishText.destroy();
								bet.finishText = undefined;
								bet.finishLineArrow.destroy();
								bet.finishLineArrow = undefined;
							}

							$(bet.marker.div).css({
								opacity: '0.75'
							});

						} else {

							$(bet.marker.div).css({
								opacity: '1'
							});
						
						}

					} else {

						if(bet.finishText!=undefined) {
							bet.finishText.destroy();
							bet.finishText = undefined;
							bet.finishLineArrow.destroy();
							bet.finishLineArrow = undefined;
						}

						$(bet.marker.div).css({
							opacity: '0.75'
						});
					}

				}

				var svgParent = $($(bet.markerValueLabel.element).parent());

				$(bet.markerValueLabel.element).remove();
				$(bet.markerValueText.element).remove();

				svgParent.append(bet.markerValueLabel.element);
				svgParent.append(bet.markerValueText.element);
				

				
				
				// calculate fake payout rate to display on sell popup (I just made this up, it's not the real algorithm, just to simulate changing rate)
				bet.payoutRateModifier = bet.direction=="high"?-1:1;

				var difference = (parseFloat(bet.model.currentRate).toFixed(bet.model.pip) - parseFloat(bet.strike).toFixed(bet.model.pip));

				var basePayoutRate = 0.500;

				var maxPayoutRate = bet.model.payoutRate;

				var payoutRateMultiplier = 75;

				var payoutRateAdjustment = (maxPayoutRate - basePayoutRate) * 1/(1-1/(difference * bet.payoutRateModifier * payoutRateMultiplier));


				bet.payoutRate = parseFloat(basePayoutRate+payoutRateAdjustment).toFixed(bet.model.pip);

				bet.payout = bet.amount*bet.payoutRate;

				$('.trading-platform-return-rate-value.'+bet.type).html(bet.payoutRate);

				$('.trading-platform-sell-popup.'+bet.type+' .trading-platform-pay-out-value').html((highlowApp.jap?'¥':'$')+highlowApp.getDisplayMoney(parseFloat(bet.payout).toFixed(2)));

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

		if (model.type.indexOf('spread')>=0) {

			var highDisplay = $(view.find('.instrument-panel-rate.highlow-high')),
			lowDisplay = $(view.find('.instrument-panel-rate.highlow-low')),
			spreadHighDisplay = $('.spread-high'),
			spreadLowDisplay = $('.spread-low');

			highDisplay.html(" "+parseFloat(model.upperRate).toFixed(model.pip));
			lowDisplay.html(" "+parseFloat(model.lowerRate).toFixed(model.pip));

			if(model.active) {
				spreadHighDisplay.html(" "+parseFloat(model.upperRate).toFixed(model.pip));
				spreadLowDisplay.html(" "+parseFloat(model.lowerRate).toFixed(model.pip));
			}

			

		} else {
			var rateDisplay = $(view.find('.instrument-panel-rate'));
			rateDisplay.html(" "+parseFloat(model.currentRate).toFixed(model.pip));
			if (model.currentRate>model.previousRate) {
				rateDisplay.removeClass('highlow-low').addClass('highlow-high');
			} else if(model.currentRate<model.previousRate) {
				rateDisplay.removeClass('highlow-high').addClass('highlow-low');
			}
		}


	},
	updateRemainingTime : function (model) {
		if(model.type.indexOf('on-demand') < 0 && model.type.indexOf('turbo') < 0) {
			var view = $('[data-uid="'+model.uid+'"]'),
			remainingTimeDisplay = $(view.find('.expiry-time')),
			currentTime = new Date().getTime(),
			remainingTimeText = "",
			mainViewId  = model.getMainViewId();



			remainingTime = model.expireAt - currentTime;

			remainingTimeText = highlowApp.durationToText(remainingTime);

			if(remainingTime<=0) {
				model.expired = true;
			}

			if(model.active) {
				
				$('#' + mainViewId + ' .trading-platform-instrument-time-left').html(" " + remainingTimeText);

				var remainingTimeObject = new Date(remainingTime);

				var minutes = remainingTimeObject.getMinutes();
				var seconds = remainingTimeObject.getSeconds();


				if(highlowApp.jap) {
					$('.walk-through-instrument-time-left.'+ mainViewId).html(minutes+"分と"+seconds+"秒");
				} else if (highlowApp.cn) {
					console.log("what what what chinese");
					$('.walk-through-instrument-time-left.'+ mainViewId).html(minutes+"分"+seconds+"秒");
				} else  {
					console.log("what what what eng");
					$('.walk-through-instrument-time-left.'+ mainViewId).html(minutes+" min"+(minutes>1?'s':'')+ " and "+seconds+" second"+(seconds>1?'s':''));
				}

				
			}

			// remainingTimeDisplay.html(remainingTimeText);
		} else {


			this.updateOnDemandBet = function(bet, updateMainView) {
				var message = "",
				remainingTimeText = "";

				var currentTime = new Date().getTime();

				var timeLeft = new Date(bet.expireAt - currentTime);

				var minute = timeLeft.getMinutes(),
					second = timeLeft.getSeconds();

				if(minute>0) {
					message += minute>9?minute:("0"+minute);

					message += ":";

					remainingTimeText += minute>9?minute:("0"+minute)+":";

					// message += minute>1?" MINS ":" MIN ";
				} else {
					remainingTimeText += "0:";

					message += "0:";
				}

				if(second>0 || minute>0) {
					message += second>9?second:("0"+second);

					remainingTimeText += second>9?second:("0"+second);

					// message += second>1?" SECS ":" SEC ";
				}

				if(currentTime >= bet.expireAt || (second<=0 && minute <=0)) {
					message = "EXPIRED";
					remainingTimeText = "expired";
				}

				
				// if(highlowApp.jap) {
				// 	message = message.replace('EXPIRY: ','判<br/>定<br/>時<br/>刻<br/>：<br/>').replace(' MINS ','<br/>分<br/>').replace(' MIN ','<br/>分<br/>').replace(' SECS ','<br/>秒<br/>').replace(' SEC ','<br/>秒<br/>');
				// }

				var expiryTimeInChartIconPath = 'common/images/expiry-timer-icon.png';

				message = '<img src="'+expiryTimeInChartIconPath+'"/><span>'+message+"</span>";


				if(bet.finishText!=undefined) {
					bet.finishText.attr({
						text: message
					});
				}



				if(model.active && updateMainView) {

					mainViewId  = model.getMainViewId();

					$('#' + mainViewId + ' .trading-platform-instrument-time-left').html(" " + remainingTimeText);

				}
			}

			// only update for focused bet and hovered bet
			if(model.focusedBet) {
				this.updateOnDemandBet(model.focusedBet, true);
			}

			if(model.hoveredBet) {
				this.updateOnDemandBet(model.hoveredBet);
			}
		}
	},
	initInstrument: function(instrumentModel,minutesIntoGame) {

		var currentTime = new Date().getTime();

		var marketSimulator = this;

		//get seed data from html markup
		instrumentModel.pauseOffset = 0;
		instrumentModel.skipOffset = 0;
		instrumentModel.label = instrumentModel.domElement.data('instrumentLabel');
		instrumentModel.type = instrumentModel.domElement.data('tradingType');
		instrumentModel.durationLabel = instrumentModel.domElement.data('instrumentDuration');
		instrumentModel.durationId = instrumentModel.domElement.data('instrumentDurationId');
		instrumentModel.duration = instrumentModel.domElement.data('instrumentDurationValue');
		instrumentModel.seedRate = instrumentModel.domElement.data('instrumentSeedRate');
		instrumentModel.payoutRate = instrumentModel.domElement.data('instrumentPayoutRate');
		instrumentModel.pip = instrumentModel.domElement.data('instrumentPip') || 3;
		instrumentModel.currentRate = parseFloat(instrumentModel.seedRate).toFixed(instrumentModel.pip);
		instrumentModel.previousrate = instrumentModel.currentRate;
		instrumentModel.bets = [];
		instrumentModel.uid = instrumentModel.domElement.data('uid');

		if(instrumentModel.pip==5) {
			console.log(instrumentModel);
		}

		// Now let's assume that the open time is 5 minutes ago (round to closest minute), or 14 minute ago when there is 'deadzone' in the url query for testing purpose
		// except for on-demand type, which doesn't have a fixed open time

		if(instrumentModel.type.indexOf('on-demand') < 0 && instrumentModel.type.indexOf('turbo') < 0) {

			if(highlowApp.expiring()) {
				instrumentModel.openAt = currentTime - 1000*60*13;
			} else {
				if(minutesIntoGame!=undefined) {
					instrumentModel.openAt = currentTime - 1000*60*minutesIntoGame;
				} else {
					instrumentModel.openAt = (Math.floor(currentTime / (1000 * 60 * 5))) * 1000 * 60 * 5;
				}
			}

			instrumentModel.expireAt = instrumentModel.openAt+instrumentModel.duration;

			if(instrumentModel.duration == 15*60*1000) {
				instrumentModel.deadzone = instrumentModel.expireAt - 2 * 60 * 1000;
			} else if(instrumentModel.duration == 60*60*1000) {
				instrumentModel.deadzone = instrumentModel.expireAt - 5 * 60 * 1000;
			} else if(instrumentModel.duration == 24*60*60*1000) {
				instrumentModel.deadzone = instrumentModel.expireAt - 15 * 60 * 1000;
			}

			
		}

		// Generate past data.

		var startingPointFromNow = (20*60*1000),
		minInterval = 1000,
		maxInterval = 5000;

		if(instrumentModel.duration>15*60*1000) {
			startingPointFromNow = 60*60*1000,
			minInterval = 10000,
			maxInterval = 50000;
		}

		if(instrumentModel.duration>60*60*1000) {
			startingPointFromNow = 4*60*60*1000
			minInterval = 40000,
			maxInterval = 200000;
		}

		instrumentModel.startingPoint = currentTime - startingPointFromNow;
		instrumentModel.absoluteChange = 0;
		instrumentModel.data = [];

		// seed highlow data array with a value

		instrumentModel.data.push({
			x :	parseFloat(instrumentModel.startingPoint),
			y : parseFloat(instrumentModel.seedRate)
		});

		// generate mock data from starting from 20 minutes ago
		// assuming updates every 1 - 2 seconds

		for (var i = instrumentModel.startingPoint,j = 1; i < currentTime; i+=highlowApp.randomValue(minInterval, maxInterval), j++) {

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
				x : parseFloat(i) ,
				y : parseFloat(instrumentModel.data[j-1]['y'] + variation)
			};

			instrumentModel.data.push(point);

			instrumentModel.previousRate = instrumentModel.currentRate;
			instrumentModel.currentRate = point.y;
		}

		instrumentModel.beforeSimulationStrike = instrumentModel.currentRate;

		if (instrumentModel.type === 'spread') {
			instrumentModel.upperRate = parseFloat(instrumentModel.currentRate + marketSimulator.spread).toFixed(instrumentModel.pip);
			instrumentModel.lowerRate = parseFloat(instrumentModel.currentRate - marketSimulator.spread).toFixed(instrumentModel.pip);
		}

		instrumentModel.getMainViewId = function() {
			return instrumentModel.type+"-main-view";
		}

		instrumentModel.updateMainView = function() {
			var model = instrumentModel;
			var mainViewId  = model.getMainViewId();

			$('#'+mainViewId).data(marketSimulator.modelDataName,instrumentModel);

			$('#'+mainViewId+" .trading-platform-instrument-duration").html(" " + model.durationLabel);

			$('#'+model.type+"-mode .trading-platform-main-controls-payout-rate").html(model.payoutRate);

			$('#'+mainViewId+" .trading-platform-instrument-title, "+
				"#"+model.type+"-mode .trading-platform-main-controls-instrument-title, "+
				'.trading-platform-invest-popup.'+model.type+' .trading-platform-main-controls-instrument-title').html(" " + model.label);

			$('#'+mainViewId+" .trading-platform-maximum-return").html((highlowApp.jap?'¥':'$')+highlowApp.getDisplayMoney(parseFloat(model.payoutRate*$('#'+model.type+'-investment-value-input').val()).toFixed(2)));

			if(model.active) {

				if(model.dead) {
					$('#' + model.getMainViewId()).addClass('dead');
				} else {
					$('#' + model.getMainViewId()).removeClass('dead');
				}

				var mainViewRateDisplay = $('#' + model.getMainViewId() + ' .current-rate'),
				popupRateDisplay = $('.trading-platform-invest-popup.'+model.type+' .current-rate'),
				sellPopupRateDisplay = $('.trading-platform-sell-popup.'+model.type+' .current-rate');
				
				if(model.type.indexOf('on-demand')<0 && model.type.indexOf('turbo')<0) {
					$('#'+mainViewId+" .trading-platform-instrument-closing-time, .walkthrough-instrument-closing-time."+mainViewId).html(" "+ highlowApp.timeToText(model.expireAt));
				} else {
					if(model.focusedBet) {
						$('#'+mainViewId+" .trading-platform-instrument-closing-time, .walkthrough-instrument-closing-time."+mainViewId).html(" "+ highlowApp.timeToText(model.focusedBet.expireAt));
					}
				}

				if (model.currentRate>model.previousRate) {
					mainViewRateDisplay.removeClass('highlow-low').addClass('highlow-high');
					popupRateDisplay.removeClass('highlow-low').addClass('highlow-high');
					sellPopupRateDisplay.removeClass('highlow-low').addClass('highlow-high');
				} else if(model.currentRate<model.previousRate) {
					mainViewRateDisplay.removeClass('highlow-high').addClass('highlow-low');
					popupRateDisplay.removeClass('highlow-high').addClass('highlow-low');
					sellPopupRateDisplay.removeClass('highlow-high').addClass('highlow-low');
				}

				mainViewRateDisplay.html(" " + parseFloat(model.currentRate).toFixed(model.pip));
				popupRateDisplay.html(" " + parseFloat(model.currentRate).toFixed(model.pip));
				sellPopupRateDisplay.html(" " + parseFloat(model.currentRate).toFixed(model.pip));
			}
		}

		instrumentModel.update = function(){
			var self = instrumentModel;
			if(!instrumentModel.pause) {
				
				marketSimulator.simulate(self);
				if(self.active) {
					self.updateMainView();
				}
				if(instrumentModel.expired) {

					if(instrumentModel.type.indexOf('on-demand') < 0 && instrumentModel.type.indexOf('turbo') < 0) {
						instrumentModel.openAt = (Math.round(currentTime / (1000 * 60 * 5))-1) * 1000 * 60 * 5;
						instrumentModel.expireAt = instrumentModel.openAt+instrumentModel.duration;
					}
				} 
				setTimeout(self.update,Math.floor(highlowApp.randomValue(marketSimulator.minInterval, marketSimulator.maxInterval)));
			}
			
		}

		instrumentModel.updateTime = function() {
			var self = instrumentModel;
			if(!instrumentModel.pause) {
				

				marketSimulator.updateRemainingTime(self);

				if(instrumentModel.expired) {
					return;	
				}
				setTimeout(self.updateTime,1000);
			}
		}

		//attach the model to the UI

		$('[data-uid="'+instrumentModel.domElement.data('uid')+'"]').data(marketSimulator.modelDataName,instrumentModel);

		// update closing time to instrument panel

		$('[data-uid="'+instrumentModel.domElement.data('uid')+'"] .closing-at').html(highlowApp.timeToText(instrumentModel.expireAt));
	},
	init: function() {
		var marketSimulator = this;
		// iterate through every instrument panel in the UI.

		$('.js-instrument-panel-original').each(function(){
			var instrumentModel = {},
			self = $(this);

			


			instrumentModel.domElement = self;

			marketSimulator.initInstrument(instrumentModel);

			marketSimulator.instruments.push(instrumentModel);
		});

		marketSimulator.start();
	}
}