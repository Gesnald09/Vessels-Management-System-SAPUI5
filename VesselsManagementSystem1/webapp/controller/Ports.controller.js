sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/routing/History",
	"sap/ui/core/UIComponent",
	"sap/ui/model/resource/ResourceModel",
	'sap/ui/export/library',
	'sap/ui/export/Spreadsheet'
], function(Controller, JSONModel, formatter, Filter, FilterOperator, History, UIComponent, ResourceModel, library, Spreadsheet) {
	"use strict";

	return Controller.extend("VesselsManagementSystem1.controller.Ports", {
		formatter: formatter,

		//set Date for table view
		formatDate: function(sTimeZone) {
			if (sTimeZone) {
				var currentDate = new Date().toLocaleDateString("en-US", {
					timeZone: sTimeZone
				});
				return currentDate;
			}
			return "";
		},

		//set Time for table view
		formatTime: function(sTimeZone) {
			if (sTimeZone) {
				var options = {
					timeZone: sTimeZone,

					//hh:mm format for table view
					hour: '2-digit',
					minute: '2-digit'
				};
				var currentTime = new Date().toLocaleTimeString("en-US", options);
				return currentTime;
			}
			return "";
		},

		onInit: function() {
			var oViewModel = new JSONModel({});
			this.getView().setModel(oViewModel, "view");

			// Save a reference to the controller instance
			var that = this;
			sap.ui.getCore().attachInit(function() {

				// Wrap your code in a function that gets executed once the core is initialized
				that.updateTime();

				//Update time every 1000 ms or 1 s
				setInterval(that.updateTime.bind(that), 1000);
			});
			that.updateDate();
		},
		onFilterPorts: function(oEvent) {

			//filter array
			var aFilter = [];
			var sQuery = oEvent.getParameter("query");
			if (sQuery) {
				aFilter.push(new Filter("PortsName", FilterOperator.Contains, sQuery));
			}

			//filter binding
			var oList = this.byId("Ports");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);
		},
		updateTime: function() {
			var oTimeText1 = this.getView().byId("timeText1");
			if (oTimeText1) {
				var Portstime1;

				//Gives time for a different zone
				var portsTime = this.getView().getModel("view").getProperty("/Ports");

				if (portsTime && portsTime[0] && portsTime[0].TimeZone) {
					Portstime1 = new Date().toLocaleTimeString("en-US", {
						timeZone: portsTime[0].TimeZone
							// Use the time zone from the first entry in your JSON data
					});
				}

				oTimeText1.setText(Portstime1);
			}
			var oTimeText = this.getView().byId("timeText");
			if (oTimeText) {
				// Calculate the current time in a different time zone (e.g., "en-US" for Berlin)
				var currentTime = new Date().toLocaleTimeString("en-US", {

					//You can change your time Zone accordig to the area where you live in.
					timeZone: "Europe/Berlin"
				});

				// Set the time to the Text control
				oTimeText.setText(currentTime);
			}
		},

		updateDate: function() {
			var oDateText1 = this.getView().byId("dateText1");
			if (oDateText1) {
				var Portsdata1;

				//Gives date for a different zone according to the time-zone specified
				var portsData = this.getView().getModel("view").getProperty("/Ports");

				if (portsData && portsData[0] && portsData[0].TimeZone) {
					Portsdata1 = new Date().toLocaleDateString("en-US", {
						timeZone: portsData[0].TimeZone // Use the time zone from the first entry in your JSON data
					});
				}

				oDateText1.setText(Portsdata1);
			}
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

		//Back Nav button
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
		//Language Selection Function
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

		//Create a Column for table header in Excel
		createColumnConfig: function() {

			var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
			return [{
				label: (oResourceBundle.getText("PortsidText")),
				property: "Idh",
				type: "String"
			}, {
				label: (oResourceBundle.getText("PortsnameText")),
				property: "PortsName",
				type: "String"
			}, {
				label: (oResourceBundle.getText("PortsCountryText")),
				property: "Country",
				type: "String"
			}, {
				label: (oResourceBundle.getText("PortsterminalsnoText")),
				property: "NoofTerminals",
				type: "String"
			}];
		},

		onExportToExcel: function() {

			var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
			var jsonData = this.getView().getModel("ports").getProperty("/Ports");

			var aCols, oSettings, oSheet;

			aCols = this.createColumnConfig(); // Define your column configuration function.

			oSettings = {
				workbook: {
					columns: aCols
				},
				dataSource: jsonData, // Use the JSON data directly
				fileName: (oResourceBundle.getText("PortsText")),
				worker: false // Disable worker if needed
			};

			oSheet = new sap.ui.export.Spreadsheet(oSettings);
			oSheet.build().finally(function() {
				oSheet.destroy();
			});
		}
	});
});