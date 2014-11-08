highlowApp.instrumentPanelCollapser = {
	init: function() {

		//collapser

		$('.instrument-selector-widget').on('click','.instrument-selector-widget-collapse-toggle',function(event){
			var self = $(this),
			$parent = $($(event.target).closest('.instrument-selector-widget')),
			$instrumentPanelsWrapper = $parent.find('.page-container'),
			$instrumentSliders = $parent.find('.instrument-selector-widget-instruments-slider');
			$instrumentPanels = $parent.find('.instrument-panel');

			if(self.hasClass('on')) {
				self.removeClass('on');
				// $instrumentPanels.removeClass('collapsed');
				$instrumentPanelsWrapper.animate({
					height: '140px'
				},250,function(){
					$instrumentPanels.removeClass('collapsed');
				});
				$instrumentSliders.animate({
					'line-height' : '188px'
				},250);
			} else {
				self.addClass('on');
				// $instrumentPanels.addClass('collapsed');
				$instrumentPanelsWrapper.animate({
					height: '36px'
				},250,function(){
					$instrumentPanels.addClass('collapsed');
				});

				$instrumentSliders.animate({
					'line-height' : '98px'
				},250);
			}
		});
	}
}