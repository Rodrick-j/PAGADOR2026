import express from "express";
import { ActaRecepcionViewController } from "./ActaRecepcionViewController";
import { checkIfAuthenticated, registerSesionActivity } from "../../../../../base/infra/AuthMiddleware";

const controller = new ActaRecepcionViewController();

const router = express.Router();

router.get("/acta_table", checkIfAuthenticated, (req, res) => controller.getActaRecepcionsTable(req, res));
router.get("/acta_recepcion_detalle_table", checkIfAuthenticated, (req, res) => controller.getActaRecepcionDetalleTable(req, res));
router.get("/acta_form/:acta_id", checkIfAuthenticated, (req, res) => controller.getActaRecepcionFormData(req, res));
router.get("/acta_recepcion_detalle_form/:acta_id", checkIfAuthenticated, (req, res) => controller.getActaRecepcionDetalleFormData(req, res));

router.post('/pdf_acta', checkIfAuthenticated, registerSesionActivity, (req, res) => controller.getPDFActa(req, res));
router.post("/acta_form", checkIfAuthenticated, registerSesionActivity, (req, res) => controller.createOrUpdateActaRecepcion(req, res));
router.post("/acta_recepcion_detalle_form", checkIfAuthenticated, registerSesionActivity, (req, res) => controller.createOrUpdateActaRecepcionDetalle(req, res));
router.post("/acta_table/:acta_id", checkIfAuthenticated, registerSesionActivity, (req, res) => controller.changeState(req, res));
router.post("/acta_sellar/:acta_id", checkIfAuthenticated, (req, res) => controller.changeActaRecepcionSellar(req, res));

router.delete("/acta_table/:acta_id", checkIfAuthenticated, registerSesionActivity, (req, res) => controller.destroyActaRecepcion(req, res));
router.delete("/acta_recepcion_detalle_table/:acta_id", checkIfAuthenticated, registerSesionActivity, (req, res) => controller.destroyActaRecepcionDetalle(req, res));


export default router;
