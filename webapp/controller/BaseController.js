sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/core/mvc/OverrideExecution',
    // "./BaseExtension",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/ui/core/UIComponent",
    "sap/ui/core/routing/History",
    // "../model/formatter",
    // "../Constants",
    // "../util/uitool",
], function (
    Controller,
    OverrideExecution,
    // BaseExtension,
    JSONModel,
    Filter,
    FilterOperator,
    MessageBox,
    UIComponent,
    History,
    // formatter,
    // Constants,
    // uitool
) {
    "use strict";
    return Controller.extend("com.innovatec.REG_SUPPLIERS.BaseController", {
        metadata: {
            methods: {
                _onObjectMatched: {
                    public: true,
                    final: false,
                    overrideExecution: OverrideExecution.After,
                },
            },
        },
        // baseExt: BaseExtension,
        // formatter: formatter,
        // Constants: Constants,
        // uitool: uitool,
        getModel: function (sName) {
            return this.getView().getModel(sName);
        },
        setModel: function (oModel, sName) {
            return this.getView().setModel(oModel, sName);
        },
        getResourceBundle: function () {
            return this.getOwnerComponent().getModel("i18n").getResourceBundle();
        },
        navTo: function (psTarget, pmParameters, pbReplace) {
            this.getRouter().navTo(psTarget, pmParameters, pbReplace);
        },
        getRouter: function () {
            return UIComponent.getRouterFor(this);
        },
        onNavBack: function () {
            const sPreviousHash = History.getInstance().getPreviousHash();
            if (sPreviousHash !== undefined) {
                window.history.back();
            } else {
                this.getRouter().navTo("dashboard", {}, true /* no history*/ );
            }
        },
        isValidRuc: function (sRuc) {
            return /^[0-9]{11}$/g.test(sRuc);
        },
        showLoading: function (sText) {
            let sNewText = sText || '';
            Swal.fire({
                text: sNewText,
                backdrop: true,
                allowOutsideClick: false,
                allowEscapeKey: false,
            });
            Swal.showLoading();
        },
        closeLoading: function () {
            Swal.close();
        },
        str2HTML: function (sHTML) {
            let oParser = new DOMParser();
            return oParser.parseFromString(`${sHTML}`, "text/html").body
                .firstElementChild;
        },
        createHTMLElementFromString: function (sHTML) {
            let oParser = new DOMParser();
            return oParser.parseFromString(`${sHTML}`, "text/html").body.firstElementChild;
        },
        showLoadingBusy: function () {
            Swal.fire({
                allowOutsideClick: false,
                allowEscapeKey: false,
                background: "transparent",
            });
            Swal.showLoading();
        },
        closeLoadingBusy: function () {
            Swal.close();
        },
        fetchSupplierSAPData: function (sStcd1) {
            return new Promise(async(fnResolve, fnReject) => {
                let oSAPData = {
                    societies: null,
                    supplier: null
                };
                if (typeof sStcd1 === "string") {
                    sStcd1 = sStcd1.trim();
                } else {
                    sStcd1 = "";
                }
                try {
                    const {
                        data: {
                            results = []
                        }
                    } = await this.fetchSocieties(sStcd1);
                    oSAPData.societies = results;
                    if (!_.isEmpty(oSAPData.societies)) {
                        if (!_.isEmpty(oSAPData.societies.find(oItem => oItem.Bukrs == "" || _.isEmpty(oItem.Bukrs)))) {
                            oSAPData.supplier = null;
                            fnResolve(oSAPData);
                            return;
                        }
                    }
                    const {
                        data
                    } = await this.fetchSupplierDataBySociety(results[0].Lifnr);
                    oSAPData.supplier = data;
                    fnResolve(oSAPData);
                } catch (oErr) {
                    fnReject(oErr)
                }
            });
        },
        fetchSocieties: function (sStcd1) {
            return new Promise((fnResolve, fnReject) => {
                const oData = this.getOwnerComponent().getModel("hana");
                oData.read("/Im_02_SociedadFc_CabSet", {
                    filters: [
                        new Filter("Stcd1", FilterOperator.EQ, sStcd1)
                    ],
                    success: ((oData, oRes) => {
                        fnResolve({
                            data: oData,
                            response: oRes
                        });
                    }),
                    error: (oErr) => {
                        fnReject(oErr);
                    }
                });
            });
        },
        fetchSupplierDataBySociety: function (sLifnr) {
            return new Promise((fnResolve, fnReject) => {
                const oData = this.getOwnerComponent().getModel("hana");
                oData.read(`/Im_02_ProveedrFc_CabSet('${sLifnr}')`, {
                    success: ((oData, oRes) => {
                        fnResolve({
                            data: oData,
                            response: oRes
                        })
                    }),
                    error: (oErr) => {
                        fnReject(oErr)
                    }
                });
            });
        },
        paintItems: function () {
            let aNavItems = [];
            aNavItems = document.querySelectorAll("[data-menu]");
            for (let i = 0; i < aNavItems.length - 1; i++) {
                aNavItems[i].addEventListener("click", (oEv) => {
                    this.clearNavItems();
                    aNavItems[i].classList.add("active");
                });
            };
        },
        clearNavItems: function () {
            document.querySelectorAll("[data-menu]").forEach(($Item) => {
                $Item.classList.remove("active");
            });
        },
        hideNav: function () {
            if (!sap.ui.Device.system.desktop) {
                $('.sidebar-offcanvas').toggleClass('active');
            } else {
                $('body').toggleClass('sidebar-icon-only');
            }
        },
        // abstract
        _onObjectMatched: function () {},
        showFileMobile: function (oBlobBody, sDrurl) {
            let a = document.createElement("a");
            a.href = URL.createObjectURL(new Blob([oBlobBody]));
            a.download = sDrurl;
            a.click();
        },
        logout: function () {
            sap.ushell.Container.logout();
        },
        displayLoading: function ($El) {
            const sSpinner =
                `<div class="d-flex justify-content-center pt-2">
				  <div class="spinner-border spinner-border-sm" role="status">
				    <span class="visually-hidden">Loading...</span>
				  </div>
				</div>`;
            if ($El.nodeName === "TABLE") {
                const iColumns = $El.querySelectorAll("tr th").length;
                $El.tBodies[0].innerHTML = `<tr><td colspan="${iColumns}">${sSpinner}</td></tr>`;
            } else {
                $El.innerHTML = sSpinner;
            }
        },
        setEmptyDisplay: function ($El) {
            const sText =
                `<div class="d-flex justify-content-center">
                    <span>No hay datos</span>
                </div>`;
            if ($El.nodeName === "TABLE") {
                const iColumns = $El.querySelectorAll("tr th").length;
                $El.tBodies[0].innerHTML = `<tr><td colspan="${iColumns}">${sText}</td></tr>`;
            } else {
                $El.innerHTML = sText;
            }
        },
        getFolderPath: function (sPath) {
            let sNewPath = sPath;
            return sNewPath.replace(/\//g, '');
        },
        getFolderName: function (sPath) {
            let sNewPath = "";
            sNewPath = /[^/]*$/.exec(sPath.replace(/[/]$/, ''));
            return sNewPath[0];
        },
        getExtensionFile: function (sFilename) {
            let sExtension = "";
            sExtension = sFilename.match(/\.[0-9a-z]+$/i);
            return sExtension;

        },
        showMsg: function (sIcon, sTitle, sText) {
            Swal.fire({
                icon: sIcon,
                title: sTitle,
                text: sText,
            });
        },
        cleanXMLStr: function (sXmlStr) {
            return sXmlStr.replace(/ chancay ./g, "") //Quitar palabra que malogra el OrderReference
                .replace(/\\/g, "/") //Reemplazar el "\"
                .replace(/( \.\.)/g, "") //Quitar el " .."
                .replace(/^\u00EF\u00BB\u00BF/gm, "") //Quitar UTF-8 BOM (firefox)
                .replace(/\u0000/gm, "") //Quitar <?> (Caracter extraños)
                .replace(/\<\!\[CDATA\[/g, "") //Quitar <![CDATA[
                .replace(/\]\]\>/g, "") //Quitar ]]>
                .replace(/\&/g, "&amp;") //Combertir & en solo texto.
                // .replace(/ï¿½/g, "")
                .replace(/\.<\//g, "</") // Quitar los "." antes de cada sierre de etiqueta
                .replace(/<BR>/g, "") //Quitar <BR> que aparece en los textos
                .replace(/\b\s[A-Za-z]+(<|>)[A-Za-z]+\s\b/g, ""); //Quitar "<>" de los datos de XML 
        },
        getBlobItemName: function (sName) {
            return sName.replace(/\w+\/\w+\/\d+\/\d{4}\/\d{1,2}\/\d+\/[A-Z][A-Z0-9]{3}-\d{1,9}\//i, '');
        },
        getBlobBody: function (sBlobName) {
            return new Promise(async(resolve, reject) => {
                try {
                    let oBlobClient = await this.oContainerClient.getBlobClient(sBlobName);
                    let oDownloadRes = await oBlobClient.downloadToFile(sBlobName);
                    let oBlobBody = await oDownloadRes.blobBody;
                    resolve(oBlobBody);
                } catch (oErr) {
                    reject(oErr);
                }
            });
        },
        // Para ejecutar funciones get especificar Modelo, entidad, filtros[] y urlParams
        executeOdata: async function (oModel, sPath, aFilters, oUrlParameters) {
            // this.showLoadingBusy();
            let oDataModel = this.getOwnerComponent().getModel("hana");
            if (oModel) {
                oDataModel = oModel;
            } else {
                oDataModel = this.getOwnerComponent().getModel("hana");
            }
            return new Promise((fnResolve, fnReject) => {
                // const oDataModel = this.getOwnerComponent().getModel("hana");
                if (!_.isEmpty(oUrlParameters)) {
                    oDataModel.read(sPath, {
                        urlParameters: oUrlParameters,
                        filters: aFilters,
                        success: ((oData, oRes) => {
                            this.closeLoading();
                            fnResolve({
                                data: oData,
                                response: oRes
                            });
                        }),
                        error: (oErr) => {
                            console.error(oErr);
                            this.closeLoading();
                            fnReject(oErr);
                        }
                    });
                } else {
                    oDataModel.read(sPath, {
                        filters: aFilters,
                        success: ((oData, oRes) => {
                            fnResolve({
                                data: oData,
                                response: oRes
                            });
                        }),
                        error: (oErr) => {
                            console.error(oErr);
                            fnReject(oErr);
                        }
                    });
                }

            });
        },
    });
});