sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/resource/ResourceModel"
], function(Controller, UIComponent, History, JSONModel, ResourceModel) {
	"use strict";

	return Controller.extend("VesselsManagementSystem1.controller.Detail", {
		onInit: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("detail").attachPatternMatched(this._onObjectMatched, this);
			var oModel = new JSONModel({
				selectedText: ""
			});
			this.getView().setModel(oModel, "textModel");
		},
		_onObjectMatched: function(oEvent) {
			this.getView().bindElement({
				path: "/" + window.decodeURIComponent(oEvent.getParameter("arguments").vesselsPath),
				model: "vessels"
			});
		},

		//Back Navigation Event
		onNavBack: function() {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = UIComponent.getRouterFor(this);
				oRouter.navTo("overview", {}, true);
			}

		},
		onChangeLanguage: function(oEvent) {
			var sSelectedLanguage = oEvent.getParameter("selectedItem").getKey();
			sap.ui.getCore().getConfiguration().setLanguage(sSelectedLanguage);
			var i18nModel = new sap.ui.model.resource.ResourceModel({
				bundleName: "VesselsManagementSystem1.i18n.i18n",
				supportedLocales: [sSelectedLanguage],
				fallbackLocale: sSelectedLanguage
			});
			this.getView().setModel(i18nModel, "i18n");
		}
	});
});