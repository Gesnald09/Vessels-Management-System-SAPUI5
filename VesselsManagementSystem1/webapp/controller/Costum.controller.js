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

	return Controller.extend("VesselsManagementSystem1.controller.Costum", {
		formatter: formatter,
		onInit: function() {
			var oViewModel = new JSONModel({
				//currency: "EUR"
			});
			this.getView().setModel(oViewModel, "view");
			var that = this;
			sap.ui.getCore().attachInit(function() {
				that.updateTime();
				setInterval(that.updateTime.bind(that), 1000);
			});
			that.updateDate();
		},

		onFilterCostum: function(oEvent) {

			var aFilter = [];
			var sQuery = oEvent.getParameter("query");
			if (sQuery) {
				aFilter.push(new Filter("IDC", FilterOperator.EQ, parseInt(sQuery)));
			}
			//filter binding
			var oList = this.byId("Costum");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);
		},

		//Time function
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
				// Calculate the current date in a different time zone (e.g., "en-US" for New York)
				var currentDate = new Date().toLocaleDateString("en-US", {
					timeZone: "Europe/Berlin"
				});

				// Set the date to the Text control
				oDateText.setText(currentDate);
			}
		},
		onNavBack: function() {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = UIComponent.getRouterFor(this);
				oRouter.navTo("login", {}, true);
			}

		},
		onNavii: function(oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("addcostum");
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
		createColumnConfig: function() {

			var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
			return [{
				label: "IDC",
				property: "IDC",
				type: "String"
			}, {
				label: "IMO",
				property: "IMO",
				type: "String"
			}, {
				label: (oResourceBundle.getText("columnDepartureport")),
				property: "DeparturePort",
				type: "String"
			}, {
				label: (oResourceBundle.getText("columnArrivaldate")),
				property: "ArrivalDate",
				type: "String"
			}, {
				label: (oResourceBundle.getText("columnETD")),
				property: "EstimateddepartureDate",
				type: "String"
			}, {
				label: (oResourceBundle.getText("columnDays")),
				property: "Days",
				type: "String"
			}, {
				label: (oResourceBundle.getText("columnTotalamountoftoll")),
				property: "Totalamountoftoll",
				type: "String"
			}, {
				label: (oResourceBundle.getText("columnTotalamountoftolleur")),
				property: "Totalamountoftolleur",
				type: "String"
			}];
		},

		onExportToExcel: function() {

			var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
			var jsonData = this.getView().getModel("costum").getProperty("/Costum");

			var aCols, oSettings, oSheet;

			aCols = this.createColumnConfig(); // Define your column configuration function.

			oSettings = {
				workbook: {
					columns: aCols
				},
				dataSource: jsonData, // Use the JSON data directly
				fileName: (oResourceBundle.getText("Costumtext")),
				worker: false // Disable worker if needed
			};

			oSheet = new sap.ui.export.Spreadsheet(oSettings);
			oSheet.build().finally(function() {
				oSheet.destroy();
			});
		}
	});
});