import express from "express";
import { ProcesoViewController } from "./ProcesoViewController";
import { checkIfAuthenticated } from "../../../../../base/infra/AuthMiddleware";

const controller = new ProcesoViewController();

const router = express.Router();

router.get("/proceso_table", checkIfAuthenticated, (req, res) => controller.getProcesosTable(req, res));
router.get("/proceso_form/:proceso_id", checkIfAuthenticated, (req, res) => controller.getProcesoFormData(req, res));
router.get('/proceso_table_timeline/:proceso_id', checkIfAuthenticated, (req, res) => controller.getTableProcesoDetalle(req, res));
router.get("/procesos", (req, res) => controller.getAllProceso(req, res));

router.post('/proceso_form', checkIfAuthenticated, (req, res) => controller.createOrUpdateProceso(req, res));

router.post("/procesodetalle_form", checkIfAuthenticated, (req, res) => controller.createOrUpdateProcesoDetalle(req, res));
router.post("/proceso_table/:proceso_id", checkIfAuthenticated, (req, res) => controller.changeState(req, res));
router.delete("/proceso_table/:proceso_id", checkIfAuthenticated, (req, res) => controller.destroyProceso(req, res));

router.get("/reporte_proceso_table", checkIfAuthenticated, (req, res) => controller.getReporteProcesosTable(req, res));
router.get("/reporte_proceso_table_500", checkIfAuthenticated, (req, res) => controller.getReporteProcesosTable500(req, res));
router.post('/pdf_proceso_detalle_reporte', checkIfAuthenticated, (req, res) => controller.getPDFProcesoDetalleReporte(req, res));
router.post('/pdf_proceso_general', checkIfAuthenticated, (req, res) => controller.getPDFProcesoGeneralReporte(req, res));
router.post("/proceso_table_approve/:proceso_id", checkIfAuthenticated, (req, res) => controller.changeApprove(req, res));

export default router;
