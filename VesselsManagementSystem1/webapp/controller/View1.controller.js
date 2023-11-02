sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/resource/ResourceModel",
	"../model/formatter",
	"sap/ui/core/routing/History",
	"sap/ui/core/UIComponent"
], function(Controller, MessageToast, JSONModel, ResourceModel, formatter, History, UIComponent) {
	"use strict";

	return Controller.extend("VesselsManagementSystem1.controller.View1", {
		formatter: formatter,
		onInit: function() {

			var oData = {
				recipient: {
					name: "0000000"
				}
			};
			var oModel = new JSONModel(oData);
			this.getView().setModel(oModel);

			var i18nModel = new ResourceModel({
				bundleName: "VesselsManagementSystem1.i18n.i18n",
				supportedLocales: [""],
				fallbackLocale: ""
			});
			this.getView().setModel(i18nModel, "i18n");
			var that = this; // Save a reference to the controller instance
			sap.ui.getCore().attachInit(function() {
				// Wrap your code in a function that gets executed once the core is initialized
				that.updateTime();
				//Updates time everey 1000 ms or 1 s.
				setInterval(that.updateTime.bind(that), 1000);
			});
			that.updateDate();
		},

		onButtonClick: function() {
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var sRecipient = this.getView().getModel().getProperty("/recipient/name");
			var sMsg = oBundle.getText("helloMsg", [sRecipient]);
			MessageToast.show(sMsg);
		},

		onOpenDialog: function() {
			var oView = this.getView();

			if (!this._oDialog) {
				this._oDialog = new sap.ui.xmlfragment(oView.getId(), "VesselsManagementSystem1.view.HelloDialog", this);

				oView.addDependent(this._oDialog);
			}

			this._oDialog.open();
		},
		onCloseDialog: function() {
			this._oDialog.close();
		},

		onNavItemSelect1: function(oEvent) {

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("vessels");
		},

		onNavItemSelect2: function(oEvent) {

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("ports");
		},

		onNavItemSelect: function(oEvent) {

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("login");

		},

		//Language selection function
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
				var currentTimeInNewYork = new Date().toLocaleTimeString("en-US", {
					timeZone: "Europe/Berlin"
				});

				// Set the time to the Text control
				oTimeText.setText(currentTimeInNewYork);
			}
		},
		updateDate: function() {
			var oDateText = this.getView().byId("dateText2");
			if (oDateText) {
				// Calculate the current date in a different time zone (e.g., "en-US" for New York)
				var currentDate = new Date().toLocaleDateString("en-US", {
					timeZone: "Europe/Berlin"
				});

				// Set the date to the Text control
				oDateText.setText(currentDate);
			}
		},

		//Show Calendar when Date is clicked
		handleCalendarSelection: function(oEvent) {
			var oCalendar = oEvent.getSource();
			oCalendar.setVisible(false);
		},
		toggleCalendarVisibility: function() {
			var oCalendar = this.getView().byId("calendarId");
			oCalendar.setVisible(!oCalendar.getVisible());
		},
		openCalendar: function() {
			var oCalendar = new sap.ui.unified.Calendar({
				id: "calendarId",
				selectedDate: "{/selectedDate}",
				startDate: "{/startDate}",
				endDate: "{/endDate}",
				select: this.openNoteDialog
			});

			var oDialog = new sap.m.Dialog({
				title: "Calendar",
				content: oCalendar,
				beginButton: new sap.m.Button({
					text: "Close",
					press: function() {
						oDialog.close();
					}
				})
			});

			oDialog.open();
		}
	});
});