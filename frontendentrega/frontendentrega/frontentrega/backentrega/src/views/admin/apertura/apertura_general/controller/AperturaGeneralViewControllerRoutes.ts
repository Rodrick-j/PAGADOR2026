import express from "express";
import { AperturaGeneralViewController } from "./AperturaGeneralViewController";
import { checkIfAuthenticated, registerSesionActivity } from "../../../../../base/infra/AuthMiddleware";

const controller = new AperturaGeneralViewController();

const router = express.Router();

router.get("/apertura_general_table", checkIfAuthenticated, (req, res) => controller.getAperturaGeneralsTable(req, res));
router.get("/apertura_general_form/:apertura_general_id", checkIfAuthenticated, (req, res) => controller.getAperturaGeneralFormData(req, res));

//Apertura por  - API
router.get('/apertura_general_api', (req, res) => {
    controller.getAperturaGeneralApi(req, res);
});

router.post("/apertura_general_form", checkIfAuthenticated, registerSesionActivity, (req, res) => controller.createOrUpdateAperturaGeneral(req, res));
router.delete("/apertura_general_table/:apertura_general_id", checkIfAuthenticated, registerSesionActivity, (req, res) => controller.destroyAperturaGeneral(req, res));
//aumentando busqueda de Aperturas
router.get("/apertura_general", (req, res) => controller.getAllAperturaGeneral(req, res));
router.get("/apertura_general2", (req, res) => controller.getAllAperturaGeneral2(req, res));
router.get("/apertura_general_vale", (req, res) => controller.getAllAperturaGeneralVale(req, res));

router.post("/apertura_general_table/:apertura_general_id", checkIfAuthenticated, registerSesionActivity, (req, res) => controller.changeState(req, res));

router.get('/apertura_general_presupuesto/:apertura_id', checkIfAuthenticated, (req, res) => controller.getPresupuesto(req, res));
router.get("/apertura_general_presupuesto_gasto/:gasto/:apertura_id/:debe_haber", checkIfAuthenticated, (req, res) => controller.getVerificaPresupuesto(req, res));
router.get("/apertura_verificacion/:apertura/:cod_fte/:cod_org/:objeto/:area/:area_hijo", checkIfAuthenticated, (req, res) => controller.getAperturaData(req, res));


export default router;
