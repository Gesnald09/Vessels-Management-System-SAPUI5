sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent",
	"sap/ui/core/routing/History",
	"sap/m/MessageToast",
	"sap/ui/model/resource/ResourceModel",
	"sap/ui/model/json/JSONModel"
], function(Controller, UIComponent, History, MessageToast, ResourceModel, JSONModel) {
	"use strict";

	return Controller.extend("VesselsManagementSystem1.controller.Addcostum", {
		daysDifference: 0,
		selectedImo: 0,
		startDate: null,
		endDate: null,
		porttoll: 0,
		Exrate: 0,
		nextIDC: 0,
		totalamounteur: 0,
		onInit: function() {
			var that = this;
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("addcostum").attachPatternMatched(this._onObjectMatched, this);

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
		_onObjectMatched: function(oEvent) {
			this.getView().bindElement({
				path: "/" + window.decodeURIComponent(oEvent.getParameter("arguments").costumPath),
				model: "costum"
			});
		},
		onNavBack1: function() {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = UIComponent.getRouterFor(this);
				oRouter.navTo("costum", {}, true);
			}
		},

		calculate: function() {
			var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

			var that = this;
			var oView = this.getView();
			var departurePort = this.getView().byId("inputDepartureport");
			this.startDatePicker = this.getView().byId("startDatePicker");
			this.endDatePicker = this.getView().byId("endDatePicker");
			that.startDate = this.startDatePicker.getDateValue();
			that.endDate = this.endDatePicker.getDateValue();
			var oModel1 = this.getView().getModel("vessels");
			var jsonData = oModel1.getProperty("/Vessels");
			var oView1 = this.getView();
			this.selectedImo = oView.byId("imoComboBox").getValue();
			var selectedVessel = jsonData.find(function(vessel) {
				return vessel.IMO.toString() === that.selectedImo;
			});
			this.porttoll = selectedVessel.Porttoll;
			this.currency = selectedVessel.Currency;
			this.exchng = selectedVessel.Exchng;
			this.selectedport = oView.byId("inputDepartureport").getValue();
			oView1.byId("porttollInput").setValue(this.porttoll);
			oView1.byId("currencyInput").setValue(this.currency);

			var oModel3 = this.getView().getModel("costum");
			var jsonData3 = oModel3.getProperty("/Costum");
			var dataLength = jsonData3.length;

			if (that.startDate && that.endDate) {
				var inputedstartdate = that.startDate.toLocaleDateString("en-US");
				var inputedenddate = that.endDate.toLocaleDateString("en-US");
				for (var i = 0; i < dataLength; i++) {
					var startdate1 = jsonData3[i].ArrivalDate;
					var enddate1 = jsonData3[i].EstimateddepartureDate;
					if (startdate1 < inputedenddate && inputedenddate < enddate1) {
						MessageToast.show(oResourceBundle.getText("BusyPortText"));
					} else if (startdate1 < inputedstartdate && inputedstartdate < enddate1) {
						MessageToast.show(oResourceBundle.getText("BusyPortText"));
					} else if (startdate1 > inputedstartdate && inputedenddate > enddate1) {
						MessageToast.show(oResourceBundle.getText("BusyPortText"));
					} else if (inputedstartdate > inputedenddate) {
						MessageToast.show(oResourceBundle.getText("BusyPortText"));
					} else {
						var timeDifference = that.endDate.getTime() - that.startDate.getTime();
						that.daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));
						var oModel = this.getView().getModel();
						oModel.setProperty("/numDays", this.daysDifference);

						if (this.selectedImo && this.daysDifference) {
							this.totalamount = this.porttoll * this.daysDifference;
							oView1.byId("totalamountInput").setValue(this.totalamount);
							this.totalamounteur = this.exchng * this.totalamount;
							oView1.byId("totalamounteurInput").setValue(this.totalamounteur);
						}
					}

					var oModel1 = this.getView().getModel("vessels");
					var jsonData = oModel1.getProperty("/Vessels");
					var oView1 = this.getView();
					this.selectedImo = oView.byId("imoComboBox").getValue();
					var selectedVessel = jsonData.find(function(vessel) {
						return vessel.IMO.toString() === that.selectedImo;
					});
					this.porttoll = selectedVessel.Porttoll;
					this.currency = selectedVessel.Currency;
					this.exchng = selectedVessel.Exchng;

					this.selectedport = oView.byId("inputDepartureport").getValue();
					oView1.byId("porttollInput").setValue(this.porttoll);
					oView1.byId("currencyInput").setValue(this.currency);
					if (this.selectedImo && this.daysDifference) {
						this.totalamount = this.porttoll * this.daysDifference;
						oView1.byId("totalamountInput").setValue(this.totalamount);
						this.totalamounteur = this.exchng * this.totalamount;
						oView1.byId("totalamounteurInput").setValue(this.totalamounteur);
					}
				}
			}
		},
		calculateNextIDC: function(currentIDC) {
			var oModel = this.getView().getModel("costum");
			var jsonData = oModel.getProperty("/Costum");
			if (jsonData && jsonData.length > 0) {
				var lastRecord = jsonData[jsonData.length - 1];
				var lastIDC = lastRecord.IDC;
				return lastIDC + 1;
			}
		},

		onAddcost: function() {
			var oView = this.getView();
			var that = this;
			var oModel = this.getView().getModel("costum");

			var aCostum = oModel.getProperty("/Costum");

			var newCostum = {
				"IDC": this.calculateNextIDC(),
				"IMO": parseInt(this.selectedImo),
				"DeparturePort": this.selectedport,
				"ArrivalDate": that.startDate.toLocaleDateString("en-US"),
				"EstimateddepartureDate": that.endDate.toLocaleDateString("en-US"),
				"Days": this.daysDifference,
				"Porttoll": this.porttoll,
				"Currency": this.currency,

				//Convert to Float with only two digits after comma
				"Totalamountoftoll": parseFloat(this.totalamount),
				"Totalamountoftolleur": parseFloat(this.totalamounteur)
			};
			//var oModel = oView.getModel("costum");
			var oModel = this.getView().getModel("costum");

			var aCostum = oModel.getProperty("/Costum");

			aCostum.push(newCostum);

			oModel.setProperty("/Costum", aCostum);
			var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

			oView.byId("imoComboBox").setSelectedKey("");
			oView.byId("imoComboBox").setSelectedKey("");
			oView.byId("inputDepartureport").setValue("");
			oView.byId("startDatePicker").setValue("");
			oView.byId("endDatePicker").setValue("");
			oView.byId("numdaysid").setValue("");
			oView.byId("porttollInput").setValue("");
			oView.byId("currencyInput").setValue("");
			oView.byId("totalamountInput").setValue("");
			oView.byId("totalamounteurInput").setValue("");

			MessageToast.show(oResourceBundle.getText("CostumadditionText"));

		}

	});
});