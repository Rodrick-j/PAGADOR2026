import express from "express";
import { AperturaViaticoViewController } from "./AperturaViaticoViewController";
import { checkIfAuthenticated, registerSesionActivity } from "../../../../../base/infra/AuthMiddleware";

const controller = new AperturaViaticoViewController();

const router = express.Router();

router.get("/apertura_viatico_table", checkIfAuthenticated, (req, res) => controller.getAperturaViaticosTable(req, res));
router.get("/apertura_viatico_form/:apertura_viatico_id", checkIfAuthenticated, (req, res) => controller.getAperturaViaticoFormData(req, res));

router.post("/apertura_viatico_form", checkIfAuthenticated, (req, res) => controller.createOrUpdateAperturaViatico(req, res));
router.delete("/apertura_Viatico_table/:apertura_viatico_id", checkIfAuthenticated, (req, res) => controller.destroyAperturaViatico(req, res));
router.post("/apertura_viatico_table/:apertura_viatico_id", checkIfAuthenticated, registerSesionActivity, (req, res) => controller.changeState(req, res));
//aumentando busqueda de Aperturas
router.get("/apertura_viatico", (req, res) => controller.getAllAperturaViatico(req, res));
router.get("/apertura_viatico_usuario", (req, res) => controller.getAperturaByUser(req, res));
router.get("/apertura_viatico_pasaje", (req, res) => controller.getAperturaByUserPasaje(req, res));
export default router;


