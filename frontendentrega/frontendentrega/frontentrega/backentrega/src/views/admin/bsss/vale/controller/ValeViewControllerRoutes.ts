import express from "express";
import { ValeViewController } from "./ValeViewController";
import { checkIfAuthenticated, registerSesionActivity } from "../../../../../base/infra/AuthMiddleware";

const controller = new ValeViewController();

const router = express.Router();

router.get("/vale_table", checkIfAuthenticated, (req, res) => controller.getTableVale(req, res));
router.get("/vale_form/:vale_id", (req, res) => controller.getValeFormData(req, res));

router.get("/vale_estado", checkIfAuthenticated, (req, res) => controller.getValeEstado(req, res));

router.get("/sin_presupuesto/:litros/:asignacion_id/:vehiculo_id", checkIfAuthenticated, (req, res) => controller.getSinPresupuestoData(req, res));
router.post('/pdf_vale', checkIfAuthenticated, (req, res) => controller.getPDFVale(req, res));
router.post('/pdf_vale2', checkIfAuthenticated, (req, res) => controller.getPDFVale2(req, res));
router.post("/vale_form", checkIfAuthenticated, registerSesionActivity, (req, res) => controller.createOrUpdateVale(req, res));
router.post("/vale_table_approve/:vale_id", checkIfAuthenticated, registerSesionActivity, (req, res) => controller.changeApprove(req, res));
router.delete("/vale_table/:vale_id", checkIfAuthenticated, registerSesionActivity, (req, res) => controller.destroyVale(req, res));

router.get('/vehiculo_apertura/:vale_id', checkIfAuthenticated, (req, res) => controller.getVehiculoApertura(req, res));
router.post('/pdf_reporte', checkIfAuthenticated, registerSesionActivity, (req, res) => controller.getPDFReporte(req, res));

//Reporte

router.post('/pdf_reporte_vale/:id?', checkIfAuthenticated, (req, res) => controller.getPDFValeReporte(req, res)); //reportes
router.get("/reporte_vale_fecha_filtro/:fechaInicio/:fechaFin", checkIfAuthenticated, (req, res) => controller.getFechaFiltro(req, res));
router.get("/vale_apertura_filtro/:fechaInicio/:fechaFin/:apertura", checkIfAuthenticated, (req, res) => controller.getDatosApertura(req, res));
router.get("/vale_contrato_filtro/:fechaInicio/:fechaFin/:contrato", checkIfAuthenticated, (req, res) => controller.getDatosContrato(req, res));
router.get("/vale_combustible_filtro/:fechaInicio/:fechaFin/:combustible", checkIfAuthenticated, (req, res) => controller.getTipoCombustible(req, res));
router.get("/vale_vehiculo_filtro/:fechaInicio/:fechaFin/:placa", checkIfAuthenticated, (req, res) => controller.getDatosVehiculo(req, res));
router.post('/json_reporte/:id?', checkIfAuthenticated, (req, res) => controller.getReportJSON(req, res));

router.post("/vale_table_ejecutado/:vale_id", checkIfAuthenticated, registerSesionActivity, (req, res) => controller.changeEjecutado(req, res));
router.get("/reporte_vale_filtro_reporte_final/:fechaInicio/:fechaFin", checkIfAuthenticated, (req, res) => controller.getFechaFiltroReporteFinal(req, res));


export default router;
