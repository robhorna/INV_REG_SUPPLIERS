/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"com/innovatec/REG_SUPPLIERS/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});