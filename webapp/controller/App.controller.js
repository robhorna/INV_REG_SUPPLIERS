sap.ui.define([
	"./BaseController",
	'sap/m/MessageToast',
	"sap/ui/model/json/JSONModel",
], function (BaseController, MessageToast, JSONModel) {
	"use strict";

	return BaseController.extend("com.innovatec.REG_SUPPLIERS.controller.App", {
		onInit: function () {
			let oViewModel,
				fnSetAppNotBusy,
				iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();

			oViewModel = new JSONModel({
				busy: true,
				delay: 0,
				layout: "OneColumn",
				previousLayout: "",
				actionButtonsInfo: {
					midColumn: {
						fullScreen: false
					}
				}
			});
			this.setModel(oViewModel, "appView");

			fnSetAppNotBusy = function () {
				oViewModel.setProperty("/busy", false);
				oViewModel.setProperty("/delay", iOriginalBusyDelay);
			};
			// 			let oHtmlHeader = this.byId("htmlHeader");
			// 			if (!oHtmlHeader) {
			// 				oHtmlHeader = new HTML(this.createId("htmlHeader"), {
			// 					content: this.renderHeader()
			// 				});
			// 			}
			// 			this.byId("layoutMain").insertItem(oHtmlHeader);
			// 			let oHtmlContent = this.byId("htmlContent");
			// 			if (!oHtmlContent) {
			// 				oHtmlContent = new HTML(this.createId("htmlContent"), {
			// 					content: this.renderContentPage()
			// 				});
			// 			}
			// 			this.byId("layoutContent").insertItem(oHtmlContent);

			// since then() has no "reject"-path attach to the MetadataFailed-Event to disable the busy indicator in case of an error
			// this.getOwnerComponent().getModel().metadataLoaded().then(fnSetAppNotBusy);
			// this.getOwnerComponent().getModel().attachMetadataFailed(fnSetAppNotBusy);

			// apply content density mode to root view
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
			// 			this.loadUserData(fnSetAppNotBusy);
			fnSetAppNotBusy();
			this.navTo("Login");
		},
		onNavigationFinished: function (evt) {
			var toPage = evt.getParameter("to");
			MessageToast.show("Navigation to page '" + toPage.getTitle() + "' finished");
		},

		handleNav: function (evt) {
			var navCon = this.byId("navCon");
			var target = evt.getSource().data("target");
			if (target) {
				var animation = this.byId("animationSelect").getSelectedKey();
				navCon.to(this.byId(target), animation);
			} else {
				navCon.back();
			}
		}
	});
});