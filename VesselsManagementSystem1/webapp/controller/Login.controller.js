sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"jquery.sap.global",
	"sap/m/MessageToast",
	"sap/ui/core/routing/History",
	"sap/ui/core/UIComponent",
	"sap/ui/model/resource/ResourceModel"
], function(Controller, JSONModel, jQuery, MessageToast, History, UIComponent, ResourceModel) {
	"use strict";

	return Controller.extend("VesselsManagementSystem1.controller.Login", {
		onInit: function() {
			var oModel = new JSONModel();

			jQuery.ajax({
				url: "users.json", // Replace with the correct path
				dataType: "json",
				success: function(oData) {
					oModel.setData(oData);
				},
				error: function() {
					// Handle errors
				}
			});

			this.getView().setModel(oModel, "users");
			
			var that = this; // Save a reference to the controller instance
			sap.ui.getCore().attachInit(function() {
				// Wrap your code in a function that gets executed once the core is initialized
				that.updateTime();
				//Updates time everey 1000 ms or 1 s.
				setInterval(that.updateTime.bind(that), 1000);
			});
			that.updateDate();
		},

		onLogin: function() {
			var oModel = this.getView().getModel("users");
			var aUsers = oModel.getProperty("/Users");
			var oUser = this.getView().byId("username").getValue();
			var oPass = this.getView().byId("password").getValue();

			var isValidUser = false;

			for (var i = 0; i < aUsers.length; i++) {

				if (aUsers[i].Username === oUser && aUsers[i].Password.toString() === oPass) {
					isValidUser = true;

					// Exit the loop if a match is found
					break;
				}
			}

			if (isValidUser) {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("costum");
			} else {
				var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
				MessageToast.show(oResourceBundle.getText("TryagainText"));
			}
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
			var i18nModel = new ResourceModel({
				bundleName: "VesselsManagementSystem1.i18n.i18n",
				supportedLocales: [sSelectedLanguage],
				fallbackLocale: sSelectedLanguage
			});
			this.getView().setModel(i18nModel, "i18n");
		},
	//Time Function
		updateTime: function() {
			var oTimeText = this.getView().byId("timeText");
			if (oTimeText) {
				// Calculate the current time in a different time zone (e.g., "en-US" for Berlin)
				var currentTime = new Date().toLocaleTimeString("en-US", {
					timeZone: "Europe/Berlin"
				});

				// Set the time to the Text control
				oTimeText.setText(currentTime);
			}
		},
		updateDate: function() {
				var oDateText = this.getView().byId("dateText");
			if (oDateText) {

				var currentDate = new Date().toLocaleDateString("en-US", {

					//Time zone
					timeZone: "Europe/Berlin"
				});

				// Set the date to the Text control
				oDateText.setText(currentDate);
		}
		},
			onNavi3: function(oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("adduser");
		}
	});
});