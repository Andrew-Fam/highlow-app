var highlowApp = {};
var platformAssetUrl = "";
$(function () {

	highlowApp.jap = false;

	highlowApp.cn = false;
	
	if($('.jap-word').length>0) {
		highlowApp.jap = true;
	}

	if($('.cn').length>0) {
		highlowApp.cn = true;
	}

	if($('#platform-asset-url').length>0) {
		platformAssetUrl = $('#platform-asset-url').data('url');
	} else {
		platformAssetUrl = "common/images/";
	}


	



	
	highlowApp.tab.init();
	highlowApp.systemMessages.init();
	highlowApp.graph.init();
	highlowApp.marketSimulator.init();
	highlowApp.oneClick.init();
	highlowApp.popup.init();
	highlowApp.instrumentPanelCollapser.init();
	highlowApp.instrumentPanelSlider.init();
	highlowApp.instrumentPanelSelector.init();
	highlowApp.betSystem.init();
	highlowApp.favourite.init();
	highlowApp.heatmap.init();
	highlowApp.tooltip.init(1000);
	highlowApp.numberOnly.init();
	highlowApp.balanceWidget.init();
	highlowApp.toggler.init();
	highlowApp.assetFilter.init();
});