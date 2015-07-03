highlowApp.balanceWidget = {
	close: function() {
		var widget = $('#account-balance');
		var menu = $('#account-balance .dropdown-menu');
		widget.removeClass('open');
		menu.hide();
	},
	display: function() {
		var widget = $('#account-balance');
		var menu = $('#account-balance .dropdown-menu');
		var _window = $(window);
		menu.show();
		widget.addClass('open');

		// get position of widget at time of open

		widget.data('opened-position',_window.scrollTop());

		menu.css({
			opacity: 0
		});

		menu.animate({
			opacity: 1
		},200);
	},
	initWithdrawDeposit: function() {
		var widget = $('#account-balance');
		var _window = $(window);
		var widgetPositionReset = {};

		$('#account-balance .toggle').click(function(){
			if(widget.hasClass('open')) {
				highlowApp.balanceWidget.close();
				
			} else {

				highlowApp.balanceWidget.display();
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
	},
	init: function() {
		var depositPopup = $('#make-deposit-popup')
		$('#account-balance .toggle').click(function(){
			if(depositPopup.hasClass('concealed')) {
				highlowApp.popup.displayPopup(depositPopup);
			} else {
				highlowApp.popup.hidePopup(depositPopup);
			}
		});
	}
}