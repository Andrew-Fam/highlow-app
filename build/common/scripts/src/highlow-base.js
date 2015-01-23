var highlowApp = {};

$(function () {

	highlowApp.jap = false;
	
	if($('.jap-word').length>0) {
		highlowApp.jap = true;
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
});