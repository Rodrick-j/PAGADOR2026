import express from "express";
import { HistorialAperturaViewController } from "./HistorialAperturaViewController";
import { checkIfAuthenticated, registerSesionActivity } from "../../../../../base/infra/AuthMiddleware";

const controller = new HistorialAperturaViewController();

const router = express.Router();

router.get("/historial_apertura_table", checkIfAuthenticated, (req, res) => controller.getHistorialAperturasTable(req, res));
router.get("/historial_apertura_form/:historial_apertura_id", checkIfAuthenticated, (req, res) => controller.getHistorialAperturaFormData(req, res));

router.post("/historial_apertura_form", checkIfAuthenticated, registerSesionActivity, (req, res) => controller.createOrUpdateHistorialApertura(req, res));
router.delete("/historial_apertura_table/:historial_apertura_id", checkIfAuthenticated, registerSesionActivity, (req, res) => controller.destroyHistorialApertura(req, res));
//aumentando busqueda de Aperturas
router.get("/historial_apertura", (req, res) => controller.getAllHistorialApertura(req, res));
//Historial Detalle
router.get("/historial_apertura_detalle_table", (req, res)=>controller.getTableHistorialAperturaDetalle(req,res));
router.post("/historial_apertura_detalle_form", checkIfAuthenticated, registerSesionActivity, (req, res) => controller.createOrUpdateHistorialAperturaDetalle(req, res));

router.get("/historial_apertura_detalle_form/:historial_apertura_id", checkIfAuthenticated, (req, res) => controller.getHistorialAperturaDetalleFormData(req, res));
router.delete("/historial_apertura_detalle_table/:historial_apertura_id", checkIfAuthenticated, registerSesionActivity, (req, res) => controller.destroyHistorialAperturaDetalle(req, res));

router.get("/historial_apertura_detalle_gasto", checkIfAuthenticated, (req, res) => controller.getTableHistorialGasto(req, res));
router.delete("/historial_apertura_detalle_gasto/:historial_gasto_id", checkIfAuthenticated, registerSesionActivity, (req, res) => controller.destroyHistorialGasto(req, res));
router.post('/pdf_reporte', checkIfAuthenticated, registerSesionActivity, (req, res) => controller.getHistorialAperturaPDFReporte(req, res));


export default router;
