sap.ui.define([], function() {
	"use strict";
	return {
		statusText: function(YearBuilt) {
			var resourceBundle = this.getView().getModel("i18n").getResourceBundle();
			if (YearBuilt >= 1995) {
				return resourceBundle.getText("PollutiontollcaseA");
			} else if (YearBuilt < 1995) {
				return resourceBundle.getText("PollutiontollcaseB");
			}
		}
	};
});