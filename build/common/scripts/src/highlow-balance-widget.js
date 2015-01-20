highlowApp.balanceWidget = {
	init: function() {
		var widget = $('#account-balance');
		var menu = $('#account-balance .dropdown-menu');
		var _window = $(window);
		var widgetPositionReset = {};

		// $('#account-balance').on('mouseleave',function(){
		// 	if(widget.hasClass('open')) {
		// 		menu.toggle();
		// 		widget.removeClass('open');
		// 	}
		// });

		$('#account-balance .toggle').click(function(){
			menu.toggle();
			if(widget.hasClass('open')) {
				widget.removeClass('open');
				// console.log('close');
				
			} else {
				widget.addClass('open');

				// get position of widget at time of open

				widget.data('opened-position',_window.scrollTop());

				menu.css({
					opacity: 0
				});

				menu.animate({
					opacity: 1
				},200);
				// console.log('open');
			}
		});

		_window.scroll(function(){

			clearTimeout(widgetPositionReset);

			widgetPositionReset = setTimeout(function(){
				widget.data('opened-position',_window.scrollTop());
			},150);


			if(Math.abs(_window.scrollTop() - widget.data('opened-position'))>250) {
				if(widget.hasClass('open')) {
					menu.toggle();
					widget.removeClass('open');
				}
			}
		});
	}
}