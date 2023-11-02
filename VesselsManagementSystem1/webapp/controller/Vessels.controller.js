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

	return Controller.extend("VesselsManagementSystem1.controller.Vessels", {
		formatter: formatter,
		onInit: function() {
			var oViewModel = new JSONModel({
				//currency: "EUR"
			});
			this.getView().setModel(oViewModel, "view");
			var that = this; // Save a reference to the controller instance
			sap.ui.getCore().attachInit(function() {
				// Wrap your code in a function that gets executed once the core is initialized
				that.updateTime();
				setInterval(that.updateTime.bind(that), 1000);
			});
			that.updateDate();
			//Chart:		
			var Pie = this.getView().byId("vizPie");
			var dataset = new sap.viz.ui5.data.FlattenedDataset({

				dimensions: [{
					axis: 1,
					name: "IMO",
					value: "{vessels>IMO}"
				}],

				measures: [{
					name: "{i18n>columnPorttoll}",
					value: "{vessels>Porttoll}"
				}],

				data: {
					path: "vessels>/Vessels"
				}

			});
			Pie.setDataset(dataset);
		},
		onFilterVessels: function(oEvent) {

			//ndertojme vektorin e filtrimit
			var aFilter = [];
			var sQuery = oEvent.getParameter("query");
			if (sQuery) {
				aFilter.push(new Filter("Name", FilterOperator.Contains, sQuery));
			}
			//filter binding
			var oList = this.byId("Vessels");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);
		},

		onNavi: function(oEvent) {
			var oItem = oEvent.getSource();
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("detail", {
				vesselsPath: window.encodeURIComponent(oItem.getBindingContext("vessels").getPath().substr(1))
			});
		},
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
				oRouter.navTo("overview", {}, true);
			}

		},
		onNavii: function(oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("add");
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
				label: "IMO",
				property: "IMO",
				type: "String"
			}, {
				label: (oResourceBundle.getText("columnName")),
				property: "Name",
				type: "String"
			}, {
				label: (oResourceBundle.getText("columnVesselstype")),
				property: "Vesselstype",
				type: "String"
			}, {
				label: "MMSI",
				property: "MMSI",
				type: "String"
			}, {
				label: (oResourceBundle.getText("columnCallsign")),
				property: "Callsign",
				type: "String"
			}, {
				label: (oResourceBundle.getText("columnFlag")),
				property: "Country",
				type: "String"
			}, {
				label: (oResourceBundle.getText("columnGrosstonnage")),
				property: "Grosstonnage",
				type: "String"
			}, {
				label: (oResourceBundle.getText("columnSummerdwt")),
				property: "Summerdwt",
				type: "String"
			}, {
				label: (oResourceBundle.getText("columnLength")),
				property: "Length",
				type: "String"
			}, {
				label: (oResourceBundle.getText("columnWidth")),
				property: "Width",
				type: "String"
			}, {
				label: (oResourceBundle.getText("columnYearbuilt")),
				property: "YearBuilt",
				type: "String"
			}, {
				label: (oResourceBundle.getText("columnPorttoll")),
				property: "Porttoll",
				type: "String"
			}, {
				label: (oResourceBundle.getText("columnCurrency")),
				property: "Currency",
				type: "String"
			}];
		},

		onExportToExcel: function() {

			var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
			var jsonData = this.getView().getModel("vessels").getProperty("/Vessels");

			var aCols, oSettings, oSheet;

			aCols = this.createColumnConfig(); // Define your column configuration function.

			oSettings = {
				workbook: {
					columns: aCols
				},
				dataSource: jsonData, // Use the JSON data directly
				fileName: (oResourceBundle.getText("VesselsListTitle")),
				worker: false // Disable worker if needed
			};

			oSheet = new sap.ui.export.Spreadsheet(oSettings);
			oSheet.build().finally(function() {
				oSheet.destroy();
			});
		}
	});
});