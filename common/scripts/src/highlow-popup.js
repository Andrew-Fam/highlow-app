highlowApp.popup = {
	init : function() {


		$('.trading-platform-popup-wrapper').on('click','.close', function(event) {
			highlowApp.popup.hidePopup($(event.target).closest('.trading-platform-popup-wrapper'));
		});
		
		$('.trading-platform-popup-wrapper').on('click',function(event) {
			// if (!$(event.target).closest('.trading-platform-popup-content-inner-wrap').length) {
			// 	highlowApp.popup.hidePopup($(this));
			// }
		});

		$('.trading-platform-sell-popup-sell').on('click', function(){

			$('.trading-platform-sell-popup').addClass('concealed');
		});

		$('.popup-link').click(function(){
			window.open($(this).attr('href'), "_blank", "scrollbars=yes, resizable=yes, top="+(($(window).height()-540)/2)+", left="+(($(window).width()-966)/2)+" width=966, height=540");
		});

		$('.trading-activity-popup-root').on('click','.investment-sell-btn', function() {
			highlowApp.popup.displayPopup($('.trading-platform-sell-popup'));
		});

		$('#account-balance .btn.deposit').click(function(){
			highlowApp.popup.displayPopup($('#make-deposit-popup'));
		});
		$('#account-balance .btn.withdraw').click(function(){
			highlowApp.popup.displayPopup($('#make-withdrawal-popup'));
		});

		$('#make-deposit-popup, #make-withdrawal-popup').on('click','.close',function(event){
			highlowApp.balanceWidget.close();
		});

		// read memorized position

		$(".trading-platform-popup-wrapper").not('#make-deposit-popup').each(function(){
			var self = $(this),
			id = self.attr('id');
			self.data('memorizedLeft',$.cookie(id+'-left'));
			self.data('memorizedTop',$.cookie(id+'-top'));
		});


		$(".trading-platform-popup-wrapper").not('#make-deposit-popup').each(function(){
			var self = $(this);

			self.draggable({
				handle: ".trading-platform-popup-header",
				stop: function() { // remember position
					$.cookie(self.attr('id')+'-left',self.css('left'));
					$.cookie(self.attr('id')+'-top',self.css('top'));
					self.data('memorizedLeft',self.css('left'));
					self.data('memorizedTop',self.css('top'));
				}
			});
		});

		// initialize make-deposit-popup

		var $accountBalanceWidget = $('#account-balance');

		var $makeDepositPopup = $('#make-deposit-popup');

		if($accountBalanceWidget.length>0) {
			var makeDepositPopupLeft = $accountBalanceWidget.offset().left-($makeDepositPopup.outerWidth()-$accountBalanceWidget.outerWidth())+25,
			makeDepositPopupTop = $accountBalanceWidget.offset().top+$accountBalanceWidget.outerHeight();

			$makeDepositPopup.css({
				left: makeDepositPopupLeft,
				top: makeDepositPopupTop
			}).draggable({
				handle: ".trading-platform-popup-header",
				stop: function() { // remember position (not persist after close)
					$makeDepositPopup.data('memorizedLeft',$makeDepositPopup.css('left'));
					$makeDepositPopup.data('memorizedTop',$makeDepositPopup.css('top'));
				}
			});

			$makeDepositPopup.data('memorizedLeft',makeDepositPopupLeft)
				.data('memorizedTop',makeDepositPopupTop);
		}
	},
	hidePopup: function(element) {
		element.addClass('concealed');
	},
	displayPopup: function(element) {

		var memorizedTop = element.data('memorizedTop'),
			memorizedLeft = element.data('memorizedLeft'),
			$window = $(window),
			$mainView = $('.main-view');

		var top = memorizedTop || $mainView.offset().top+40,
		left = memorizedLeft || $mainView.offset().left+70;

		console.log(parseInt(top)+","+$window.scrollTop());

		if(parseInt(top) < parseInt($window.scrollTop()) + parseInt($('#account-menu-bar').outerHeight())) {
			top = parseInt($window.scrollTop()) + parseInt($('#account-menu-bar').outerHeight())+'px';
		}

		element.css({
			top: top,
			left: left
		});

		element.removeClass('concealed');
	}
}