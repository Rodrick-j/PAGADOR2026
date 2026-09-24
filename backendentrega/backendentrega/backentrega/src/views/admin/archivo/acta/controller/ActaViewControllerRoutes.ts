import express from "express";
import { ActaViewController } from "./ActaViewController";
import { checkIfAuthenticated, registerSesionActivity } from "../../../../../base/infra/AuthMiddleware";

const controller = new ActaViewController();

const router = express.Router();

router.get("/acta_table", checkIfAuthenticated, (req, res) => controller.getActasTable(req, res));
router.get("/acta_table_reporte", checkIfAuthenticated, (req, res) => controller.getActasReporteTable(req, res));
router.get("/acta_form/:acta_id", checkIfAuthenticated, (req, res) => controller.getActaFormData(req, res));
router.post("/documentos/:nro", (req, res) => controller.getAllActaDocumento(req, res));
router.post("/acta_devolucion/:acta_id", checkIfAuthenticated, registerSesionActivity, (req, res) => controller.devolverActa(req, res));

router.post('/pdf_acta', checkIfAuthenticated, registerSesionActivity, (req, res) => controller.getPDFActa(req, res));
router.post("/acta_form", checkIfAuthenticated, registerSesionActivity, (req, res) => controller.createOrUpdateActa(req, res));
router.post("/acta_table/:acta_id", checkIfAuthenticated, (req, res) => controller.changeState(req, res));

router.delete("/acta_table/:acta_id", checkIfAuthenticated, registerSesionActivity, (req, res) => controller.destroyActa(req, res));
router.post('/pdf_acta2', checkIfAuthenticated, (req, res) => controller.getPDFActa2(req, res));

export default router;
