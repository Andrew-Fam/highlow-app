highlowApp.assetFilter = {
	init : function() {
		var $indicator = $('#highlow-asset-filter--selected-category-indicator'),
			$categoryContainer = $('#highlow-asset-filter--categories-container'),
			$optionsContainer = $('#highlow-asset-filter--options-container'),
			$optionsContent = $('#highlow-asset-filter--options');

		function moveIndicator() {
			var $activeMarker = $('.highlow-asset-filter--category.active .highlow-asset-filter--category--indicator');

			$indicator.css({
				left: $activeMarker.offset().left - $categoryContainer.offset().left - 2
			});

		}

		function updateUI() {
			moveIndicator();
			$optionsContainer.css({
				height: $optionsContent.outerHeight() 
			});
		}

		function closeUI() {
			$('.asset-filter').removeClass('active');
			$optionsContainer.css({
				height: 0
			});
		}

		moveIndicator();

		$('.asset-filter--opener').click(function(){
			var $self = $(this);

			if($self.hasClass('active')) {
				updateUI();
			} else {
				closeUI();
			}

		});

		$('.highlow-asset-filter--category').click(function(){

			var $self = $(this),
				category = $self.data('category');

			if(category!='all') {
				$('.highlow-asset-filter--option').css({
					display: 'none'
				});
			} else {

				$('.highlow-asset-filter--option').css({
					display: 'block'
				});

				$('.highlow-asset-filter--option[data-option=""][data-category="currencies"],.highlow-asset-filter--option[data-option=""][data-category="indices"],.highlow-asset-filter--option[data-option=""][data-category="commodities"]').css({
					display: 'none'
				});
			}

			$('.highlow-asset-filter--option[data-category="'+category+'"]').css({
				display: 'block'
			});

			$('.highlow-asset-filter--category').removeClass('active');

			$self.addClass('active');

			$optionsContainer.css({
				height: $optionsContent.outerHeight() 
			});

			updateUI();

		});


		$('.highlow-asset-filter--option-picker').click(function(){

			var $self = $(this);

			if($self.data('option')=='') {
				return;
			}

			if($self.hasClass('selected')) {
				$('.highlow-asset-filter--option-picker').removeClass('selected');
				$($($self.closest('.instrument-selector-widget-instrument-filter')).find('.asset-filter--placeholder')).html($('#highlow-asset-filter--category--all-asset').data('option'));
			} else {
				$('.highlow-asset-filter--option-picker').removeClass('selected');
				$self.addClass('selected');
				$($($self.closest('.instrument-selector-widget-instrument-filter')).find('.asset-filter--placeholder')).html($self.data('option'));
			}

		

			

			closeUI();
		});

		$('body').click(function(e){
			if($(e.target).closest('.instrument-selector-widget-instrument-filter').length<=0) {
				closeUI();
			}
		});
	}
}