import express from "express";
import { BitacoraDetalleViewController } from "./BitacoraDetalleViewController";
import { checkIfAuthenticated, registerSesionActivity } from "../../../../../base/infra/AuthMiddleware";

const controller = new BitacoraDetalleViewController();

const router = express.Router();

router.get("/bitacora_detalle_table", checkIfAuthenticated, (req, res) => controller.getBitacoraDetallesTable(req, res));
router.get("/bitacora_detalle_form/:bitacora_detalle_id", checkIfAuthenticated, (req, res) => controller.getBitacoraDetalleFormData(req, res));

router.get("/bitacora_detalles", (req, res) => controller.getAllBitacoraDetalles(req, res));
router.post("/bitacora_detalle_form", checkIfAuthenticated, registerSesionActivity, (req, res) => controller.createOrUpdateBitacoraDetalle(req, res));
router.delete("/bitacora_detalle_table/:bitacora_detalle_id", checkIfAuthenticated, registerSesionActivity, (req, res) => controller.destroyBitacoraDetalle(req, res));

export default router;
