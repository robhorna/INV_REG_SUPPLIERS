sap.ui.define([
	"./BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("com.innovatec.REG_SUPPLIERS.controller.Temp", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.innovatec.REG_SUPPLIERS.view.Temp
		 */
		onInit: function () {
			this.getRouter().getRoute("Temp").attachPatternMatched(this._onObjectMatched, this);
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
			console.log("test");
			this.getModel("appView").setProperty("/layout", "OneColumn");
		},
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.innovatec.REG_SUPPLIERS.view.Temp
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.innovatec.REG_SUPPLIERS.view.Temp
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.innovatec.REG_SUPPLIERS.view.Temp
		 */
		//	onExit: function() {
		//
		//	}

	});

});