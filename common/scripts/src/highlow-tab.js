highlowApp.tab = {
	init: function() {
		$('.tab-view').on('click','.tab-view-tab-selector', function(event){

			/* display graph loading screen */

			$('.chart-loading-screen').css({
				opacity: 0,
				display: 'block'
			}).animate({
				opacity: 1
			},125);

			/* end display graph loading screen */

			$($(event.target).closest('.tab-view').find('> .tab-view-body-wrapper > .tab-view-body > .tab-view-panel')).removeClass('active');
			$($(event.target).closest('.tab-view-tab-selectors').find('.tab-view-tab-selector')).removeClass('active');

			

			$($(this).data('target')).addClass('active');
			$(this).addClass('active');



			$('.trading-platform-main-controls-select-direction .btn').removeClass('active').removeClass('in-active');

			/* hide loading screen */

			setTimeout(function(){
				$('.chart-loading-screen').animate({
					opacity: 0
				},125, function(){
					$('.chart-loading-screen').css({
						display: 'none'
					});
				})
			}, 1500);
		});


		$('.tab-view.instrument-selector-widget').on('click','.tab-view-tab-selector', function(e) {
			highlowApp.instrumentPanelSelector.selectInstrument($($(this).data('target')+' .instrument-panel-active'));
		})
	}
}