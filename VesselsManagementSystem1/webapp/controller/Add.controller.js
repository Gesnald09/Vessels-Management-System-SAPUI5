	sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/ui/core/UIComponent",
		"sap/ui/core/routing/History",
		"sap/m/MessageToast",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/ListItem"
	], function(Controller, UIComponent, History, MessageToast, JSONModel, ListItem) {
		"use strict";

		return Controller.extend("VesselsManagementSystem1.controller.Add", {
			onInit: function() {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.getRoute("add").attachPatternMatched(this._onObjectMatched, this);
			},
			_onObjectMatched: function(oEvent) {
				this.getView().bindElement({
					path: "/" + window.decodeURIComponent(oEvent.getParameter("arguments").vesselsPath),
					model: "vessels"
				});
			},

			onAddData1: function() {
				var oView = this.getView();

				// Lexo vlerat nga fushat e inputit
				var IMO = oView.byId("inputImo").getValue();
				var Name = oView.byId("inputName").getValue();
				var Vesselstype = oView.byId("inputVesseltype").getValue();
				var MMSI = oView.byId("inputMmsi").getValue();
				var Callsign = oView.byId("inputCallsign").getValue();
				var Country = oView.byId("inputCountry").getValue();
				var Grosstonnage = oView.byId("inputGrosstonnage").getValue();
				var Summerdwt = oView.byId("inputSummerdwt").getValue();
				var Length = oView.byId("inputLength").getValue();
				var Width = oView.byId("inputWidth").getValue();
				var YearBuilt = oView.byId("inputYearbuilt").getValue();
				var Porttoll = oView.byId("inputPorttoll").getValue();
				var Generalinfo = oView.byId("inputGeneralinfo").getValue();
				var Currency = oView.byId("inputCurrency").getValue();
				// Gjenero një objekt të ri për të shtuar në "schiffe.json"
				var newShip = {
					"IMO": parseInt(IMO),
					"Name": Name,
					"Vesselstype": Vesselstype,
					"MMSI": parseInt(MMSI),
					"Callsign": Callsign,
					"Country": Country,
					"Grosstonnage": parseInt(Grosstonnage),
					"Summerdwt": parseInt(Summerdwt),
					"Length": parseInt(Length),
					"Width": parseInt(Width),
					"YearBuilt": parseInt(YearBuilt),
					"Generalinfo": Generalinfo,
					"Currency": Currency,

					//Float conversion if needed
					"Porttoll": parseFloat(Porttoll)
				};

				//var oModel = oView.getModel("vessels");
				var oModel = this.getView().getModel("vessels");

				var aVessels = oModel.getProperty("/Vessels");

				aVessels.push(newShip);

				oModel.setProperty("/Vessels", aVessels);


				oView.byId("inputImo").setValue("");
				oView.byId("inputName").setValue("");
				oView.byId("inputVesseltype").setValue("");
				oView.byId("inputMmsi").setValue("");
				oView.byId("inputCallsign").setValue("");
				oView.byId("inputCountry").setValue("");
				oView.byId("inputGrosstonnage").setValue("");
				oView.byId("inputSummerdwt").setValue("");
				oView.byId("inputLength").setValue("");
				oView.byId("inputWidth").setValue("");
				oView.byId("inputYearbuilt").setValue("");
				oView.byId("inputPorttoll").setValue("");
				oView.byId("inputGeneralinfo").setValue("");
				oView.byId("inputCurrency").setValue("");

				var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
				MessageToast.show(oResourceBundle.getText("AddMessagetext"));

				var oComboBox = this.getView().byId("inputCountry");
				oComboBox.setValue(""); // Clears the ComboBox value

			},
			onNavBack: function() {
				var oHistory = History.getInstance();
				var sPreviousHash = oHistory.getPreviousHash();

				if (sPreviousHash !== undefined) {
					window.history.go(-1);
				} else {
					var oRouter = UIComponent.getRouterFor(this);
					oRouter.navTo("vessels", {}, true);
				}

			}
		});
	});