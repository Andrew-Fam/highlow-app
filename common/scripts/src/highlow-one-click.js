highlowApp.oneClick = {
	init: function() {
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
	}
}