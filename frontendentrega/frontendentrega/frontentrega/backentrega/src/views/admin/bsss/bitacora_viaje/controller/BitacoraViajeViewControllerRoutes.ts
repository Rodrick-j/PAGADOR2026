import express from "express";
import { BitacoraViajeViewController } from "./BitacoraViajeViewController";
import { checkIfAuthenticated, registerSesionActivity } from "../../../../../base/infra/AuthMiddleware";

const controller = new BitacoraViajeViewController();

const router = express.Router();

router.get("/bitacora_viaje_table", checkIfAuthenticated, (req, res) => controller.getBitacoraViajesTable(req, res));
router.get("/bitacora_viaje_form/:bitacora_viaje_id", checkIfAuthenticated, (req, res) => controller.getBitacoraViajeFormData(req, res));

router.get("/bitacora_viajes", (req, res) => controller.getAllBitacoraViajes(req, res));
router.post("/bitacora_viaje_form", checkIfAuthenticated, registerSesionActivity, (req, res) => controller.createOrUpdateBitacoraViaje(req, res));
router.delete("/bitacora_viaje_table/:bitacora_viaje_id", checkIfAuthenticated, registerSesionActivity, (req, res) => controller.destroyBitacoraViaje(req, res));

export default router;
