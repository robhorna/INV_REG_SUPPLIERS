sap.ui.define([
	"./BaseController",
], function (BaseController) {
	"use strict";

	return BaseController.extend("com.innovatec.REG_SUPPLIERS.controller.Login", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.innovatec.REG_SUPPLIERS.view.Login
		 */
		onInit: function () {
			this.getRouter().getRoute("Login").attachPatternMatched(this._onObjectMatched, this);
		},
		_onObjectMatched: function () {
			const oView = this.getView();
			this._$Page = oView.getDomRef();
			this._initVars();
			if (!this._$Page) {
				oView.attachEventOnce("afterRendering", () => {
					this._$Page = oView.getDomRef();
					this._initDomVars(); // 🔹 Asegurar inicialización
					this._afterRenderingProcess();
				});
			} else {
				this._initDomVars(); // 🔹 Inicializar antes de usar
				this._afterRenderingProcess();
			}

		},
		_initVars: function () {},
		_initDomVars: function () {},
		_afterRenderingProcess: function () {
		    var logoUrl = sap.ui.require.toUrl("com/innovatec/REG_SUPPLIERS/images/logo_santa.svg");
			document.querySelector(".img-logo").src = logoUrl;
			console.log("login");
			this.getModel("appView").setProperty("/layout", "OneColumn");
		},
		onRegister: function (oEvt) {
		    oEvt.preventDefault();
			this.navTo("National");
		},
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.innovatec.REG_SUPPLIERS.view.Login
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.innovatec.REG_SUPPLIERS.view.Login
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.innovatec.REG_SUPPLIERS.view.Login
		 */
		//	onExit: function() {
		//
		//	}

	});

});