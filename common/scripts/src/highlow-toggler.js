highlowApp.toggler = {
	init: function() {
		$('.hl-toggler').each(function(){
			var self = $(this),
			target = $(self.data('toggleTarget')),
			focusTarget = $(self.data('toggleFocus')),
			toggleClass = self.data('toggleClass'),
			toggleGroup = self.data('toggleGroup'),
			toggleBodyFixedHeight = self.data('toggleBodyFixedHeight'),
			toggleMatchContainerHeight = self.data('toggleOnActiveMatchHeight'),
			toggleSelfOffDisabled = self.data('toggleSelfOffDisabled'),
			toggleSelfOnDisabled = self.data('toggleSelfOnDisabled'),
			toggleOffClick = self.data('toggleOffClick');

			if(!toggleClass || toggleClass == '') {
				toggleClass = 'active';
			}

			if(self.data('toggleTarget')=='self') {
				target = self;
			}



			var off = function() {
				$('[data-toggle-target="'+self.data('toggleTarget')+'"]').removeClass(toggleClass);

				if(self.hasClass('asset-filter--asset--label')) {
					console.log('OOOOOFFFF');
					console.log(target);
					console.log(toggleClass);
				}

				target.removeClass(toggleClass);

				if(self.hasClass('asset-filter--asset--label')) {
					console.log('AFTER OOOOOFFFF');
					console.log(target);
				}

				if(toggleBodyFixedHeight) {
					$('body').removeClass('fixed-height');
				}
				self.removeClass(toggleClass);
			}

			var on = function() {
				if(toggleGroup && toggleGroup != '') {
					$('[data-toggle-group="'+toggleGroup+'"]').removeClass(toggleClass);
				}

				focusTarget.focus();
				focusTarget.select();
				self.addClass(toggleClass);
				console.log("CAI DU ME");
				console.log(self);
				
				target.addClass(toggleClass);
				if(toggleBodyFixedHeight) {
					$('body').addClass('fixed-height');
				}
				if(toggleMatchContainerHeight) {
					$(toggleMatchContainerHeight).css({
						height: target.outerHeight()
					});
				}
			}

			var toggle = function() {

				if(target.hasClass(toggleClass) && !toggleSelfOffDisabled) {
					if(self.hasClass('asset-filter--asset--label')) {
						console.log('BEFORE OFFF');
						console.log(target);
					}
					off();
				} else {
					if(!toggleSelfOnDisabled) {
						on();
					}					
				}
			}

			if(self.data('hoverToggle')) {

				var hoverHandler = function(){

					console.log("ATTACH HOVER TOGGLE EVENT");

					self.mouseover(function(){
						if(!$('body').hasClass('touched')) {
							on();
						}
					});
					self.mouseout(function(){
						if(!$('body').hasClass('touched') && !toggleSelfOffDisabled) {
							off();
						}
					});

					$(document).off('mousemove',hoverHandler);
				}

				$(document).on('mousemove', hoverHandler);

				self.click(function(){
					if($('body').hasClass('touched')) {
						toggle();
					}
				});
				
				
			} else {
				self.click(function(){
					toggle();
				});
			}

			if(toggleOffClick) {
				$(document).on('click', function(e) {
					if(!$.contains(self.get(0),e.target) && e.target!==self.get(0)) {
						off();
					}
				})
			}
		});

		function resize() {
			$('.hl-toggler.active').each(function(){
				var self = $(this),
				target = $(self.data('toggleTarget')),
				toggleMatchContainerHeight = self.data('toggleOnActiveMatchHeight');

				if(toggleMatchContainerHeight) {
					$(toggleMatchContainerHeight).css({
						height: target.outerHeight()
					});
				}

			});
		}
	
		$(window).resize(resize);

		resize();

		$('.disable-propagation').click(function(e){
			e.stopPropagation();
		});
	}
}