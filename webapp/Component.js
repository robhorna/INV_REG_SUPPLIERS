sap.ui.define([
	"sap/ui/core/UIComponent",
    "sap/ui/Device",
    "sap/ui/core/routing/HashChanger",
    "com/innovatec/REG_SUPPLIERS/model/models",
], function (UIComponent, Device, HashChanger,models) {
	"use strict";

	return UIComponent.extend("com.innovatec.REG_SUPPLIERS.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			HashChanger.getInstance().replaceHash("");
			// 			this.oListSelector = new ListSelector();
			// 			this._oErrorHandler = new ErrorHandler(this);
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);
			// enable routing
			this.getRouter().initialize();
			if (sap.ushell) {
				var oRenderer = sap.ushell.Container.getRenderer("fiori2");
				oRenderer.setHeaderVisibility(false, false, ["home", "app"]);
			}
			// set the device model
			this.setModel(models.createDeviceModel(), "device");
		},
		getContentDensityClass: function () {
			if (this._sContentDensityClass === undefined) {
				// check whether FLP has already set the content density class; do nothing in this case
				if (document.body.classList.contains("sapUiSizeCozy") || document.body.classList.contains(
						"sapUiSizeCompact")) {
					this._sContentDensityClass = "";
				} else if (!Device.support.touch) { // apply "compact" mode if touch is not supported
					this._sContentDensityClass = "sapUiSizeCompact";
				} else {
					// "cozy" in case of touch support; default for most sap.m controls, but needed for desktop-first controls like sap.ui.table.Table
					this._sContentDensityClass = "sapUiSizeCozy";
				}
			}
			return this._sContentDensityClass;
		}
	});
});