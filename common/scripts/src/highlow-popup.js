highlowApp.popup = {
	init : function() {
		$('.trading-platform-popup-wrapper').on('click','.close', function(event) {
			$(event.target).closest('.trading-platform-popup-wrapper').addClass('concealed');
		});
		
		$('.trading-platform-popup-wrapper').on('click',function(event) {
			if (!$(event.target).closest('.trading-platform-popup-content-inner-wrap').length) {
				$(this).addClass('concealed');
			}
		});

		$('.trading-platform-sell-popup-sell').on('click', function(){
			$('.trading-platform-sell-popup').addClass('concealed');

		})
	}
}