highlowApp.currentInstrument = {};

highlowApp.instrumentPanelSelector = {
	init: function() {
		var self = this;
		// handle instrument selector click

		$('.instrument-panel').click(function(e){
			var target = $(e.target);
			$(target.closest('.page-container').find('.instrument-panel-active')).removeClass('instrument-panel-active');
			$(this).addClass('instrument-panel-active');
			$('.instrument-panel-active');
			self.selectInstrument($(this));
		});

		// select default instruments when land on app

		$('.instrument-selector-widget-instruments-container .tab-view-panel.active .instrument-panel-active').each(function(){
			self.selectInstrument($(this));
		});

	},
	selectInstrument: function (e) {


		var label = e.data('instrumentLabel'),
			duration = e.data('instrumentDuration'),
			type = e.data('tradingType'),
			model = e.data('instrumentModel');

		// update active instrument here.

		$('.main-view .panel-header .loading-icon').css({
			opacity: 0,
			display: 'inline-block'
		}).animate({
			opacity: 1
		},125);

		setTimeout(function(){
			if(model) {

				if (highlowApp.currentInstrument[type]!=undefined) {
					highlowApp.currentInstrument[type].active = false;
				}

				model.active = true;

				highlowApp.currentInstrument[type] = model;


				model.updateMainView();

				// change graph to display this instrument data

				/* display graph loading screen */

				/* end display graph loading screen */
				
				highlowApp.graph.loadInstrument(model);
			}


			$('.main-view .panel-header .loading-icon').animate({
				opacity: 0
			},125, function(){
				$('.main-view .panel-header .loading-icon').css({
					display: 'none'
				});
			});


		},1000);

	}
}