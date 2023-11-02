sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent",
	"sap/ui/core/routing/History",
	"sap/m/MessageToast",
	"sap/ui/model/resource/ResourceModel"
], function(Controller, UIComponent, History, MessageToast, ResourceModel) {
	"use strict";

	return Controller.extend("VesselsManagementSystem1.controller.Adduser", {
		onInit: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("adduser").attachPatternMatched(this._onObjectMatched, this);
		},
		_onObjectMatched: function(oEvent) {
			this.getView().bindElement({
				path: "/" + window.decodeURIComponent(oEvent.getParameter("arguments").usersPath),
				model: "users"
			});
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
		onRegister: function() {
			var oView = this.getView();

			var Name = oView.byId("inputName").getValue();
			var Surname = oView.byId("inputSurname").getValue();
			var DOB = oView.byId("inputDOB").getValue();
			var Username = oView.byId("inputUsername").getValue();
			var Email = oView.byId("inputEmail").getValue();
			var Password = oView.byId("inputPassword").getValue();
			var Password1 = oView.byId("inputPassword1").getValue();

			//Check if passwords arethe same
			if (Password !== Password1) {
				// Show an error message or handle the mismatch as per your requirements.
				// For example, displaying a MessageToast:
				var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
				MessageToast.show(oResourceBundle.getText("PasswordMismatchError"));

				// Exit the function to prevent further processing.
				return;
			}

			var newUser = {

				"Name": Name,
				"Surname": Surname,
				"DOB": DOB,
				"Username": Username,
				"Email": Email,
				"Password": Password,
				"Password1": Password1

			};

			var oModel = oView.getModel("users");

			var aUsers = oModel.getProperty("/Users");

			//Check if the user already exists
			var existingUser = aUsers.find(function(user) {
				return user.Username === Username;
			});

			if (existingUser) {
				var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
				MessageToast.show(oResourceBundle.getText("UseralreadyexistsText"));
			} else {

				aUsers.push(newUser);

				oModel.setProperty("/Users", aUsers);

				//Clear data array for the next use

				oView.byId("inputName").setValue("");
				oView.byId("inputSurname").setValue("");
				oView.byId("inputDOB").setValue("");
				oView.byId("inputUsername").setValue("");
				oView.byId("inputEmail").setValue("");
				oView.byId("inputPassword").setValue("");
				oView.byId("inputPassword1").setValue("");

				var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
				MessageToast.show(oResourceBundle.getText("AdduserMessagetextuser"));
			}
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
		}

	});
});